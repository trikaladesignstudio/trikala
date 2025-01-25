import { GoogleAuth } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import fs from "fs";
// if json file not already exist create one

const keyFileName = "private_key.json";

if (!fs.existsSync(keyFileName)) {
  fs.writeFileSync(
    keyFileName,
    Buffer.from(process.env.Google_keyFile!, "base64").toString("utf-8")
  );
}

const serviceAccountAuth = new GoogleAuth({
  keyFile: keyFileName,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const dataDoc = new GoogleSpreadsheet(
  process.env.SHEET_ID!,
  serviceAccountAuth
);

export default dataDoc;
