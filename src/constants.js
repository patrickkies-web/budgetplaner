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

// Stationen einer Förderung – in dieser Reihenfolge durchläuft ein Eintrag sie.
export const FOERDER_STATUS = [
  {
    key: "bezahlt",
    label: "Bezahlt",
    hint: "Rechnung ist bezahlt, Förderung noch nicht eingereicht",
    effect:
      "Das Geld ist raus. Die Förderung ist nur kalkuliert und zählt noch nicht zu deinen Mitteln.",
    tone: "mut",
  },
  {
    key: "angegeben",
    label: "Angegeben",
    hint: "Bei der Förderstelle eingereicht, Entscheidung steht aus",
    effect:
      "Beantragt, aber noch nicht bewilligt – zählt weiterhin nicht zu deinen verfügbaren Mitteln.",
    tone: "open",
  },
  {
    key: "zusage",
    label: "Förderzusage",
    hint: "Die Förderstelle hat die Auszahlung zugesagt",
    effect:
      "Fest zugesagt: erhöht deine planbaren Mittel, liegt aber noch nicht auf dem Konto.",
    tone: "acc",
  },
  {
    key: "ausgezahlt",
    label: "Ausgezahlt",
    hint: "Das Geld ist auf dem Konto eingegangen",
    effect:
      "Erhöht dein verfügbares Budget auf dem gewählten Konto – ab jetzt echtes Geld.",
    tone: "good",
  },
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
