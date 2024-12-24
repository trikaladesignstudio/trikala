"use client";

// import processPDFs from "@/utils/pdfToImg";
import { memo, useEffect } from "react";

// Create Document Component
export default memo(function RenderPdf({ url }: { url: string }) {
  useEffect(() => {
    console.log("url: ", url);
    fetch("/api/pdf2Img", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res)
      .then(console.log);
    // processPDFs(url).then((data) => {
    //   console.log("data: ", data);
    // });
  }, [url]);
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
        maxHeight: "full",
        border: "none",
        background: "transparent",
      }}
      className="w-full bg-white"
    ></embed>
  );
});
