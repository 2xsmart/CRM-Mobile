Write-Host "=== Cleaning build folders ==="
$paths = @(".\android\build", ".\android\app\build", ".\android\.cxx")
foreach ($p in $paths) {
    if (Test-Path $p) {
        Write-Host "Removing $p"
        Remove-Item -Recurse -Force $p
    } else {
        Write-Host "$p not found, skipping..."
    }
}

Write-Host "=== Running Gradle clean ==="
Set-Location "android"
.\gradlew.bat clean

Write-Host "=== Running project on device/emulator ==="
cd ..
npx react-native run-android

Write-Host "=== Building Release APK ==="
Set-Location "android"
.\gradlew.bat assembleRelease

Write-Host "=== Renaming APK file ==="

# --- Get project/app name from package.json ---
$packagePath = "..\package.json"
if (Test-Path $packagePath) {
    $packageData = Get-Content $packagePath | ConvertFrom-Json
    $appName = $packageData.name
} else {
    $appName = "ReactApp"
}

# --- Define paths ---
$apkPath = ".\app\build\outputs\apk\release\app-release.apk"
$newApkPath = ".\app\build\outputs\apk\release\$appName.apk"

# --- Rename APK if exists ---
if (Test-Path $apkPath) {
    Rename-Item -Path $apkPath -NewName "$appName.apk" -Force
    Write-Host "✅ APK renamed to: $appName.apk"
} else {
    Write-Host "⚠️ APK not found at $apkPath"
}

Write-Host "=== Done! APK should be here: android\app\build\outputs\apk\release\$appName.apk ==="




# ./build-apk.ps1