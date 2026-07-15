import React from "react";
import { eur, eur0, fmtDate } from "../utils/format";
import { openAttachment } from "../utils/attachments";
import ExpenseForm from "./ExpenseForm";

export default function ExpenseRow({
  expense: e,
  credits,
  categories,
  expanded,
  onToggle,
  onUpdate,
  onDelete,
  onAddCategory,
}) {
  const isPriv = e.creditId === "priv";
  const credit = credits.find((c) => c.id === e.creditId);
  const srcName = isPriv ? "Privatkonto" : credit ? credit.name : "—";
  const payAcc = e.auszahlKonto || e.creditId;
  const payName =
    payAcc === "priv"
      ? "Privatkonto"
      : credits.find((c) => c.id === payAcc)?.name || "Konto";
  const refund = e.foerderfaehig ? e.amount * ((e.foerderPercent || 0) / 100) : 0;

  return (
    <li className={"bt-row" + (expanded ? " is-open" : "")}>
      <div
        className="bt-row-line"
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={onToggle}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="bt-row-main">
          <div className="bt-row-top">
            <span className="bt-row-desc">{e.desc || "Ohne Bezeichnung"}</span>
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
                onClick={(ev) => {
                  ev.stopPropagation();
                  openAttachment(a);
                }}
                title={a.name}
              >
                {a.type && a.type.startsWith("image/") ? "🖼" : "📄"}{" "}
                {a.name && a.name.length > 16 ? a.name.slice(0, 14) + "…" : a.name || "Beleg"}
              </button>
            ))}
          </div>
        </div>
        <div className="bt-row-actions">
          <span className="bt-chevron" aria-hidden="true">▾</span>
          <button
            className="bt-del"
            onClick={(ev) => {
              ev.stopPropagation();
              onDelete();
            }}
            aria-label="Ausgabe löschen"
          >
            ×
          </button>
        </div>
      </div>
      {expanded && (
        <div className="bt-row-editor">
          <ExpenseForm
            inline
            credits={credits}
            categories={categories}
            initial={e}
            onUpdate={onUpdate}
            onCancelEdit={onToggle}
            onAddCategory={onAddCategory}
          />
        </div>
      )}
    </li>
  );
}
