plugins {
    id("com.android.application") version "8.7.2"
    id("org.jetbrains.kotlin.android") version "2.0.21"
}

// ───────────────────────── Signing config (private data) ─────────────────────────
//
// 从 keystore.properties 读取签名配置。文件路径优先级：
//   1. 环境变量 KEYSTORE_PROPS_PATH（CI 用，指向 Secrets 解码的临时文件）
//   2. 项目根目录的 keystore.properties（本地开发用，已 gitignore）
//
// keystore.properties 内容（不入库）：
//   storeFile=/absolute/path/to/release.keystore
//   storePassword=...
//   keyAlias=...
//   keyPassword=...
//
// 如果都找不到，release 构建会生成 unsigned APK。

data class SigningConfig(val storeFile: File, val storePassword: String, val keyAlias: String, val keyPassword: String)

fun tryReadSigningConfig(): SigningConfig? {
    val propsPath = System.getenv("KEYSTORE_PROPS_PATH")
        ?: rootProject.file("keystore.properties").absolutePath
    val propsFile = File(propsPath)
    if (!propsFile.exists()) {
        logger.lifecycle("signing: keystore.properties not found at $propsPath (will produce unsigned release APK)")
        return null
    }
    val props = java.util.Properties().apply { propsFile.inputStream().use { load(it) } }
    val storeFile = File(props.getProperty("storeFile"))
    if (!storeFile.exists()) {
        logger.lifecycle("signing: keystore file not found at ${storeFile.absolutePath}")
        return null
    }
    logger.lifecycle("signing: loaded keystore from ${storeFile.absolutePath}")
    return SigningConfig(
        storeFile = storeFile,
        storePassword = props.getProperty("storePassword"),
        keyAlias = props.getProperty("keyAlias"),
        keyPassword = props.getProperty("keyPassword")
    )
}

android {
    namespace = "io.zhipu.kpdivination"
    compileSdk = 34

    defaultConfig {
        applicationId = "io.zhipu.kpdivination"
        minSdk = 24          // Android 7.0 — WebView 80+ 支持 WASM
        targetSdk = 34       // Android 14
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildFeatures {
        buildConfig = true   // 生成 BuildConfig，用于调试判断
    }

    buildTypes {
        debug {
            isMinifyEnabled = false
            isDebuggable = true
        }
        release {
            isMinifyEnabled = false
            isShrinkResources = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // 签名配置：从 keystore.properties 读取
            signingConfig = tryReadSigningConfig()?.let { cfg ->
                signingConfigs.maybeCreate("release").apply {
                    storeFile = cfg.storeFile
                    storePassword = cfg.storePassword
                    keyAlias = cfg.keyAlias
                    keyPassword = cfg.keyPassword
                }
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.6")
    implementation("androidx.activity:activity-ktx:1.9.3")
    // 无需 Compose / Room / 网络库 — 全部 UI 在 WebView 内
}

// ───────────────────────── Web App Sync ─────────────────────────
//
// 把 web-app/ 目录的内容同步到 src/main/assets/web/ 下，使 WebView 能通过
// file:///android_asset/web/index.html 访问。

val webAppSourceDir = layout.projectDirectory.dir("../../web-app")
val webAppTargetDir = layout.projectDirectory.dir("src/main/assets/web")

val syncWebApp by tasks.registering(Sync::class) {
    group = "kp-divination"
    description = "Sync web-app/ → src/main/assets/web/"

    from(webAppSourceDir) {
        exclude("**/.DS_Store")
        exclude("**/node_modules/**")
        exclude("**/.git/**")
        exclude("**/README.md")
    }
    into(webAppTargetDir)
}

tasks.matching { it.name == "preBuild" }.configureEach {
    dependsOn("syncWebApp")
}

tasks.matching { it.name == "clean" }.configureEach {
    doLast {
        webAppTargetDir.asFile.listFiles()?.forEach { f ->
            if (f.name != ".gitkeep") f.deleteRecursively()
        }
    }
}
