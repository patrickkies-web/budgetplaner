export const STORAGE_KEY = "bau-tracker-v1";

export const CATEGORIES = [
  "Energetisch",
  "Nebenkosten",
  "Kosmetisch",
  "Boden",
  "Wände",
  "Heizung",
  "Sanitär",
  "Elektrik",
  "Werkzeug",
  "W. Verschleissteile",
];

export const DEFAULT_STATE = {
  projectName: "Mein Bau",
  credits: [
    { id: "k1", name: "Kredit 1", total: 0 },
    { id: "k2", name: "Kredit 2", total: 0 },
  ],
  categories: [...CATEGORIES],
  expenses: [],
};
