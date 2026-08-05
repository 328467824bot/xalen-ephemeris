package io.zhipu.kpdivination

import android.app.Activity
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Vibrator
import android.util.Log
import android.webkit.JavascriptInterface
import android.widget.Toast

/**
 * JavaScript ↔ Kotlin 桥接接口。
 *
 * 在 WebView 中通过 `window.AndroidBridge.xxx()` 调用，所有 public 方法
 * 必须 (a) 简单、(b) 同步可返回值或 fire-and-forget、(c) 不阻塞 UI 线程。
 *
 * @JavascriptInterface 注解的方法会被注入到 JS 上下文，只能用基础类型和
 * String 作为参数和返回值。
 *
 * 暴露的接口（与 web-app/src/app.js 中的 Native 对象对齐）：
 *   - copyToClipboard(text): Boolean
 *   - shareText(text): Unit
 *   - exportFile(filename, content): Unit    (异步 — 触发 SAF)
 *   - showToast(message): Unit
 *   - hapticFeedback(): Unit
 */
class WebAppInterface(
    private val activity: Activity,
    private val clipboardManager: ClipboardManager,
    private val vibrator: Vibrator?,
    private val onExportRequested: (filename: String, content: String) -> Unit
) {

    /** 当前等待写入 SAF 文件的文本内容（被 [MainActivity.createDocumentLauncher] 消费） */
    @Volatile
    var pendingExportContent: String? = null

    // ───────────────────────── Clipboard ─────────────────────────

    /**
     * 复制文本到系统剪贴板。
     * @return true 成功；false 失败
     */
    @JavascriptInterface
    fun copyToClipboard(text: String?): Boolean {
        if (text == null) return false
        return try {
            val clip = ClipData.newPlainText("KP Divination", text)
            clipboardManager.setPrimaryClip(clip)
            Log.i(TAG, "Copied ${text.length} chars to clipboard")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Clipboard copy failed", e)
            false
        }
    }

    // ───────────────────────── Share (Intent.ACTION_SEND) ─────────────────────────

    /**
     * 调起系统分享 Sheet，分享纯文本。
     */
    @JavascriptInterface
    fun shareText(text: String?) {
        if (text == null) return
        activity.runOnUiThread {
            try {
                val sendIntent = Intent().apply {
                    action = Intent.ACTION_SEND
                    putExtra(Intent.EXTRA_TEXT, text)
                    putExtra(Intent.EXTRA_TITLE, "KP 排盘结果")
                    type = "text/plain"
                }
                val chooser = Intent.createChooser(sendIntent, "分享排盘结果").apply {
                    // 新任务（防止分享 Activity 退出后回到我们这里崩溃）
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                activity.startActivity(chooser)
                Log.i(TAG, "Share intent dispatched, ${text.length} chars")
            } catch (e: Exception) {
                Log.e(TAG, "Share failed", e)
                showToast("分享失败: ${e.message}")
            }
        }
    }

    // ───────────────────────── Export file (SAF) ─────────────────────────

    /**
     * 导出文件到用户选择的位置（系统文件选择器 / Downloads）。
     * 实际写入由 [MainActivity.createDocumentLauncher] 的回调完成。
     *
     * 注意：从 Android 11+ 起，应用不能直接写 Downloads/，必须用 SAF。
     */
    @JavascriptInterface
    fun exportFile(filename: String?, content: String?) {
        if (filename == null || content == null) {
            showToast("导出参数无效")
            return
        }
        Log.i(TAG, "Export requested: $filename (${content.length} chars)")
        activity.runOnUiThread {
            try {
                onExportRequested(filename, content)
            } catch (e: Exception) {
                Log.e(TAG, "Export launch failed", e)
                showToast("导出失败: ${e.message}")
            }
        }
    }

    // ───────────────────────── Toast ─────────────────────────

    /**
     * 显示系统 Toast（短时长）。
     */
    @JavascriptInterface
    fun showToast(message: String?) {
        if (message == null) return
        activity.runOnUiThread {
            Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * 显示系统 Toast（长时长）。
     */
    @JavascriptInterface
    fun showToastLong(message: String?) {
        if (message == null) return
        activity.runOnUiThread {
            Toast.makeText(activity, message, Toast.LENGTH_LONG).show()
        }
    }

    // ───────────────────────── Haptic feedback ─────────────────────────

    /**
     * 短振动反馈（成功提示用）。
     */
    @JavascriptInterface
    fun hapticFeedback() {
        try {
            vibrator?.let {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    it.vibrate(android.os.VibrationEffect.createOneShot(
                        30, android.os.VibrationEffect.DEFAULT_AMPLITUDE
                    ))
                } else {
                    @Suppress("DEPRECATION")
                    it.vibrate(30)
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "Haptic failed", e)
        }
    }

    // ───────────────────────── Device info (供前端调试) ─────────────────────────

    /**
     * 返回设备信息 JSON 字符串（供前端做兼容性判断）。
     */
    @JavascriptInterface
    fun getDeviceInfo(): String {
        return """{"manufacturer":"${Build.MANUFACTURER}","model":"${Build.MODEL}","sdk":${Build.VERSION.SDK_INT},"release":"${Build.VERSION.RELEASE}"}"""
    }

    /**
     * 检查原生桥接是否可用 — 给 JS 一个明确的探针。
     */
    @JavascriptInterface
    fun isNativeBridge(): Boolean = true

    companion object {
        private const val TAG = "KPDivination.WebInterface"
    }
}
