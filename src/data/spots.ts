import type { ExpenseItem, MountainSpot, TripMeta } from "../types";

export const DEFAULT_TRIP_META: TripMeta = {
  title: "Indian Mountain Escape",
  window: "Flexible dates",
};

export const INITIAL_SPOTS: MountainSpot[] = [
  {
    id: "dalhousie-khajjiar",
    name: "Khajjiar & Dainkund Walk",
    region: "Dalhousie",
    state: "Himachal Pradesh",
    kind: "destination",
    bestSeason: "Mar–Jun, Oct–Nov",
    note: "Pine-lined meadow clearing and gentle forest ridge trails above Dalhousie.",
    mapQuery: "Khajjiar Himachal Pradesh",
  },
  {
    id: "kalatop-underrated",
    name: "Kalatop Lower Forest Trail",
    region: "Dalhousie",
    state: "Himachal Pradesh",
    kind: "underrated",
    bestSeason: "Oct–Dec, Mar–Jun",
    note: "Quieter cedar stretches away from main viewpoints—head out early for crisp mountain air.",
    mapQuery: "Kalatop Wildlife Sanctuary Dalhousie",
  },
  {
    id: "old-dalhousie-cafe",
    name: "Garam Dharam & Mall Road Eats",
    region: "Dalhousie",
    state: "Himachal Pradesh",
    kind: "food",
    bestSeason: "Year-round",
    note: "Warm parathas, rajma chawal, and hot tea stops during chilly evenings.",
    mapQuery: "Gandhi Chowk Dalhousie food",
  },
  {
    id: "jibhi-tirthan",
    name: "Tirthan River & Jalori Pass",
    region: "Tirthan Valley",
    state: "Himachal Pradesh",
    kind: "destination",
    bestSeason: "Mar–Jun, Sep–Nov",
    note: "Clear trout streams, wooden homestays, and high-pass views toward Serolsar Lake.",
    mapQuery: "Tirthan Valley Himachal Pradesh",
  },
  {
    id: "shangarh-meadow",
    name: "Shangarh Meadows",
    region: "Tirthan Valley",
    state: "Himachal Pradesh",
    kind: "underrated",
    bestSeason: "Apr–Jun, Sep–Nov",
    note: "Wide pastoral lawns and traditional architecture with a slower pace than Sainj or Jibhi.",
    mapQuery: "Shangarh Himachal Pradesh",
  },
  {
    id: "munsiyari-khaliya",
    name: "Khaliya Top Ridge",
    region: "Munsiyari",
    state: "Uttarakhand",
    kind: "underrated",
    bestSeason: "May–Jun, Oct–Nov",
    note: "Sweeping views of the Panchachuli peaks with fewer crowds than major Kumaon hubs.",
    mapQuery: "Munsiyari Uttarakhand",
  },
  {
    id: "pangong-tso-area",
    name: "Spangmik & High Lakes Belt",
    region: "Ladakh",
    state: "Ladakh",
    kind: "destination",
    bestSeason: "Jun–Sep",
    note: "High-altitude arid ridges and shifting turquoise waters—plan acclimatization carefully.",
    mapQuery: "Spangmik Ladakh",
  },
  {
    id: "dzukou-valley-entry",
    name: "Dzukou Valley Foothills",
    region: "Kohima Belt",
    state: "Nagaland & Manipur",
    kind: "destination",
    bestSeason: "Jun–Sep, Oct–Nov",
    note: "Rolling hills and mist-covered valleys reached via a steep mountain climb.",
    mapQuery: "Dzukou Valley Nagaland",
  },
  {
    id: "local-thukpa-spot",
    name: "Hillside Thukpa & Momos",
    region: "Munsiyari",
    state: "Uttarakhand",
    kind: "food",
    bestSeason: "Year-round",
    note: "Steaming bowls of thukpa and local buckwheat dishes after a long day outdoors.",
    mapQuery: "Munsiyari local food",
  },
];

export const INITIAL_TRAVELLERS: string[] = ["Aarav", "Meera", "Kabir"];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: "exp-1",
    description: "Shared mountain cab & fuel",
    amountInr: 4500,
    paidBy: "Aarav",
    date: new Date().toISOString().slice(0, 10),
  },
];
