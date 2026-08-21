import React, { useMemo, useState } from "react";
import { eur, eur0, fmtDate } from "../utils/format";
import { statusOf, refundOf } from "../utils/foerder";
import ExpenseRow from "./ExpenseRow";
import Meter from "./Meter";

const UNASSIGNED = "__none__";

export default function StepsPanel({
  expenses,
  steps,
  categories,
  credits,
  onAddStep,
  onRenameStep,
  onRemoveStep,
  onAssignStep,
  onUpdateExpense,
  onDeleteExpense,
  onAddCategory,
}) {
  const [newStep, setNewStep] = useState("");
  const [open, setOpen] = useState(null);
  const [picking, setPicking] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  const { groups, unassigned, totalSpent } = useMemo(() => {
    const byStep = new Map();
    steps.forEach((s) => byStep.set(s.id, []));
    const none = [];
    expenses.forEach((e) => {
      if (e.stepId && byStep.has(e.stepId)) byStep.get(e.stepId).push(e);
      else none.push(e);
    });
    const sortDesc = (l) =>
      [...l].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return {
      groups: steps.map((s) => ({ step: s, items: sortDesc(byStep.get(s.id) || []) })),
      unassigned: sortDesc(none),
      totalSpent: expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    };
  }, [expenses, steps]);

  const statsOf = (items) => {
    let total = 0, refund = 0, refundPaid = 0, priv = 0, last = "";
    items.forEach((e) => {
      const r = refundOf(e);
      total += e.amount || 0;
      refund += r;
      if (statusOf(e) === "ausgezahlt") refundPaid += r;
      if (e.creditId === "priv") priv += e.amount || 0;
      if ((e.date || "") > last) last = e.date || "";
    });
    return {
      total,
      refund,
      refundPaid,
      priv,
      last,
      count: items.length,
      effective: total - refund,
      share: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
    };
  };

  const addStep = () => {
    const n = newStep.trim();
    if (!n) return;
    onAddStep(n);
    setNewStep("");
  };

  const candidates = (stepId) => {
    const q = search.trim().toLowerCase();
    return expenses
      .filter((e) => e.stepId !== stepId)
      .filter((e) =>
        q
          ? (e.desc || "").toLowerCase().includes(q) ||
            (e.category || "").toLowerCase().includes(q)
          : true
      )
      .sort((a, b) => {
        // unzugeordnete zuerst, dann nach Datum
        const au = a.stepId ? 1 : 0;
        const bu = b.stepId ? 1 : 0;
        if (au !== bu) return au - bu;
        return (b.date || "").localeCompare(a.date || "");
      });
  };

  const stepName = (id) => steps.find((s) => s.id === id)?.name || null;

  const renderBar = (key, name, items, editable) => {
    const st = statsOf(items);
    const isOpen = open === key;
    return (
      <div className={"bt-step" + (isOpen ? " is-open" : "")} key={key}>
        <button
          className="bt-step-bar"
          onClick={() => setOpen(isOpen ? null : key)}
          aria-expanded={isOpen}
        >
          <span className="bt-step-main">
            <span className="bt-step-name">
              {name}
              <span className="bt-count">{st.count}</span>
            </span>
            <span className="bt-step-meter">
              <Meter total={totalSpent} effective={st.total} refund={0} thin />
            </span>
          </span>
          <span className="bt-step-right">
            <span className="bt-step-sum">{eur0(st.total)}</span>
            <span className="bt-step-share">
              {st.share.toFixed(st.share >= 10 ? 0 : 1).replace(".", ",")} %
            </span>
          </span>
          <span className="bt-chevron" aria-hidden="true">▾</span>
        </button>

        {isOpen && (
          <div className="bt-step-body">
            <div className="bt-stats">
              <div className="bt-stat">
                <div className="bt-stat-l">Kosten gesamt</div>
                <div className="bt-stat-v">{eur(st.total)}</div>
                {st.priv > 0 && (
                  <div className="bt-stat-sub">davon {eur0(st.priv)} privat</div>
                )}
              </div>
              <div className="bt-stat">
                <div className="bt-stat-l">Ø pro Ausgabe</div>
                <div className="bt-stat-v">
                  {st.count ? eur(st.total / st.count) : eur(0)}
                </div>
                {st.last && <div className="bt-stat-sub">zuletzt {fmtDate(st.last)}</div>}
              </div>
              <div className="bt-stat">
                <div className="bt-stat-l">Erw. Förderung</div>
                <div className="bt-stat-v is-acc">{eur(st.refund)}</div>
                {st.refund > 0 && (
                  <div className="bt-stat-sub">
                    {st.refundPaid > 0
                      ? `${eur0(st.refundPaid)} ausgezahlt`
                      : "noch nichts ausgezahlt"}
                  </div>
                )}
              </div>
              <div className="bt-stat">
                <div className="bt-stat-l">Effektive Kosten</div>
                <div className="bt-stat-v">{eur(st.effective)}</div>
                <div className="bt-stat-sub">nach Förderung</div>
              </div>
            </div>

            <div className="bt-step-actions">
              <button
                className="bt-mini-add"
                onClick={() => {
                  setPicking(picking === key ? null : key);
                  setSearch("");
                }}
              >
                {picking === key ? "Fertig" : "+ Ausgaben zuordnen"}
              </button>
              {editable && (
                <>
                  <button
                    className="bt-mini"
                    onClick={() => {
                      setRenaming(key);
                      setRenameVal(name);
                    }}
                  >
                    Umbenennen
                  </button>
                  <button
                    className="bt-mini is-warn"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Arbeitsschritt „${name}“ löschen? Die ${st.count} Ausgaben bleiben erhalten und sind danach keinem Schritt zugeordnet.`
                        )
                      ) {
                        onRemoveStep(key);
                        setOpen(null);
                      }
                    }}
                  >
                    Löschen
                  </button>
                </>
              )}
            </div>

            {renaming === key && (
              <div className="bt-add-cat" style={{ marginBottom: 12 }}>
                <input
                  className="bt-input"
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && renameVal.trim()) {
                      onRenameStep(key, renameVal.trim());
                      setRenaming(null);
                    }
                  }}
                  autoFocus
                />
                <button
                  className="bt-mini-add"
                  disabled={!renameVal.trim()}
                  onClick={() => {
                    onRenameStep(key, renameVal.trim());
                    setRenaming(null);
                  }}
                >
                  Speichern
                </button>
              </div>
            )}

            {picking === key && (
              <div className="bt-pick">
                <input
                  className="bt-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ausgabe suchen …"
                />
                <div className="bt-pick-list">
                  {candidates(key).length === 0 ? (
                    <div className="bt-cat-empty" style={{ padding: "10px 2px" }}>
                      Keine passende Ausgabe gefunden.
                    </div>
                  ) : (
                    candidates(key).map((e) => (
                      <div className="bt-pick-row" key={e.id}>
                        <div className="bt-pick-main">
                          <div className="bt-nocat-desc">
                            {e.desc || "Ohne Bezeichnung"}
                          </div>
                          <div className="bt-nocat-sub">
                            {fmtDate(e.date)} · {eur(e.amount)}
                            {e.stepId && stepName(e.stepId)
                              ? ` · aktuell: ${stepName(e.stepId)}`
                              : ""}
                          </div>
                        </div>
                        <button
                          className="bt-pick-add"
                          onClick={() =>
                            onAssignStep(e.id, key === UNASSIGNED ? null : key)
                          }
                          aria-label="In diesen Schritt verschieben"
                        >
                          {key === UNASSIGNED ? "↩" : "+"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="bt-empty" style={{ padding: "18px 4px 20px" }}>
                Noch keine Ausgaben in diesem Schritt.
              </div>
            ) : (
              <ul className="bt-rows">
                {items.map((e) => (
                  <ExpenseRow
                    key={e.id}
                    expense={e}
                    credits={credits}
                    categories={categories}
                    expanded={expandedId === e.id}
                    onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)}
                    onUpdate={(changes) => {
                      onUpdateExpense(e.id, changes);
                      setExpandedId(null);
                    }}
                    onDelete={() => onDeleteExpense(e.id)}
                    onAddCategory={onAddCategory}
                    footer={
                      editable ? (
                        <div className="bt-statusbar">
                          <span className="bt-statusbar-l">
                            {e.category || "ohne Kategorie"}
                          </span>
                          <div className="bt-statusbar-btns">
                            <button
                              className="bt-statusbar-btn"
                              onClick={() => onAssignStep(e.id, null)}
                            >
                              Aus Schritt entfernen
                            </button>
                          </div>
                        </div>
                      ) : null
                    }
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="bt-steps">
      <div className="bt-list-head">
        <h2 className="bt-h2" style={{ margin: 0 }}>Arbeitsschritte</h2>
        <span className="bt-count">{steps.length}</span>
      </div>
      <p className="bt-data-note" style={{ margin: "0 0 12px" }}>
        Leiste antippen klappt den Schritt auf – mit Kennzahlen, den
        zugeordneten Ausgaben und der Zuordnung weiterer Positionen.
      </p>

      <div className="bt-add-cat" style={{ marginBottom: 14 }}>
        <input
          className="bt-input"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStep()}
          placeholder="z. B. Rohbau, Dach, Innenausbau …"
        />
        <button className="bt-mini-add" onClick={addStep} disabled={!newStep.trim()}>
          Schritt anlegen
        </button>
      </div>

      {steps.length === 0 && (
        <div className="bt-empty" style={{ padding: "18px 4px 22px" }}>
          Noch keine Arbeitsschritte. Leg oben deinen ersten an – z. B. „Rohbau“.
        </div>
      )}

      <div className="bt-step-list">
        {groups.map(({ step, items }) => renderBar(step.id, step.name, items, true))}
        {unassigned.length > 0 &&
          renderBar(UNASSIGNED, "Ohne Arbeitsschritt", unassigned, false)}
      </div>
    </section>
  );
}
