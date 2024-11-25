import data from "./db.json" assert { type: "json" };

interface WorkingsDataType {
  id: number;
  title: string;
  description: string;
  image: string;
}

export const WorkingsData: WorkingsDataType[] = data;
