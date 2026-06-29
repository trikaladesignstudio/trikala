import { GoogleAuth } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

import {
  getGoogleServiceAccountCredentials,
  getGoogleSheetId,
} from "./googleSheetsConfig";

const serviceAccountAuth = new GoogleAuth({
  credentials: getGoogleServiceAccountCredentials(),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const dataDoc = new GoogleSpreadsheet(getGoogleSheetId(), serviceAccountAuth);

export default dataDoc;
