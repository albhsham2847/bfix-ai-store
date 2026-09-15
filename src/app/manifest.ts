import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "B-Fix Software | AI Store",
    short_name: "B-Fix Store",
    description:
      "متجر B-Fix Software: أدوات البرمجة، اشتراكات الذكاء الاصطناعي، شحن الألعاب، البطائق الإلكترونية وخدمات التسويق والبرمجة",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    dir: "rtl",
    lang: "ar",
    background_color: "#070A12",
    theme_color: "#070A12",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
