"use client";

import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [filenames, setFileNames] = useState<string[] | null>(null);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res[0].url);
          setFileName(res[0].url);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      /> */}
      <UploadDropzone
        endpoint={"imageUploader"}
        onClientUploadComplete={(res) => {
          // Do something with the response
          setFileNames(res.map((file) => file.url));
          console.log("Files: ", res);
          toast.success("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error(error.message);
        }}
      />
      {filenames?.map((filename) => (
        <img src={filename} />
      ))}
    </main>
  );
}
