"use client";
// Install button moved to BottomNav — this file registers the SW only
import { useEffect } from "react";
export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
