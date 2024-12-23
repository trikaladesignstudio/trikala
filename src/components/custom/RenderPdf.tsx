"use client";

import { memo } from "react";

// Create Document Component
export default memo(function RenderPdf({ url }: { url: string }) {
  return (
    <embed
      data-embed="true"
      src={
        url +
        "?embedded=true#view=Fit&scrollbar=0&toolbar=0&statusbar=0&messages=0&navpanes=0"
      }
      style={{
        backgroundColor: "transparent",
        width: "100%",
        minHeight: "100%",
        maxHeight: "fit",
        border: "none",
        background: "transparent",
      }}
      className="w-full bg-white"
    ></embed>
  );
});
