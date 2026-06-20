import React, { useState, useEffect, useRef } from "react";
import { parseNum, clamp, eur, todayISO } from "../utils/format";
import { processFile, attachSet, attachDel } from "../utils/attachments";

export default function ExpenseForm({ credits, categories, onAdd, onUpdate, onCancelEdit, initial, onAddCategory }) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(todayISO());
  const [creditId, setCreditId] = useState(credits[0]?.id || "k1");
  const [foerder, setFoerder] = useState(false);
  const [pct, setPct] = useState("");
  const [paid, setPaid] = useState(false);
  const [payTo, setPayTo] = useState(null);
  const [category, setCategory] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const sectionRef = useRef(null);

  const resetForm = () => {
    setAmount("");
    setDesc("");
    setDate(todayISO());
    setCreditId(credits[0]?.id || "k1");
    setFoerder(false);
    setPct("");
    setPaid(false);
    setPayTo(null);
    setCategory("");
    setFiles([]);
  };

  useEffect(() => {
    if (!initial) return;
    setAmount(String(initial.amount || ""));
    setDesc(initial.desc || "");
    setDate(initial.date || todayISO());
    setCreditId(initial.creditId || credits[0]?.id || "k1");
    setFoerder(!!initial.foerderfaehig);
    setPct(initial.foerderPercent ? String(initial.foerderPercent) : "");
    setPaid(!!initial.ausgezahlt);
    setPayTo(initial.auszahlKonto || null);
    setCategory(initial.category || "");
    setFiles((initial.attachments || []).map((a) => ({ ...a, isExisting: true })));
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [initial]);

  const confirmAddCat = () => {
    const n = newCat.trim();
    if (!n) return;
    onAddCategory(n);
    setCategory(n);
    setNewCat("");
    setAddingCat(false);
  };

  const valid = parseNum(amount) > 0;

  const handleFiles = async (list) => {
    setUploading(true);
    const added = [];
    for (const f of Array.from(list)) {
      const att = await processFile(f);
      if (att) added.push(att);
      else window.alert(`"${f.name}" ist zu groß oder wird nicht unterstützt.`);
    }
    setFiles((prev) => [...prev, ...added]);
    setUploading(false);
  };

  const removeFile = (id) => {
    const f = files.find((f) => f.id === id);
    if (f?.isExisting) attachDel(f.id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const submit = async () => {
    if (!valid) return;
    for (const f of files) {
      if (!f.isExisting && f.dataURL) await attachSet(f.id, f.dataURL);
    }
    const exp = {
      amount: parseNum(amount),
      desc: desc.trim(),
      date,
      creditId,
      category,
      foerderfaehig: foerder,
      foerderPercent: foerder ? clamp(parseNum(pct), 0, 100) : 0,
      ausgezahlt: foerder ? paid : false,
      auszahlKonto: foerder && paid ? payTo || creditId : null,
      attachments: files.map(({ id, name, type }) => ({ id, name, type })),
    };
    if (initial) {
      onUpdate(exp);
    } else {
      onAdd(exp);
    }
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  const isEditMode = !!initial;

  return (
    <section className={"bt-form" + (isEditMode ? " is-editing" : "")} ref={sectionRef}>
      <h2 className="bt-h2">{isEditMode ? "Ausgabe bearbeiten" : "Neue Ausgabe"}</h2>

      <div className="bt-form-grid">
        <div className="bt-field bt-col-amt">
          <label className="bt-flabel">Betrag (€)</label>
          <input
            className="bt-input bt-input-lg"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div className="bt-field bt-col-date">
          <label className="bt-flabel">Datum</label>
          <input
            className="bt-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="bt-field">
        <label className="bt-flabel">Bezeichnung</label>
        <input
          className="bt-input"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="z. B. Rohbau, Fenster, Dachstuhl …"
        />
      </div>

      <div className="bt-field">
        <div className="bt-flabel-row">
          <label className="bt-flabel" style={{ marginBottom: 0 }}>Kategorie</label>
          <button
            type="button"
            className="bt-mini"
            onClick={() => setAddingCat((a) => !a)}
          >
            {addingCat ? "Abbrechen" : "+ Neu"}
          </button>
        </div>
        {addingCat ? (
          <div className="bt-add-cat">
            <input
              className="bt-input"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmAddCat()}
              placeholder="Neue Kategorie"
              autoFocus
            />
            <button
              type="button"
              className="bt-mini-add"
              onClick={confirmAddCat}
              disabled={!newCat.trim()}
            >
              Hinzufügen
            </button>
          </div>
        ) : (
          <div className="bt-select-wrap">
            <select
              className="bt-input bt-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">— Kategorie wählen —</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="bt-select-arrow">▾</span>
          </div>
        )}
      </div>

      <div className="bt-field">
        <label className="bt-flabel">Bezahlt von</label>
        <div className="bt-seg-ctrl">
          {[...credits, { id: "priv", name: "Privatkonto" }].map((c) => (
            <button
              key={c.id}
              className={"bt-seg-btn" + (creditId === c.id ? " is-active" : "")}
              onClick={() => setCreditId(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bt-field">
        <label className="bt-flabel">Förderfähig?</label>
        <div className="bt-seg-ctrl">
          <button
            className={"bt-seg-btn" + (!foerder ? " is-active" : "")}
            onClick={() => setFoerder(false)}
          >
            Nein
          </button>
          <button
            className={"bt-seg-btn" + (foerder ? " is-active is-acc" : "")}
            onClick={() => setFoerder(true)}
          >
            Ja
          </button>
        </div>
      </div>

      {foerder && (
        <div className="bt-field bt-reveal">
          <label className="bt-flabel">Wie viel % bekommst du zurück?</label>
          <div className="bt-pct-row">
            {[10, 20, 30, 50].map((q) => (
              <button
                key={q}
                className={"bt-quick" + (parseNum(pct) === q ? " is-active" : "")}
                onClick={() => setPct(String(q))}
              >
                {q}%
              </button>
            ))}
            <div className="bt-pct-input">
              <input
                className="bt-input"
                inputMode="decimal"
                value={pct}
                onChange={(e) => setPct(e.target.value)}
                placeholder="z. B. 25"
              />
              <span className="bt-pct-suffix">%</span>
            </div>
          </div>
          {valid && parseNum(pct) > 0 && (
            <div className="bt-hint">
              Rückerstattung ≈{" "}
              <strong>
                {eur(parseNum(amount) * (clamp(parseNum(pct), 0, 100) / 100))}
              </strong>
            </div>
          )}

          <label className="bt-flabel" style={{ marginTop: 14 }}>
            Schon ausgezahlt?
          </label>
          <div className="bt-seg-ctrl">
            <button
              className={"bt-seg-btn" + (!paid ? " is-active" : "")}
              onClick={() => setPaid(false)}
            >
              Noch offen
            </button>
            <button
              className={"bt-seg-btn" + (paid ? " is-active is-good" : "")}
              onClick={() => setPaid(true)}
            >
              Ausgezahlt
            </button>
          </div>

          {paid && (
            <div className="bt-reveal">
              <label className="bt-flabel" style={{ marginTop: 14 }}>
                Auf welches Konto ausgezahlt?
              </label>
              <div className="bt-seg-ctrl">
                {[...credits, { id: "priv", name: "Privatkonto" }].map((c) => (
                  <button
                    key={c.id}
                    className={
                      "bt-seg-btn" + ((payTo || creditId) === c.id ? " is-active" : "")
                    }
                    onClick={() => setPayTo(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bt-field" style={{ marginTop: 4 }}>
        <label className="bt-flabel">Belege / Dateien</label>
        <label className="bt-upload">
          {uploading ? "Wird verarbeitet …" : "+ Dateien anhängen (Foto, PDF)"}
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(ev) => {
              if (ev.target.files && ev.target.files.length) handleFiles(ev.target.files);
              ev.target.value = "";
            }}
          />
        </label>
        {files.length > 0 && (
          <div className="bt-files">
            {files.map((f) => (
              <span className="bt-file" key={f.id}>
                <span className="bt-file-ic">{f.type && f.type.startsWith("image/") ? "🖼" : "📄"}</span>
                <span className="bt-file-name">{f.name}</span>
                <button
                  className="bt-file-x"
                  onClick={() => removeFile(f.id)}
                  aria-label="Datei entfernen"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button className="bt-add" disabled={!valid || uploading} onClick={submit}>
        {isEditMode ? "Änderungen speichern" : "Ausgabe hinzufügen"}
      </button>
      {isEditMode && (
        <button className="bt-cancel" onClick={handleCancel}>
          Abbrechen
        </button>
      )}
    </section>
  );
}
