"use server";
import { EstimaterDataType, locationType } from "@/types/actions";
import dataDoc from "./googleAuth";

const blockedSheetsInDoc = ["Sheet"];

const regex = /\d+/g;

// to do
// update the data fields according to the sheet cols and interior and exterior data fields positions in the sheet also days if any
// data conversion on st to ms and ms to st fix not using static data
// MOBILE VERSION
//  convert it into row /col 

export async function getStates(): Promise<locationType[]> {
  "cache";
  await dataDoc.loadInfo(); // loads document properties and worksheets

  const states = dataDoc.sheetsByIndex
    .map((sheet, index) => {
      //   console.log(`Sheet Title: ${sheet.title}, Sheet ID: ${sheet.id}`);
      if (!blockedSheetsInDoc.includes(sheet.title)) {
        return {
          title: sheet.title,
          id: index,
        };
      }
    })
    .filter((item) => item) as locationType[];

  return states;
}

export async function get_cities(state_id: number) {
  "cache";
  await dataDoc.loadInfo(); // loads document properties and worksheets

  const sheet = dataDoc.sheetsByIndex[state_id];
  // format the data
  const rows = await sheet.getRows(); // Fetch all rows from the sheet

  const cities = rows.map((row, index) => ({
    title: row.get(sheet.headerValues[0]), // Assuming "City" is a column name
    id: index,
  }));

  return cities;
}

export async function get_data_by_location(state_id: number, city_id: number) {
  "cache";
  await dataDoc.loadInfo(); // loads document properties and worksheets
  const sheet = dataDoc.sheetsByIndex[state_id];

  const rows = await sheet.getRows(); // Fetch all rows from the sheet
  const interior = rows[city_id].get(sheet.headerValues[2]).replace(",", "");
  // const exterior = rows[city_id].get(sheet.headerValues[3]).replace(",", "");

  // ₹850 - ₹1,050
  // format it low and high use regex
  const [ilow, ihigh] = interior.match(regex)!.map(Number);
  const iavg = (ilow + ihigh) / 2;

  // console.log("row:", interior, ilow, iavg, ihigh);

  // format the data
  return {
    regular: {
      interior: ilow,
      construction: 1000,
      days: 0.15,
    },
    luxury: {
      interior: iavg,
      construction: 1000,
      days: 0.15,
    },
    dwelling: {
      interior: ihigh,
      construction: 1000,
      days: 0.15,
    },
  } as unknown as EstimaterDataType;
}
