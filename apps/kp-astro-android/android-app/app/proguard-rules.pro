# Keep @JavascriptInterface annotated methods — they are called from JS by name
-keepclassmembers class io.zhipu.kpdivination.WebAppInterface {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class io.zhipu.kpdivination.WebAppInterface { *; }

# Keep WebViewClient / WebChromeClient subclasses (instantiated by reflection)
-keepclassmembers class * extends android.webkit.WebViewClient {
    public *;
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public *;
}
