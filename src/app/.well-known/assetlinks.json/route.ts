import { NextResponse } from "next/server";

export function GET() {
  const fps = (process.env.ANDROID_SHA256_FINGERPRINT ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.bfixsoftware.aistore",
          sha256_cert_fingerprints: fps,
        },
      },
    ],
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
