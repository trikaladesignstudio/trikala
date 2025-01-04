"use client";

// import processPDFs from "@/utils/pdfToImg";
import { memo, useEffect, useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "../../app/pdfView.css";

const PdfRenderer = memo(function RenderPdf({ url }: { url: string }) {
  // <embed
  //   data-embed="true"
  //   src={
  //     url +
  //     "?embedded=true#view=Fit&scrollbar=0&toolbar=0&statusbar=0&messages=0&navpanes=0"
  //   }
  //   style={{
  //     backgroundColor: "transparent",
  //     width: "100%",
  //     minHeight: "100%",
  //     maxHeight: "full",
  //     border: "none",
  //     background: "transparent",
  //   }}
  //   className="w-full bg-white"
  // ></embed>
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div className="w-full bg-transparent">
        <Viewer fileUrl={url} />
      </div>
    </Worker>
  );
});

export default PdfRenderer;
