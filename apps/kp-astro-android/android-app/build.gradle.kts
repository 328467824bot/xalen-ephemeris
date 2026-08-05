// Top-level build file.
// 用硬编码 plugin 版本，避免 version catalog 在 CI 环境下的解析问题。
plugins {
    id("com.android.application") version "8.7.2" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
}
