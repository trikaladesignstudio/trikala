export type NearbyCity = {
  slug: string;
  city: string;
};

export type LocationPageData = {
  slug: string;
  city: string;
  state: string;
  stateId: number;
  cityId: number;
  priceLow: number;
  priceHigh: number;
  heroImage: string;
  inlineImage: string;
  nearbyCities: NearbyCity[];
};

export type LocationProject = {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
};

export type LocationStateGroup = {
  state: string;
  locations: LocationPageData[];
};
