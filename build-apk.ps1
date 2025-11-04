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

Write-Host "=== Done! APK should be here: android\app\build\outputs\apk\release\app-release.apk ==="



# powershell -ExecutionPolicy Bypass -File build-apk.ps1