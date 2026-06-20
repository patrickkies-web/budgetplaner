import React, { useState, useEffect, useMemo, useRef } from "react";
import { CATEGORIES, DEFAULT_STATE } from "./constants";
import { eur, eur0, uid, todayISO, fmtDate, download } from "./utils/format";
import { attachGet, attachSet, attachDel, openAttachment } from "./utils/attachments";
import { loadState, saveState } from "./utils/persistence";
import Meter from "./components/Meter";
import Legend from "./components/Legend";
import Stat from "./components/Stat";
import Settings from "./components/Settings";
import ExpenseForm from "./components/ExpenseForm";
import Style from "./components/Style";

function structuredCloneSafe(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function App() {
  const [state, setState] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const loadedOnce = useRef(false);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      loadedOnce.current = true;
    });
  }, []);

  useEffect(() => {
    if (loadedOnce.current && state) saveState(state);
  }, [state]);

  const calc = useMemo(() => {
    if (!state) return null;
    const perCredit = {};
    state.credits.forEach((c) => {
      perCredit[c.id] = { total: c.total || 0, spent: 0, payout: 0 };
    });
    let spent = 0, refund = 0;
    let privSpent = 0, privPayout = 0;
    let refundPaid = 0;
    state.expenses.forEach((e) => {
      const amt = e.amount || 0;
      const r = e.foerderfaehig ? amt * ((e.foerderPercent || 0) / 100) : 0;
      spent += amt;
      refund += r;
      if (e.creditId === "priv") privSpent += amt;
      else if (perCredit[e.creditId]) perCredit[e.creditId].spent += amt;
      if (e.foerderfaehig && e.ausgezahlt) {
        refundPaid += r;
        const acc = e.auszahlKonto || e.creditId;
        if (acc === "priv") privPayout += r;
        else if (perCredit[acc]) perCredit[acc].payout += r;
        else privPayout += r;
      }
    });
    const baseBudget = state.credits.reduce((s, c) => s + (c.total || 0), 0);
    const budget = baseBudget + refundPaid;
    return {
      perCredit,
      baseBudget,
      budget,
      spent,
      refund,
      refundPaid,
      refundOpen: refund - refundPaid,
      privSpent,
      privPayout,
      privRemaining: privPayout - privSpent,
      remaining: budget - spent,
      effective: spent - refund,
    };
  }, [state]);

  if (!state || !calc) {
    return (
      <div className="bt-root">
        <Style />
        <div className="bt-loading">Lädt …</div>
      </div>
    );
  }

  const update = (fn) => setState((prev) => fn(structuredCloneSafe(prev)));

  const addExpense = (exp) =>
    update((s) => {
      s.expenses.unshift({ id: uid(), ...exp });
      return s;
    });

  const deleteExpense = (id) => {
    const exp = state.expenses.find((e) => e.id === id);
    if (exp && exp.attachments) exp.attachments.forEach((a) => attachDel(a.id));
    update((s) => {
      s.expenses = s.expenses.filter((e) => e.id !== id);
      return s;
    });
  };

  const updateProject = (patch) => update((s) => ({ ...s, ...patch }));

  const addCategory = (name) => {
    const n = (name || "").trim();
    if (!n) return;
    update((s) => {
      const list = s.categories ? [...s.categories] : [...CATEGORIES];
      if (!list.some((c) => c.toLowerCase() === n.toLowerCase())) list.push(n);
      s.categories = list;
      return s;
    });
  };

  const removeCategory = (name) =>
    update((s) => {
      s.categories = (s.categories || []).filter((c) => c !== name);
      return s;
    });

  const updateCredit = (id, patch) =>
    update((s) => {
      s.credits = s.credits.map((c) => (c.id === id ? { ...c, ...patch } : c));
      return s;
    });

  const exportJSON = async () => {
    const _attachments = {};
    for (const e of state.expenses) {
      if (e.attachments) {
        for (const a of e.attachments) {
          const d = await attachGet(a.id);
          if (d) _attachments[a.id] = d;
        }
      }
    }
    download(
      `bau-tracker-${todayISO()}.json`,
      JSON.stringify({ ...state, _attachments }, null, 2),
      "application/json"
    );
  };

  const exportCSV = () => {
    const sep = ";";
    const head = [
      "Datum", "Bezeichnung", "Kategorie", "Betrag", "Bezahlt von",
      "Förderfähig", "Förderquote %", "Rückerstattung", "Förderung ausgezahlt",
      "Ausgezahlt auf Konto",
    ];
    const srcName = (id) =>
      id === "priv"
        ? "Privatkonto"
        : state.credits.find((c) => c.id === id)?.name || id;
    const rows = [...state.expenses]
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
      .map((e) => {
        const r = e.foerderfaehig ? e.amount * ((e.foerderPercent || 0) / 100) : 0;
        return [
          fmtDate(e.date),
          '"' + String(e.desc || "").replace(/"/g, '""') + '"',
          e.category || "",
          (e.amount || 0).toFixed(2).replace(".", ","),
          srcName(e.creditId),
          e.foerderfaehig ? "Ja" : "Nein",
          e.foerderfaehig ? String(e.foerderPercent || 0) : "",
          r ? r.toFixed(2).replace(".", ",") : "",
          e.foerderfaehig ? (e.ausgezahlt ? "Ja" : "Nein") : "",
          e.foerderfaehig && e.ausgezahlt ? srcName(e.auszahlKonto || e.creditId) : "",
        ].join(sep);
      });
    const csv = "﻿" + [head.join(sep), ...rows].join("\r\n");
    download(`bau-ausgaben-${todayISO()}.csv`, csv, "text/csv;charset=utf-8");
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result);
        if (data && Array.isArray(data.expenses) && Array.isArray(data.credits)) {
          if (window.confirm("Aktuelle Daten durch die geladene Datei ersetzen?")) {
            const atts = data._attachments || {};
            for (const id of Object.keys(atts)) {
              await attachSet(id, atts[id]);
            }
            const clean = { ...data };
            delete clean._attachments;
            setState({ ...DEFAULT_STATE, ...clean });
          }
        } else {
          window.alert("Die Datei hat kein gültiges Bau-Tracker-Format.");
        }
      } catch (e) {
        window.alert("Datei konnte nicht gelesen werden.");
      }
    };
    reader.readAsText(file);
  };

  const sortedExpenses = [...state.expenses].sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  );

  const over = calc.remaining < 0;

  return (
    <div className="bt-root">
      <Style />
      <div className="bt-shell">
        <header className="bt-head">
          <div className="bt-brand">
            <span className="bt-mark" aria-hidden="true" />
            <div>
              <div className="bt-eyebrow">Baufinanzierung</div>
              <h1 className="bt-title">{state.projectName || "Mein Bau"}</h1>
            </div>
          </div>
          <button
            className={"bt-gear" + (settingsOpen ? " is-on" : "")}
            onClick={() => setSettingsOpen((o) => !o)}
            aria-label="Einstellungen"
          >
            {settingsOpen ? "Fertig" : "Einrichten"}
          </button>
        </header>

        {settingsOpen && (
          <Settings
            state={state}
            categories={state.categories || CATEGORIES}
            onProject={updateProject}
            onCredit={updateCredit}
            onAddCategory={addCategory}
            onRemoveCategory={removeCategory}
          />
        )}

        <section className="bt-hero">
          <div className="bt-hero-top">
            <span className="bt-label">Verfügbarer Restbetrag</span>
            <span className={"bt-pill " + (over ? "is-warn" : "is-ok")}>
              {over ? "Budget überschritten" : "im Rahmen"}
            </span>
          </div>
          <div className={"bt-hero-num" + (over ? " is-warn" : "")}>
            {eur(calc.remaining)}
          </div>

          <Meter total={calc.budget + calc.refundOpen} effective={calc.spent} refund={calc.refundOpen} />

          <div className="bt-legend">
            <Legend swatch="ink" label="Ausgegeben" value={eur0(calc.spent)} />
            <Legend swatch="accent" label="Förderung kommt noch" value={eur0(calc.refundOpen)} />
            <Legend swatch="track" label="Verfügbar" value={eur0(Math.max(calc.remaining, 0))} />
          </div>

          <div className="bt-stats">
            <Stat
              label="Gesamtbudget"
              value={eur(calc.budget)}
              sub={calc.refundPaid > 0 ? `inkl. ${eur0(calc.refundPaid)} Förderung` : null}
            />
            <Stat label="Ausgegeben" value={eur(calc.spent)} />
            <Stat
              label="Erw. Förderung"
              value={eur(calc.refund)}
              accent
              sub={
                calc.refund > 0
                  ? calc.refundOpen > 0
                    ? `${eur0(calc.refundOpen)} noch offen`
                    : "vollständig ausgezahlt"
                  : null
              }
            />
            <Stat label="Effektive Kosten" value={eur(calc.effective)} />
          </div>
        </section>

        <section className="bt-credits">
          {state.credits.map((c) => {
            const pc = calc.perCredit[c.id];
            const avail = pc.total + pc.payout;
            const rem = avail - pc.spent;
            return (
              <div className="bt-credit" key={c.id}>
                <div className="bt-credit-head">
                  <span className="bt-credit-name">{c.name}</span>
                  <span className={"bt-credit-rem" + (rem < 0 ? " is-warn" : "")}>
                    {eur(rem)}
                  </span>
                </div>
                <div className="bt-credit-sub">
                  Restbetrag von {eur0(avail)}
                  {pc.payout > 0 ? ` · inkl. ${eur0(pc.payout)} Förderung` : ""}
                </div>
                <Meter total={avail} effective={pc.spent} refund={0} thin />
                <div className="bt-credit-foot">
                  <span>Ausgegeben {eur0(pc.spent)}</span>
                  {pc.payout > 0 && (
                    <span className="bt-acc">+ {eur0(pc.payout)} gutgeschrieben</span>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {(calc.privPayout > 0 || calc.privSpent > 0) && (
          <div className="bt-credit bt-credit-priv">
            <div className="bt-credit-head">
              <span className="bt-credit-name">
                <span className="bt-private-dot" /> Privatkonto
              </span>
              <span className="bt-credit-rem">{eur(calc.privRemaining)}</span>
            </div>
            <div className="bt-credit-sub">
              {calc.privPayout > 0
                ? `Förderung erhalten: ${eur0(calc.privPayout)}`
                : "Noch keine Förderung eingegangen"}
            </div>
            <Meter total={calc.privPayout} effective={calc.privSpent} refund={0} thin />
            <div className="bt-credit-foot">
              <span>Privat ausgegeben {eur0(calc.privSpent)}</span>
              {calc.privRemaining > 0 && (
                <span className="bt-acc">{eur0(calc.privRemaining)} verfügbar</span>
              )}
            </div>
          </div>
        )}

        <ExpenseForm
          credits={state.credits}
          categories={state.categories || CATEGORIES}
          onAdd={addExpense}
          onAddCategory={addCategory}
        />

        <section className="bt-list">
          <div className="bt-list-head">
            <h2 className="bt-h2">Ausgaben</h2>
            <span className="bt-count">{state.expenses.length}</span>
          </div>

          {sortedExpenses.length === 0 ? (
            <div className="bt-empty">
              Noch keine Ausgaben. Trag oben deine erste Position ein.
            </div>
          ) : (
            <ul className="bt-rows">
              {sortedExpenses.map((e) => {
                const isPriv = e.creditId === "priv";
                const credit = state.credits.find((c) => c.id === e.creditId);
                const srcName = isPriv ? "Privatkonto" : credit ? credit.name : "—";
                const payAcc = e.auszahlKonto || e.creditId;
                const payName =
                  payAcc === "priv"
                    ? "Privatkonto"
                    : state.credits.find((c) => c.id === payAcc)?.name || "Konto";
                const refund = e.foerderfaehig
                  ? e.amount * ((e.foerderPercent || 0) / 100)
                  : 0;
                return (
                  <li className="bt-row" key={e.id}>
                    <div className="bt-row-main">
                      <div className="bt-row-top">
                        <span className="bt-row-desc">
                          {e.desc || "Ohne Bezeichnung"}
                        </span>
                        <span className="bt-row-amt">{eur(e.amount)}</span>
                      </div>
                      <div className="bt-row-meta">
                        <span className="bt-date">{fmtDate(e.date)}</span>
                        {e.category && <span className="bt-chip is-cat">{e.category}</span>}
                        <span className={"bt-chip" + (isPriv ? " is-priv" : "")}>{srcName}</span>
                        {e.foerderfaehig ? (
                          <>
                            <span className="bt-chip is-acc">
                              {e.foerderPercent || 0}% · {eur0(refund)} zurück
                            </span>
                            <span className={"bt-chip " + (e.ausgezahlt ? "is-good" : "is-open")}>
                              {e.ausgezahlt ? `ausgezahlt · ${payName}` : "offen"}
                            </span>
                          </>
                        ) : (
                          <span className="bt-chip is-mut">nicht förderfähig</span>
                        )}
                        {(e.attachments || []).map((a) => (
                          <button
                            key={a.id}
                            className="bt-chip is-file"
                            onClick={() => openAttachment(a)}
                            title={a.name}
                          >
                            {a.type && a.type.startsWith("image/") ? "🖼" : "📄"}{" "}
                            {a.name && a.name.length > 16 ? a.name.slice(0, 14) + "…" : a.name || "Beleg"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      className="bt-del"
                      onClick={() => deleteExpense(e.id)}
                      aria-label="Ausgabe löschen"
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="bt-data">
          <h2 className="bt-h2">Daten sichern</h2>
          <div className="bt-data-btns">
            <button className="bt-data-btn is-primary" onClick={exportJSON}>
              Sichern (JSON)
            </button>
            <button className="bt-data-btn" onClick={exportCSV}>
              Als CSV (Excel)
            </button>
            <label className="bt-data-btn is-file">
              Datei laden
              <input
                type="file"
                accept="application/json,.json"
                onChange={(ev) => {
                  const f = ev.target.files && ev.target.files[0];
                  if (f) importJSON(f);
                  ev.target.value = "";
                }}
              />
            </label>
          </div>
          <p className="bt-data-note">
            „Sichern“ lädt eine Backup-Datei herunter. „Datei laden“ stellt sie
            wieder her – ideal zum Übertragen auf ein anderes Gerät.
          </p>
        </section>

        <footer className="bt-foot">
          Daten werden nur auf diesem Gerät gespeichert.
        </footer>
      </div>
    </div>
  );
}
