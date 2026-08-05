# Keep the JS bridge — accessed by reflection from WebView
-keep class com.xalen.kpastro.De440Bridge { *; }
-keep class com.xalen.kpastro.AnalyticalEphemeris { *; }
-keepclassmembers class com.xalen.kpastro.** {
    @android.webkit.JavascriptInterface <methods>;
}
