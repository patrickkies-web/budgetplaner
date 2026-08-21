import { FOERDER_STATUS } from "../constants";

export const STATUS_KEYS = FOERDER_STATUS.map((s) => s.key);

export const statusMeta = (key) =>
  FOERDER_STATUS.find((s) => s.key === key) || null;

/**
 * Status einer Ausgabe. Altdaten kennen nur das Flag `ausgezahlt`
 * und werden auf "ausgezahlt" bzw. "bezahlt" abgebildet.
 */
export const statusOf = (e) => {
  if (!e || !e.foerderfaehig) return null;
  if (e.foerderStatus && STATUS_KEYS.includes(e.foerderStatus)) return e.foerderStatus;
  return e.ausgezahlt ? "ausgezahlt" : "bezahlt";
};

export const refundOf = (e) =>
  e && e.foerderfaehig ? (e.amount || 0) * ((e.foerderPercent || 0) / 100) : 0;

/** Ab "zusage" ist ein Auszahlkonto relevant. */
export const needsAccount = (key) => key === "zusage" || key === "ausgezahlt";

/** Änderungs-Patch für einen Statuswechsel (hält Altfeld `ausgezahlt` synchron). */
export const statusPatch = (expense, key) => ({
  foerderStatus: key,
  ausgezahlt: key === "ausgezahlt",
  auszahlKonto: needsAccount(key)
    ? expense.auszahlKonto || expense.creditId
    : null,
});
