import { DEFAULT_STATE, STORAGE_KEY } from "../constants";

export async function loadState() {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const r = await window.storage.get(STORAGE_KEY);
      if (r && r.value) return { ...DEFAULT_STATE, ...JSON.parse(r.value) };
    }
  } catch (e) {}
  return DEFAULT_STATE;
}

export async function saveState(state) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      await window.storage.set(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {}
}
