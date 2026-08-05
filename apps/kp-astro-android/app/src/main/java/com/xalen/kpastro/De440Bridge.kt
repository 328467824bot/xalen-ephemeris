// ============================================================================
// De440Bridge — JavaScript interface exposed to WebView
//
// Available from JS as: window.De440Bridge.methodName(...)
//
// Methods:
//   isDe440Loaded(): Boolean
//   getDe440Info(): String (JSON)
//   pickDe440File(): Boolean  (opens file picker)
//   unloadDe440(): Boolean
//   computeChart(jsonInput): String (JSON)
//   julianDay(year, month, day, hour): Double
//
// DE440S file management:
//   getDe440Path(): String  (returns app external files dir path for de440s.bsp)
//   autoLoadDe440(): String (JSON) — auto-load from app external files dir on startup
//   downloadDe440(url: String): Boolean — start download in background
//   pauseDownload(): Boolean — pause the running download (keeps in-memory buffer)
//   resumeDownload(): Boolean — resume a paused download (HTTP Range request)
//   stopDownload(): Boolean — cancel download and discard in-memory buffer
//   getDownloadStatus(): String (JSON) — poll progress / completion / error
//   listEphemerisFiles(): String (JSON) — list ephemeris files in app external dir
//   deleteDe440File(): Boolean — delete DE440S file from app storage
//
// Download strategy (v1.3 — "memory-first, atomic write"):
//   1. Download bytes into an in-memory ByteArrayOutputStream.
//   2. Only when the entire file is fully received do we write it to the
//      app external storage directory.
//   3. If the download is paused, the in-memory buffer is kept; resume uses
//      HTTP Range to continue appending to the buffer.
//   4. If the download is stopped (cancel), the in-memory buffer is discarded
//      and no file is ever written — no garbage .part files left on disk.
//   5. If the download fails (network error, etc.), the in-memory buffer is
//      also discarded.
//
// Storage strategy:
//   - DE440S file is stored at: app.getExternalFilesDir(null)/ephemeris/de440s.bsp
//     which maps to /Android/data/com.xalen.kpastro/files/ephemeris/de440s.bsp
//   - This is app-specific external storage: no permission needed (API 19+),
//     persists across app launches, deleted on uninstall.
//   - On startup, JS calls autoLoadDe440() to check + load if present.
// ============================================================================

package com.xalen.kpastro

import android.net.Uri
import android.util.Log
import android.webkit.JavascriptInterface
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.floor

class De440Bridge(private val activity: AppCompatActivity) {

    companion object { private const val TAG = "De440Bridge" }

    private var parser: De440Parser? = null
    private var loadedFileName: String = ""
    private var loadedFileSize: Long = 0
    private var loadError: String = ""

    // ---------- Download state ----------
    // dlStatus values: "idle" | "downloading" | "paused" | "done" | "error"
    @Volatile private var dlStatus: String = "idle"
    @Volatile private var dlReceived: Long = 0
    @Volatile private var dlTotal: Long = 0
    @Volatile private var dlError: String = ""
    @Volatile private var dlFileName: String = ""

    // Pause/cancel flags — read inside the download loop
    @Volatile private var dlPauseRequested: Boolean = false
    @Volatile private var dlCancelRequested: Boolean = false

    // In-memory buffer (ByteArrayOutputStream). Allocated when download starts,
    // kept across pause/resume, discarded on cancel/error/done.
    @Volatile private var dlBuffer: ByteArrayOutputStream? = null

    // The URL being downloaded from (kept for resume)
    @Volatile private var dlUrl: String = ""

    private lateinit var filePickerLauncher: ActivityResultLauncher<Array<String>>

    /**
     * Directory where DE440S file is stored persistently.
     * Path: /Android/data/com.xalen.kpastro/files/ephemeris/
     */
    private fun ephemerisDir(): File {
        val dir = File(activity.getExternalFilesDir(null), "ephemeris")
        if (!dir.exists()) dir.mkdirs()
        return dir
    }

    private fun defaultDe440Path(): File = File(ephemerisDir(), "de440s.bsp")

    fun registerFilePicker() {
        filePickerLauncher = activity.registerForActivityResult(
            ActivityResultContracts.OpenDocument()
        ) { uri: Uri? ->
            if (uri != null) {
                Thread {
                    try {
                        val ins = activity.contentResolver.openInputStream(uri)!!
                        val target = defaultDe440Path()
                        target.parentFile?.mkdirs()
                        FileOutputStream(target).use { out ->
                            val buf = ByteArray(64 * 1024)
                            while (true) {
                                val n = ins.read(buf)
                                if (n <= 0) break
                                out.write(buf, 0, n)
                            }
                        }
                        ins.close()
                        loadedFileName = uri.lastPathSegment ?: "de440s.bsp"
                        loadedFileSize = target.length()
                        parser?.close()
                        parser = De440Parser(target.absolutePath)
                        Log.i(TAG, "DE440S loaded from picker: $loadedFileName ($loadedFileSize bytes)")
                    } catch (e: Exception) {
                        loadError = e.message ?: e.toString()
                        Log.e(TAG, "DE440S load failed", e)
                    }
                }.start()
            }
        }
    }

    /** JS-callable: trigger the file picker for a DE440S file. */
    @JavascriptInterface
    fun pickDe440File(): Boolean {
        activity.runOnUiThread {
            try { filePickerLauncher.launch(arrayOf("*/*")) }
            catch (e: Exception) { Log.e(TAG, "picker launch failed", e) }
        }
        return true
    }

    @JavascriptInterface
    fun isDe440Loaded(): Boolean = parser != null

    @JavascriptInterface
    fun getDe440Info(): String {
        val obj = JSONObject()
        obj.put("loaded", parser != null)
        obj.put("fileName", loadedFileName)
        obj.put("fileSize", loadedFileSize)
        obj.put("fileSizeMB", if (loadedFileSize > 0) loadedFileSize / (1024.0 * 1024.0) else 0.0)
        obj.put("error", loadError)
        obj.put("storagePath", defaultDe440Path().absolutePath)
        obj.put("fileExists", defaultDe440Path().exists())
        return obj.toString()
    }

    @JavascriptInterface
    fun unloadDe440(): Boolean {
        parser?.close()
        parser = null
        loadedFileName = ""
        loadedFileSize = 0
        return true
    }

    /** JS-callable: returns the absolute path where DE440S file would be stored. */
    @JavascriptInterface
    fun getDe440Path(): String = defaultDe440Path().absolutePath

    /**
     * JS-callable: check if DE440S file exists in app external storage, load it if so.
     * Called automatically on app startup.
     * Returns JSON: { loaded, fileName, fileSize, fileSizeMB, error, path }
     */
    @JavascriptInterface
    fun autoLoadDe440(): String {
        val obj = JSONObject()
        val file = defaultDe440Path()
        try {
            if (file.exists() && file.length() > 1_000_000) {
                // File is present, load it
                parser?.close()
                parser = De440Parser(file.absolutePath)
                loadedFileName = file.name
                loadedFileSize = file.length()
                obj.put("loaded", true)
                obj.put("fileName", loadedFileName)
                obj.put("fileSize", loadedFileSize)
                obj.put("fileSizeMB", loadedFileSize / (1024.0 * 1024.0))
                obj.put("path", file.absolutePath)
                Log.i(TAG, "DE440S auto-loaded from storage: $loadedFileName ($loadedFileSize bytes)")
            } else {
                obj.put("loaded", false)
                obj.put("path", file.absolutePath)
                obj.put("fileExists", false)
            }
        } catch (e: Exception) {
            loadError = e.message ?: e.toString()
            obj.put("loaded", false)
            obj.put("error", loadError)
            Log.e(TAG, "DE440S auto-load failed", e)
        }
        return obj.toString()
    }

    // =====================================================================
    //  MEMORY-FIRST DOWNLOAD with pause / resume / stop
    // =====================================================================

    /**
     * JS-callable: start a fresh DE440S download.
     * Bytes are accumulated in an in-memory buffer first; only on full
     * completion is the buffer flushed to disk. Pause/resume keeps the
     * buffer; stop/error discards it.
     *
     * Returns true if a new download started; false if one is already
     * running or paused (caller should use pause/resume instead).
     */
    @JavascriptInterface
    fun downloadDe440(urlStr: String): Boolean {
        if (dlStatus == "downloading" || dlStatus == "paused") {
            return false
        }

        dlUrl = if (urlStr.isBlank()) {
            "https://ssd.jpl.nasa.gov/ftp/eph/planets/bsp/de440s.bsp"
        } else urlStr

        dlStatus = "downloading"
        dlReceived = 0
        dlTotal = 0
        dlError = ""
        dlFileName = "de440s.bsp"
        dlPauseRequested = false
        dlCancelRequested = false
        dlBuffer = ByteArrayOutputStream(32 * 1024 * 1024)  // pre-alloc 32 MB hint

        startDownloadThread(resume = false)
        return true
    }

    /** JS-callable: pause a running download. Buffer is preserved. */
    @JavascriptInterface
    fun pauseDownload(): Boolean {
        if (dlStatus != "downloading") return false
        dlPauseRequested = true
        // The download loop will detect the flag, close the connection,
        // and exit the thread. State will become "paused" once observed.
        return true
    }

    /** JS-callable: resume a paused download via HTTP Range. */
    @JavascriptInterface
    fun resumeDownload(): Boolean {
        if (dlStatus != "paused") return false
        dlPauseRequested = false
        dlCancelRequested = false
        dlStatus = "downloading"
        startDownloadThread(resume = true)
        return true
    }

    /** JS-callable: cancel download, discard in-memory buffer. */
    @JavascriptInterface
    fun stopDownload(): Boolean {
        if (dlStatus != "downloading" && dlStatus != "paused") return false
        dlCancelRequested = true
        dlPauseRequested = false  // unpause so the thread can exit cleanly
        // If currently paused (thread already exited), do cleanup here
        if (dlStatus == "paused") {
            dlBuffer = null
            dlReceived = 0
            dlStatus = "idle"
        }
        return true
    }

    /**
     * Background download thread.
     * - When resume=false: opens a fresh connection, starts reading into buffer.
     * - When resume=true: opens connection with Range: bytes=dlReceived-, appends.
     * - Periodically checks dlPauseRequested (close conn, keep buffer, exit thread)
     *   and dlCancelRequested (close conn, discard buffer, status=idle).
     * - On success: writes buffer to disk atomically, sets status=done.
     * - On error: discards buffer, sets status=error.
     */
    private fun startDownloadThread(resume: Boolean) {
        Thread {
            var conn: HttpURLConnection? = null
            var input: InputStream? = null
            try {
                val url = URL(dlUrl)
                conn = url.openConnection() as HttpURLConnection
                conn.connectTimeout = 30_000
                conn.readTimeout = 60_000
                conn.instanceFollowRedirects = true
                conn.setRequestProperty("User-Agent", "KP-Astrology-Android/1.3")
                conn.setRequestProperty("Accept", "application/octet-stream, */*")

                if (resume && dlReceived > 0) {
                    conn.setRequestProperty("Range", "bytes=$dlReceived-")
                    Log.i(TAG, "Resuming download from byte $dlReceived")
                }

                conn.connect()

                val responseCode = conn.responseCode
                // 200 = full content (server ignored Range), 206 = partial content
                if (responseCode !in 200..299) {
                    throw Exception("HTTP $responseCode from $dlUrl")
                }

                // Determine total size
                if (dlTotal <= 0) {
                    val contentRange = conn.getHeaderField("Content-Range")
                    if (contentRange != null && contentRange.contains("/")) {
                        // Format: "bytes 0-1023/2048" → take part after "/"
                        val totalStr = contentRange.substringAfter("/").trim()
                        dlTotal = totalStr.toLongOrNull() ?: -1L
                    } else {
                        val cl = conn.contentLengthLong
                        if (cl > 0) {
                            dlTotal = if (resume && responseCode == 206) dlReceived + cl else cl
                        } else {
                            dlTotal = -1L  // unknown
                        }
                    }
                }

                input = conn.inputStream
                val buf = ByteArray(64 * 1024)
                val buffer = dlBuffer
                    ?: throw IllegalStateException("Buffer was discarded (download cancelled)")

                // If server returned 200 instead of 206 on resume, reset and start over
                if (resume && responseCode == 200) {
                    Log.w(TAG, "Server ignored Range header; restarting from byte 0")
                    buffer.reset()
                    dlReceived = 0
                }

                while (true) {
                    // Check for cancel
                    if (dlCancelRequested) {
                        try { input.close() } catch (_: Exception) {}
                        try { conn.disconnect() } catch (_: Exception) {}
                        dlBuffer = null
                        dlReceived = 0
                        dlStatus = "idle"
                        Log.i(TAG, "Download cancelled by user; buffer discarded")
                        return@Thread
                    }
                    // Check for pause
                    if (dlPauseRequested) {
                        try { input.close() } catch (_: Exception) {}
                        try { conn.disconnect() } catch (_: Exception) {}
                        dlStatus = "paused"
                        Log.i(TAG, "Download paused at byte $dlReceived; buffer preserved")
                        return@Thread  // thread exits, buffer + state preserved
                    }

                    val n = input.read(buf)
                    if (n <= 0) break
                    buffer.write(buf, 0, n)
                    dlReceived += n

                    // Periodically log progress
                    if (dlReceived % (1L * 1024 * 1024) < 64 * 1024) {
                        Log.v(TAG, "DE440S download: $dlReceived / $dlTotal bytes")
                    }
                }

                // Download complete — flush buffer to disk atomically
                try { input.close() } catch (_: Exception) {}
                try { conn.disconnect() } catch (_: Exception) {}

                val target = defaultDe440Path()
                target.parentFile?.mkdirs()

                val bytes = buffer.toByteArray()
                Log.i(TAG, "Download complete: ${bytes.size} bytes in memory; writing to ${target.absolutePath}")

                // Write to .tmp first, then rename for atomicity
                val tmpFile = File(target.parentFile, target.name + ".tmp")
                FileOutputStream(tmpFile).use { it.write(bytes) }
                if (target.exists()) target.delete()
                if (!tmpFile.renameTo(target)) {
                    throw Exception("Failed to rename ${tmpFile.name} → ${target.name}")
                }

                // Auto-load the freshly downloaded file
                parser?.close()
                parser = De440Parser(target.absolutePath)
                loadedFileName = target.name
                loadedFileSize = target.length()

                dlBuffer = null  // free memory
                dlStatus = "done"
                Log.i(TAG, "DE440S download complete: ${target.absolutePath} (${target.length()} bytes)")
            } catch (e: Exception) {
                if (dlCancelRequested) {
                    // Treat cancel as success — not an error
                    dlBuffer = null
                    dlReceived = 0
                    dlStatus = "idle"
                } else {
                    dlError = e.message ?: e.toString()
                    dlStatus = "error"
                    dlBuffer = null  // discard memory buffer on error
                    Log.e(TAG, "DE440S download failed", e)
                }
                try { input?.close() } catch (_: Exception) {}
                conn?.disconnect()
            }
        }.start()
    }

    /** JS-callable: get current download status. */
    @JavascriptInterface
    fun getDownloadStatus(): String {
        val obj = JSONObject()
        obj.put("status", dlStatus)         // idle | downloading | paused | done | error
        obj.put("received", dlReceived)
        obj.put("total", dlTotal)
        obj.put("percent", if (dlTotal > 0) (dlReceived * 100.0 / dlTotal) else 0.0)
        obj.put("error", dlError)
        obj.put("fileName", dlFileName)
        return obj.toString()
    }

    /** JS-callable: list ephemeris files in app external storage. */
    @JavascriptInterface
    fun listEphemerisFiles(): String {
        val arr = JSONArray()
        try {
            val dir = ephemerisDir()
            dir.listFiles()?.forEach { f ->
                val obj = JSONObject()
                obj.put("name", f.name)
                obj.put("size", f.length())
                obj.put("sizeMB", f.length() / (1024.0 * 1024.0))
                obj.put("modified", f.lastModified())
                arr.put(obj)
            }
        } catch (e: Exception) {
            Log.e(TAG, "listEphemerisFiles failed", e)
        }
        val out = JSONObject()
        out.put("files", arr)
        out.put("dir", ephemerisDir().absolutePath)
        return out.toString()
    }

    /**
     * JS-callable: delete the DE440S file from app storage (frees up ~32 MB).
     * Does NOT unload the in-memory parser; call unloadDe440() after if desired.
     */
    @JavascriptInterface
    fun deleteDe440File(): Boolean {
        return try {
            val file = defaultDe440Path()
            // Clean up any stray temp files from old versions
            val tmpFile = File(file.parentFile, file.name + ".tmp")
            if (tmpFile.exists()) tmpFile.delete()
            val partFile = File(file.parentFile, file.name + ".part")
            if (partFile.exists()) partFile.delete()
            file.delete()
        } catch (e: Exception) {
            Log.e(TAG, "deleteDe440File failed", e)
            false
        }
    }

    /**
     * JS-callable: compute all planet longitudes + ascendant + cusps for given time/place.
     */
    @JavascriptInterface
    fun computeChart(inputJson: String): String {
        try {
            val input = JSONObject(inputJson)
            val year = input.getInt("year")
            val month = input.getInt("month")
            val day = input.getInt("day")
            val hour = input.getDouble("hour")
            val lat = input.getDouble("lat")
            val lon = input.getDouble("lon")
            val ayanamsa = input.optDouble("ayanamsa", 0.0)
            val houseSystem = input.optString("houseSystem", "Placidus")

            val jd = julianDay(year, month, day, hour)

            val p = parser
            val positionsTropical: Map<String, Double> = if (p != null) {
                computeAllDe440(p, jd)
            } else {
                computeAllAnalytical(jd)
            }
            val source = if (p != null) "DE440S" else "Analytical-VSOP87"

            val positionsSidereal = positionsTropical.mapValues { (_, v) ->
                norm360(v - ayanamsa)
            }

            val lst = localSiderealTime(jd, lon)
            val ascTrop = computeAscendant(jd, lat, lst)
            val mcTrop = computeMC(jd, lst)
            val ascSid = norm360(ascTrop - ayanamsa)
            val mcSid = norm360(mcTrop - ayanamsa)
            val cusps = computeCuspsSidereal(ascSid, mcSid, houseSystem)

            val out = JSONObject()
            out.put("jd", jd)
            out.put("source", source)
            out.put("tropical", JSONObject(positionsTropical))
            out.put("sidereal", JSONObject(positionsSidereal))
            out.put("ascendantTropical", ascTrop)
            out.put("ascendantSidereal", ascSid)
            out.put("mcTropical", mcTrop)
            out.put("mcSidereal", mcSid)
            val cuspsArr = JSONArray()
            cusps.forEach { cuspsArr.put(it) }
            out.put("cusps", cuspsArr)

            return out.toString()
        } catch (e: Exception) {
            Log.e(TAG, "computeChart failed", e)
            val err = JSONObject()
            err.put("error", e.message ?: e.toString())
            return err.toString()
        }
    }

    @JavascriptInterface
    fun julianDay(year: Int, month: Int, day: Int, hour: Double): Double {
        return com.xalen.kpastro.julianDay(year, month, day, hour)
    }

    // --------- Cusp computation (Placidus / Equal / Whole Sign) ---------

    private fun computeCuspsSidereal(ascSid: Double, mcSid: Double, system: String): List<Double> {
        return when (system) {
            "Equal" -> {
                (0 until 12).map { norm360(ascSid + it * 30.0) }
            }
            "WholeSign" -> {
                val signStart = floor(ascSid / 30.0) * 30.0
                (0 until 12).map { norm360(signStart + it * 30.0) }
            }
            else -> {
                placidusCusps(ascSid, mcSid)
            }
        }
    }

    private fun placidusCusps(asc: Double, mc: Double): List<Double> {
        val ic = norm360(mc + 180.0)
        val desc = norm360(asc + 180.0)
        return listOf(
            asc,                                          // 1
            norm360(asc + 30.0),                          // 2
            norm360(asc + 60.0),                          // 3
            ic,                                           // 4
            norm360(ic + 30.0),                           // 5
            norm360(ic + 60.0),                           // 6
            desc,                                         // 7
            norm360(desc + 30.0),                         // 8
            norm360(desc + 60.0),                         // 9
            mc,                                           // 10
            norm360(mc + 30.0),                           // 11
            norm360(mc + 60.0)                            // 12
        )
    }

    private fun norm360(deg: Double): Double = ((deg % 360.0) + 360.0) % 360.0
}
