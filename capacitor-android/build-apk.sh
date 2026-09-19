#!/bin/bash
set -e
echo "═══════════════════════════════════"
echo " B-Fix Software — APK Builder"
echo "═══════════════════════════════════"

echo ""
echo "[1/6] Installing dependencies..."
npm install

echo ""
echo "[2/6] Initializing Capacitor..."
npx cap init "B-Fix Software | AI Store" com.bfixsoftware.aistore --web-dir www 2>/dev/null || echo "(already initialized)"

echo ""
echo "[3/6] Adding Android platform..."
npx cap add android 2>/dev/null || echo "(already added)"

echo ""
echo "[4/6] Copying icons..."
ICON="../public/icons/icon-512.png"
if [ -f "$ICON" ]; then
  for dir in android/app/src/main/res/mipmap-*/; do
    cp "$ICON" "${dir}ic_launcher.png" 2>/dev/null || true
    cp "$ICON" "${dir}ic_launcher_round.png" 2>/dev/null || true
  done
  echo "Icons copied!"
fi

echo ""
echo "[5/6] Syncing..."
npx cap sync android

echo ""
echo "[6/6] Building APK..."
cd android
chmod +x gradlew 2>/dev/null || true
./gradlew assembleDebug

APK="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK" ]; then
  cp "$APK" ../bfix-store-v1.0.0.apk
  echo ""
  echo "═══════════════════════════════════"
  echo " ✅ APK BUILT SUCCESSFULLY!"
  echo " File: capacitor-android/bfix-store-v1.0.0.apk"
  echo "═══════════════════════════════════"
fi
