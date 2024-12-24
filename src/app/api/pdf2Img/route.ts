import { NextRequest, NextResponse } from "next/server";
// import { pdf } from "pdf-to-img";

// Export routes for Next App Router
export const POST = async (req: NextRequest) => {
  // const pdf2img = await import("pdf-img-convert");
  // get file url as url
  // get file url as url
  const { url } = await req.json();

  console.log("url:", url);
  // const document = await pdf(url, { scale: 3 });

  let pages: string[] = [];
  // for await (const image of document) {
  //   pages.push("data:image/png;base64," + image);
  // }

  return NextResponse.json(pages, { status: 200 });

  // if (url) {
  //   const pdfBuffer = Buffer.from(
  //     await fetch(url).then((res) => res.arrayBuffer())
  //   );
  //   const imagePages = await pdf2img.convert(pdfBuffer, { base64: true }); // Ensure base64 is true to get Base64 data
  //   return NextResponse.json(imagePages, { status: 200 });
  // } else {
  // return NextResponse.json([], { status: 400 });
  // }
  return NextResponse.json(url, { status: 400 });
};
