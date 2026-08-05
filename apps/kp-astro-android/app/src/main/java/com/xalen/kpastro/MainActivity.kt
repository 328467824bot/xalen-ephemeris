// ============================================================================
// MainActivity — KP Astrology native Android shell with WebView
//
// The WebView loads index.html + kp-astro.js (Kotlin/JS bundle) from assets/web/.
// A native @JavascriptInterface "De440Bridge" is injected to provide:
//   - DE440S file picker
//   - DE440S JPL parser (high-precision planet positions)
//   - DE440S downloader (auto-saves to Android/data/.../files/ephemeris/)
//   - Auto-load DE440S from app external storage on startup
//   - Analytical ephemeris fallback (VSOP87 truncated — no DE440S needed)
//   - Native Julian Day + ascendant + cusps computation
// ============================================================================

package com.xalen.kpastro

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var bridge: De440Bridge

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // De440Bridge must be registered BEFORE onCreate returns to ensure
        // the file picker launcher is attached to the activity lifecycle.
        bridge = De440Bridge(this)
        bridge.registerFilePicker()

        webView = WebView(this)
        setContentView(webView)

        with(webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            cacheMode = WebSettings.LOAD_DEFAULT
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            loadWithOverviewMode = true
            useWideViewPort = true

            // Enable pinch-zoom (user requested: "也没法缩放")
            builtInZoomControls = true
            displayZoomControls = false   // hide +/- buttons, allow pinch only
            setSupportZoom(true)
        }

        // Inject the bridge BEFORE loading the page so window.De440Bridge exists on load
        webView.addJavascriptInterface(bridge, "De440Bridge")

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Inject a tiny bootstrap telling the page the bridge is ready.
                // Also trigger auto-load of DE440S from app external storage if present.
                view?.evaluateJavascript(
                    """
                    if (typeof window.onNativeBridgeReady === 'function') window.onNativeBridgeReady(true);
                    if (typeof window.autoLoadDe440 === 'function') window.autoLoadDe440();
                    """.trimIndent(),
                    null
                )
            }
        }
        webView.webChromeClient = WebChromeClient()

        // Load the bundled KP page
        webView.loadUrl("file:///android_asset/web/index.html")
    }

    @Deprecated("Deprecated in Java")
    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
