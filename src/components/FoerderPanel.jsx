import React, { useMemo, useState } from "react";
import { FOERDER_STATUS } from "../constants";
import { eur, eur0 } from "../utils/format";
import { statusOf, refundOf, statusPatch } from "../utils/foerder";
import ExpenseForm from "./ExpenseForm";
import ExpenseRow from "./ExpenseRow";
import Meter from "./Meter";

export default function FoerderPanel({
  expenses,
  categories,
  credits,
  calc,
  onAdd,
  onUpdateExpense,
  onDeleteExpense,
  onAddCategory,
}) {
  const [filter, setFilter] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const items = useMemo(
    () =>
      expenses
        .filter((e) => e.foerderfaehig)
        .map((e) => ({ e, status: statusOf(e), refund: refundOf(e) }))
        .sort((a, b) => (b.e.date || "").localeCompare(a.e.date || "")),
    [expenses]
  );

  const shown = filter ? items.filter((i) => i.status === filter) : items;
  const byStatus = calc.refundByStatus;

  return (
    <>
      <section className="bt-hero">
        <div className="bt-hero-top">
          <span className="bt-label">Verfügbar inkl. Zusagen</span>
          {calc.refundOpen > 0 && (
            <span className="bt-pill is-acc">{eur0(calc.refundOpen)} unterwegs</span>
          )}
        </div>
        <div className={"bt-hero-num" + (calc.plannedRemaining < 0 ? " is-warn" : "")}>
          {eur(calc.plannedRemaining)}
        </div>
        <div className="bt-hero-sub">
          {eur0(calc.remaining)} liegen jetzt bereit
          {calc.creditRefundZusage > 0
            ? ` · ${eur0(calc.creditRefundZusage)} sind fest zugesagt`
            : ""}
        </div>

        <div className="bt-stats" style={{ marginTop: 16 }}>
          <Stat3
            label="Ausgezahlt"
            value={eur(byStatus.ausgezahlt.sum)}
            sub="schon auf dem Konto"
            tone="good"
          />
          <Stat3
            label="Fest zugesagt"
            value={eur(byStatus.zusage.sum)}
            sub="erhöht die planbaren Mittel"
            tone="acc"
          />
          <Stat3
            label="Beantragt"
            value={eur(byStatus.angegeben.sum)}
            sub="Entscheidung offen"
            tone="open"
          />
          <Stat3
            label="Nur kalkuliert"
            value={eur(byStatus.bezahlt.sum)}
            sub="noch nicht eingereicht"
            tone="mut"
          />
        </div>
      </section>

      <section className="bt-pipe">
        <div className="bt-list-head">
          <h2 className="bt-h2" style={{ margin: 0 }}>Status der Förderungen</h2>
          {filter && (
            <button className="bt-mini" onClick={() => setFilter(null)}>
              Filter aufheben
            </button>
          )}
        </div>
        <p className="bt-data-note" style={{ margin: "0 0 12px" }}>
          Antippen filtert die Liste. Je weiter rechts, desto sicherer zählt das
          Geld zu deinen Mitteln.
        </p>
        <div className="bt-pipe-grid">
          {FOERDER_STATUS.map((s, i) => {
            const st = byStatus[s.key];
            return (
              <button
                key={s.key}
                className={
                  "bt-pipe-card is-" + s.tone + (filter === s.key ? " is-active" : "")
                }
                onClick={() => setFilter(filter === s.key ? null : s.key)}
                title={s.effect}
              >
                <span className="bt-pipe-step">
                  <span className="bt-status-step">{i + 1}</span>
                  {s.label}
                </span>
                <span className="bt-pipe-sum">{eur0(st.sum)}</span>
                <span className="bt-pipe-count">
                  {st.count} {st.count === 1 ? "Eintrag" : "Einträge"}
                </span>
              </button>
            );
          })}
        </div>
        {calc.refund > 0 && (
          <>
            <Meter
              total={calc.refund}
              effective={byStatus.ausgezahlt.sum}
              refund={byStatus.zusage.sum}
              pending={byStatus.angegeben.sum}
            />
            <div className="bt-credit-foot">
              <span>
                {Math.round((byStatus.ausgezahlt.sum / calc.refund) * 100)} % der
                erwarteten Förderung sind ausgezahlt
              </span>
              <span className="bt-acc">von {eur0(calc.refund)}</span>
            </div>
          </>
        )}
      </section>

      <ExpenseForm
        foerderOnly
        credits={credits}
        categories={categories}
        onAdd={onAdd}
        onAddCategory={onAddCategory}
      />

      <section className="bt-list">
        <div className="bt-list-head">
          <h2 className="bt-h2">
            {filter
              ? FOERDER_STATUS.find((s) => s.key === filter).label
              : "Förderfähige Ausgaben"}
          </h2>
          <span className="bt-count">{shown.length}</span>
        </div>

        {shown.length === 0 ? (
          <div className="bt-empty">
            {filter
              ? "In diesem Status liegt gerade nichts."
              : "Noch keine förderfähigen Ausgaben. Trag oben deine erste ein."}
          </div>
        ) : (
          <ul className="bt-rows">
            {shown.map(({ e, status, refund }) => (
              <ExpenseRow
                key={e.id}
                expense={e}
                foerderOnly
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
                statusBar={
                  <div className="bt-statusbar">
                    <span className="bt-statusbar-l">{eur0(refund)} Förderung</span>
                    <div className="bt-statusbar-btns">
                      {FOERDER_STATUS.map((s) => (
                        <button
                          key={s.key}
                          className={
                            "bt-statusbar-btn is-" +
                            s.tone +
                            (status === s.key ? " is-active" : "")
                          }
                          onClick={() => onUpdateExpense(e.id, statusPatch(e, s.key))}
                          title={`${s.label}: ${s.effect}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                }
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat3({ label, value, sub, tone }) {
  return (
    <div className="bt-stat">
      <div className="bt-stat-l">
        <span className={"bt-dot-tone is-" + tone} /> {label}
      </div>
      <div className="bt-stat-v">{value}</div>
      <div className="bt-stat-sub">{sub}</div>
    </div>
  );
}
