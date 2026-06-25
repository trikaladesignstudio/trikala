import { GoogleAuth } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

const serviceAccountAuth = new GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: "learned-acronym-448817-f9",
    private_key_id: "653869b46a0b3afeff726cea39162622dcbb7412",
    private_key: process.env.private_google_key,
    client_email:
      "sheet-reader@learned-acronym-448817-f9.iam.gserviceaccount.com",
    client_id: "104664558320891307577",
    universe_domain: "googleapis.com",
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const dataDoc = new GoogleSpreadsheet(
  process.env.SHEET_ID!,
  serviceAccountAuth
);

export default dataDoc;
