plugins {
    kotlin("js") version "2.0.21"
}

repositories {
    mavenCentral()
}

kotlin {
    js {
        browser {
            distribution {
                outputDirectory.set(file("$projectDir/build/distrib"))
            }
            testTask {
                useKarma {
                    useChromeHeadless()
                    useFirefox()
                }
            }
        }
        nodejs {
            testTask {
                // 用 Node.js 跑测试，避免依赖浏览器
            }
        }
        binaries.executable()
    }
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-html-js:0.11.0")
    testImplementation(kotlin("test"))
}

// Output all distributable files to a single predictable directory
// 包括 index.html + 所有依赖 JS（kotlin-stdlib, kotlinx-html, kp-astro.js）
tasks.register<Copy>("assembleDistrib") {
    // 先复制 index.html（用 projectDir 显式定位）
    from("${projectDir}/src/main/resources/index.html")
    // 再复制所有编译产物 JS
    from("${layout.buildDirectory.get()}/compileSync/js/main/developmentExecutable/kotlin") {
        include("*.js")
    }
    into("${projectDir}/build/distrib")
    dependsOn("developmentExecutableCompileSync")
}

tasks.named("build") {
    dependsOn("assembleDistrib")
}
