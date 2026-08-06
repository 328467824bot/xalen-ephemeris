package io.zhipu.kpdivination

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.KeyEvent
import android.view.View
import android.view.WindowInsetsController
import android.webkit.ConsoleMessage
import android.webkit.CookieManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import io.zhipu.kpdivination.util.FileHelper

/**
 * 主 Activity — WebView 容器。
 *
 * 架构：
 *   1. WebView 加载 `assets/web/index.html`
 *   2. JavaScript 通过 `window.AndroidBridge` 调用原生 [WebAppInterface]
 *      完成复制 / 分享 / 导出 / Toast / 振动反馈
 *   3. 所有天文计算在网页内由 XALEN WASM 完成（离线）
 *
 * 设计原则：
 *   - 原生层只做「JavaScript 做不了或做不好」的事（剪贴板、文件 IO、Intent 分享、Toast、振动）
 *   - 计算与 UI 全部交给网页，便于跨平台复用与热更新
 *   - 离线优先：所有资源（HTML/JS/CSS/WASM）打包在 assets 中
 */
class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private lateinit var webInterface: WebAppInterface
    private val fileHelper: FileHelper by lazy { FileHelper(this) }

    // SAF (Storage Access Framework) 创建文档回调
    private val createDocumentLauncher = registerForActivityResult(
        ActivityResultContracts.CreateDocument("text/markdown")
    ) { uri: Uri? ->
        val content = webInterface.pendingExportContent
        webInterface.pendingExportContent = null
        if (uri != null && content != null) {
            fileHelper.writeUri(uri, content)
            webInterface.showToast("已导出排盘文件")
        } else {
            webInterface.showToast("导出已取消")
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 请求 GPS 运行时权限（Android 6.0+ 需要）
        requestLocationPermission()

        // 状态栏沉浸式（深色主题，状态栏文字浅色）
        configureSystemBars()

        webView = WebView(this).apply {
            setBackgroundColor(Color.TRANSPARENT)
            background = android.graphics.drawable.ColorDrawable(Color.parseColor("#1a1626"))
        }
        setContentView(webView)

        // 注入 JS 接口
        webInterface = WebAppInterface(
            activity = this,
            clipboardManager = getSystemService(android.content.ClipboardManager::class.java),
            vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
                getSystemService(android.os.VibratorManager::class.java)?.defaultVibrator
            else
                @Suppress("DEPRECATION") getSystemService(android.os.Vibrator::class.java),
            onExportRequested = { filename, content ->
                webInterface.pendingExportContent = content
                createDocumentLauncher.launch(filename)
            }
        )
        webView.addJavascriptInterface(webInterface, "AndroidBridge")

        configureWebView()

        // 加载本地网页（assets/web/index.html）
        webView.loadUrl("file:///android_asset/web/index.html")
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        // Debug 构建启用 WebView 远程调试（chrome://inspect）
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true)
        }

        val settings: WebSettings = webView.settings
        // 必需：启用 JS
        settings.javaScriptEnabled = true
        // WASM 支持（Android WebView 80+ 默认启用）
        // 启用 DOM storage、IndexedDB（WASM 加载可能用到）
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        // 允许 file:// 协议加载本地资源（WASM / JS / CSS）
        settings.allowFileAccess = true
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true
        // 缓存策略：本地资源用 LOAD_NO_CACHE 便于调试，生产可改 LOAD_DEFAULT
        settings.cacheMode = WebSettings.LOAD_NO_CACHE
        // 视口
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        // 缩放（移动端禁用，避免双指缩放破坏布局）
        settings.setSupportZoom(false)
        settings.builtInZoomControls = false
        // 媒体
        settings.mediaPlaybackRequiresUserGesture = false
        // 混合内容（避免告警）
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        // Cookie（虽然全离线，但避免某些库初始化报错）
        CookieManager.getInstance().setAcceptCookie(false)

        // WebViewClient：内部链接也在 WebView 内打开
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                // 外部链接（http/https）跳系统浏览器，本地 file:// 不拦截
                val url = request.url
                if (url.scheme == "http" || url.scheme == "https") {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, url)
                        startActivity(intent)
                    } catch (e: Exception) {
                        Log.w(TAG, "No browser to open $url", e)
                    }
                    return true
                }
                return false
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                Log.i(TAG, "WebView page loaded: $url")
            }

            override fun onReceivedError(
                view: WebView?, request: WebResourceRequest?, error: android.webkit.WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                Log.e(TAG, "WebView error: ${error?.description} for ${request?.url}")
            }
        }

        // WebChromeClient：捕获 console.log / alert / prompt + GPS 权限
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                val level = when (consoleMessage.messageLevel()) {
                    ConsoleMessage.MessageLevel.ERROR -> Log.ERROR
                    ConsoleMessage.MessageLevel.WARNING -> Log.WARN
                    ConsoleMessage.MessageLevel.DEBUG -> Log.DEBUG
                    ConsoleMessage.MessageLevel.TIP -> Log.INFO
                    else -> Log.INFO
                }
                Log.println(level, "WebConsole",
                    "[${consoleMessage.sourceId()}:${consoleMessage.lineNumber()}] ${consoleMessage.message()}")
                return true
            }

            override fun onJsAlert(
                view: WebView?, url: String?, message: String?, result: android.webkit.JsResult?
            ): Boolean {
                Log.i(TAG, "JS alert: $message")
                return super.onJsAlert(view, url, message, result)
            }

            // ── GPS 权限回调 ──
            // WebView 的 navigator.geolocation 需要这里授权，否则即使 APP 有 GPS 权限也会失败
            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: android.webkit.GeolocationPermissions.Callback?
            ) {
                Log.i(TAG, "GPS 权限请求: origin=$origin")
                callback?.invoke(origin, true, false)
            }

            override fun onGeolocationPermissionsHidePrompt() {
                Log.i(TAG, "GPS 权限请求已取消")
            }
        }
    }

    private fun configureSystemBars() {
        // 沉浸式状态栏：深色背景 + 浅色文字
        val window = window
        window.statusBarColor = Color.parseColor("#1a1626")
        window.navigationBarColor = Color.parseColor("#1a1626")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val controller = window.insetsController
            controller?.setSystemBarsAppearance(
                0,
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
            )
        } else {
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = window.decorView.systemUiVisibility and
                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR.inv()
        }
    }

    // ───────────────────────── Back button ─────────────────────────

    @Deprecated("Deprecated in Java", ReplaceWith("onBackPressed()"))
    override fun onBackPressed() {
        @Suppress("DEPRECATION")
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    // ───────────────────────── GPS 运行时权限 ─────────────────────────

    private val LOCATION_PERMISSION_REQUEST = 1001

    private fun requestLocationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val fine = checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION)
            val coarse = checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION)
            if (fine != android.content.pm.PackageManager.PERMISSION_GRANTED ||
                coarse != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                Log.i(TAG, "请求 GPS 运行时权限")
                requestPermissions(
                    arrayOf(
                        android.Manifest.permission.ACCESS_FINE_LOCATION,
                        android.Manifest.permission.ACCESS_COARSE_LOCATION
                    ),
                    LOCATION_PERMISSION_REQUEST
                )
            } else {
                Log.i(TAG, "GPS 权限已授予")
            }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == LOCATION_PERMISSION_REQUEST) {
            if (grantResults.isNotEmpty() && grantResults[0] == android.content.pm.PackageManager.PERMISSION_GRANTED) {
                Log.i(TAG, "GPS 权限已授予（用户同意）")
            } else {
                Log.w(TAG, "GPS 权限被拒绝")
            }
        }
    }

    companion object {
        private const val TAG = "KPDivination.MainActivity"

        /** 打开应用详情页（用于权限引导） */
        fun openAppSettings(activity: ComponentActivity) {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.fromParts("package", activity.packageName, null)
            }
            activity.startActivity(intent)
        }
    }
}
