import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oto App",
    short_name: "Oto",
    description: "An application for recording and analyzing audio",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/logo.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/icons/logo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    orientation: "portrait",
    prefer_related_applications: false,
  };
}
