package io.zhipu.kpdivination.util

import android.content.Context
import android.net.Uri
import android.util.Log
import java.io.OutputStream

/**
 * 文件 IO 辅助工具。
 *
 * Android 11+ 起应用沙盒限制严格，推荐用 Storage Access Framework (SAF)
 * 让用户选择导出位置。本类只负责把字符串写入 SAF 返回的 [Uri]。
 */
class FileHelper(private val context: Context) {

    /**
     * 把 [content] 写入 [uri]（由 SAF CreateDocument 返回）。
     */
    fun writeUri(uri: Uri, content: String) {
        var os: OutputStream? = null
        try {
            os = context.contentResolver.openOutputStream(uri, "wt") // "wt" = truncate + write
                ?: throw IllegalStateException("ContentResolver returned null stream for $uri")
            os.write(content.toByteArray(Charsets.UTF_8))
            os.flush()
            Log.i(TAG, "Wrote ${content.length} chars to $uri")
        } catch (e: Exception) {
            Log.e(TAG, "writeUri failed", e)
            throw e
        } finally {
            os?.runCatching { close() }
        }
    }

    companion object {
        private const val TAG = "KPDivination.FileHelper"
    }
}
