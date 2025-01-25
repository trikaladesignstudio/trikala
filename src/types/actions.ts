export type locationType = {
  title: string;
  id: number;
};

export type BuildingClassType = "regular" | "luxury" | "dwelling";

export type EstimaterDataType = {
  regular: {
    interior: number;
    construction: number;
    days: number;
  };
  luxury: {
    interior: number;
    construction: number;
    days: number;
  };
  dwelling: {
    interior: number;
    construction: number;
    days: number;
  };
};
