import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A.A AJIBEST LAND VENDORS LTD",
    short_name: "A.A.AJIBEST",
    description: "Property, Estate Developer, Contractor and General Merchant",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
