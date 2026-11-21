export type SpotKind = "destination" | "underrated" | "food";

export interface MountainSpot {
  id: string;
  name: string;
  region: string;
  state: string;
  kind: SpotKind;
  bestSeason: string;
  note: string;
  mapQuery: string;
  custom?: boolean;
}

export interface ExpenseItem {
  id: string;
  description: string;
  amountInr: number;
  paidBy: string;
  date: string;
}

export interface TripMeta {
  title: string;
  window: string;
}
