import { uid } from "./format";

const ATTACH_PREFIX = "bt-attach:";
const MAX_DATAURL = 4500000; // ~3.3 MB, sicher unter dem 5-MB-Limit
const attachMem = new Map();

export async function attachSet(id, dataURL) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      await window.storage.set(ATTACH_PREFIX + id, dataURL);
      return;
    }
  } catch (e) {}
  attachMem.set(id, dataURL);
}

export async function attachGet(id) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const r = await window.storage.get(ATTACH_PREFIX + id);
      if (r && r.value) return r.value;
    }
  } catch (e) {}
  return attachMem.get(id) || null;
}

export async function attachDel(id) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      await window.storage.delete(ATTACH_PREFIX + id);
    }
  } catch (e) {}
  attachMem.delete(id);
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function compressImage(file, maxDim = 1600, quality = 0.72) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const cv = document.createElement("canvas");
      cv.width = width;
      cv.height = height;
      cv.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(cv.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export async function processFile(file) {
  let dataURL;
  let type = file.type || "application/octet-stream";
  if (type.startsWith("image/")) {
    dataURL = await compressImage(file);
    type = "image/jpeg";
  }
  if (!dataURL) dataURL = await fileToDataURL(file);
  if (!dataURL || dataURL.length > MAX_DATAURL) return null;
  return { id: uid(), name: file.name, type, dataURL };
}

export function dataURLtoBlob(dataURL) {
  const [meta, b64] = dataURL.split(",");
  const mime = (meta.match(/:(.*?);/) || [])[1] || "application/octet-stream";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export async function openAttachment(att) {
  const dataURL = await attachGet(att.id);
  if (!dataURL) {
    window.alert("Datei nicht gefunden (evtl. nach Neustart nicht gespeichert).");
    return;
  }
  try {
    const url = URL.createObjectURL(dataURLtoBlob(dataURL));
    const w = window.open(url, "_blank");
    if (!w) {
      const a = document.createElement("a");
      a.href = url;
      a.download = att.name || "beleg";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (e) {
    window.alert("Datei konnte nicht geöffnet werden.");
  }
}
