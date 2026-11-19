declare module "pdf-parse/lib/pdf-parse.js" {
  import type { PDFData, Options } from "pdf-parse";

  function pdfParse(dataBuffer: Buffer, options?: Options): Promise<PDFData>;

  export default pdfParse;
}
