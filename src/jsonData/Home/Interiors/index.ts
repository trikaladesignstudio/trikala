import data from "./db.json" assert { type: "json" };

export interface interiorDataType {
  id: number;
  title: string;
  description: string;
  image: string;
}

export const interiorData: interiorDataType[] = data;
