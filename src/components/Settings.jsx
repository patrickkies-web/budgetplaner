import React, { useState } from "react";
import { parseNum } from "../utils/format";

export default function Settings({ state, categories, onProject, onCredit, onAddCategory, onRemoveCategory }) {
  const [catInput, setCatInput] = useState("");

  const addCat = () => {
    onAddCategory(catInput);
    setCatInput("");
  };

  return (
    <section className="bt-settings">
      <div className="bt-field">
        <label className="bt-flabel">Projektname</label>
        <input
          className="bt-input"
          value={state.projectName}
          onChange={(e) => onProject({ projectName: e.target.value })}
          placeholder="z. B. Einfamilienhaus"
        />
      </div>

      <div className="bt-credit-edit">
        {state.credits.map((c) => (
          <div className="bt-field" key={c.id}>
            <label className="bt-flabel">Kredit</label>
            <input
              className="bt-input"
              value={c.name}
              onChange={(e) => onCredit(c.id, { name: e.target.value })}
              placeholder="Name des Kredits"
            />
            <label className="bt-flabel" style={{ marginTop: 10 }}>
              Kreditsumme (€)
            </label>
            <input
              className="bt-input"
              inputMode="decimal"
              defaultValue={c.total ? String(c.total).replace(".", ",") : ""}
              onBlur={(e) => onCredit(c.id, { total: parseNum(e.target.value) })}
              placeholder="0,00"
            />
          </div>
        ))}
      </div>

      <div className="bt-field" style={{ marginTop: 4 }}>
        <label className="bt-flabel">Kategorien</label>
        <div className="bt-cat-list">
          {categories.map((c) => (
            <span className="bt-cat-tag" key={c}>
              {c}
              <button
                className="bt-cat-x"
                onClick={() => onRemoveCategory(c)}
                aria-label={`${c} entfernen`}
              >
                ×
              </button>
            </span>
          ))}
          {categories.length === 0 && (
            <span className="bt-cat-empty">Keine Kategorien</span>
          )}
        </div>
        <div className="bt-add-cat">
          <input
            className="bt-input"
            value={catInput}
            onChange={(e) => setCatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCat()}
            placeholder="Neue Kategorie"
          />
          <button className="bt-mini-add" onClick={addCat} disabled={!catInput.trim()}>
            Hinzufügen
          </button>
        </div>
      </div>
    </section>
  );
}
