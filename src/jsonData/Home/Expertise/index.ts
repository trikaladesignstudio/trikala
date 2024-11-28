import data from "./db.json" assert { type: "json" };

export interface expertiseDataType {
  id: number;
  title: string;
  description: string;
  images: string[];
}

export const expertiseData: expertiseDataType[] = data;
