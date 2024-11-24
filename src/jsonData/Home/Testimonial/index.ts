import data from "./db.json" assert { type: "json" };

interface TestimonialsDataType {
  id: number;
  title: string;
  company: string;
  description: string;
  images: string;
}

export const TestimonialsData: TestimonialsDataType[] = data;
