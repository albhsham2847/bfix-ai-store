#!/bin/bash
set -e

echo "=============================="
echo " B-Fix Store — Android Builder"
echo "=============================="

# 1. Install dependencies
echo ""
echo "[1/5] Installing Capacitor..."
npm install

# 2. Add Android platform
echo ""
echo "[2/5] Adding Android platform..."
npx cap add android 2>/dev/null || echo "(already added)"

# 3. Sync
echo ""
echo "[3/5] Syncing web assets..."
npx cap sync android

# 4. Copy icon
echo ""
echo "[4/5] Copying app icon..."
ICON_SRC="../public/icons/icon-512.png"
if [ -f "$ICON_SRC" ]; then
  for dir in android/app/src/main/res/mipmap-*; do
    if [ -d "$dir" ]; then
      cp "$ICON_SRC" "$dir/ic_launcher.png" 2>/dev/null || true
      cp "$ICON_SRC" "$dir/ic_launcher_round.png" 2>/dev/null || true
      cp "$ICON_SRC" "$dir/ic_launcher_foreground.png" 2>/dev/null || true
    fi
  done
  echo "Icons copied!"
fi

# 5. Build
echo ""
echo "[5/5] Building APK..."
cd android
if [ -f "gradlew" ]; then
  chmod +x gradlew
  ./gradlew assembleDebug
  APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
  if [ -f "$APK_PATH" ]; then
    cp "$APK_PATH" ../bfix-store-debug.apk
    echo ""
    echo "=============================="
    echo " ✅ APK built successfully!"
    echo " Location: capacitor-android/bfix-store-debug.apk"
    echo "=============================="
  fi
  echo ""
  echo "For release APK (signed):"
  echo "  ./gradlew assembleRelease"
  echo ""
  echo "For AAB (Google Play):"
  echo "  ./gradlew bundleRelease"
else
  echo "Error: gradlew not found"
fi
