import { GoogleAuth } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
// if json file not already exist create one

const keyFileName = "./key.json";

const serviceAccountAuth = new GoogleAuth({
  keyFile: keyFileName,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const dataDoc = new GoogleSpreadsheet(
  process.env.SHEET_ID!,
  serviceAccountAuth
);

export default dataDoc;
