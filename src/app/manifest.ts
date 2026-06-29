import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trikal Architects",
    short_name: "Trikala",
    description:
      "Architects and interior designers creating eco-friendly, functional spaces across Delhi NCR.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f5",
    theme_color: "#1A1A1A",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
