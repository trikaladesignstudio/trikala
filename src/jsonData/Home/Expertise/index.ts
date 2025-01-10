import data from "./db.json" assert { type: "json" };

export interface expertiseDataType {
  id: number;
  title: string;
  description: string;
  images: imagesWithProjectId[];
}

export type imagesWithProjectId = {
  url: string;
  projectId: string | null;
};
// export const expertiseData: expertiseDataType[] = data;
