"use client";

// import processPDFs from "@/utils/pdfToImg";
import { cn } from "@/lib/utils";
import { memo } from "react";
import {
  ScrollMode,
  SpecialZoomLevel,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import "../../app/pdfView.css";

const PdfRenderer = memo(function RenderPdf({
  url,
  pageScroll = false,
}: {
  url: string;
  pageScroll?: boolean;
}) {
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
      <div
        className={cn(
          "w-full bg-transparent",
          pageScroll && "pdf-viewer--page-scroll"
        )}
      >
        <Viewer
          fileUrl={url}
          defaultScale={
            pageScroll ? SpecialZoomLevel.PageWidth : undefined
          }
          enableSmoothScroll={!pageScroll}
          scrollMode={ScrollMode.Vertical}
          setRenderRange={
            pageScroll
              ? ({ numPages }) => ({
                  startPage: 0,
                  endPage: numPages - 1,
                })
              : undefined
          }
        />
      </div>
    </Worker>
  );
});

export default PdfRenderer;
