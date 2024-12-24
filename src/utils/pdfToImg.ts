// "use server";

// export default async function processPDFs(url: string) {
//   console.log("url:", url);
//   const pdf2img = await import("pdf-img-convert");

//   // Both HTTP, HTTPS, and local paths are supported
//   const outputWithExternalLink = await pdf2img.convert(
//     "https://sedl.org/afterschool/toolkits/science/pdf/ast_sci_data_tables_sample.pdf"
//   );
//   const outputWithLocalSample = await pdf2img.convert("./test_pdfs/sample.pdf");

//   // OUTPUT OPTIONS ARRAY
//   const outputs = [outputWithExternalLink, outputWithLocalSample];

//   const pdfArray = outputs[0]; // Change the index to select different outputs

//   //   function saveImages(pdfArray) {
//   //     pdfArray.forEach((image, index) => {
//   //       const outputPath = path.join("./outputImages", `saveImages_${index}.png`);
//   //       fs.writeFile(outputPath, image, (error) => {
//   //         if (error) {
//   //           console.error(`Error saving image ${index + 1}:`, error);
//   //         } else {
//   //           console.log(`Image ${index + 1} saved successfully`);
//   //         }
//   //       });
//   //     });
//   //   }
//   //   // Call the function to save images
//   //   saveImages(pdfArray);

//   return pdfArray;
// }
// // Call the async function
// // processPDFs();
