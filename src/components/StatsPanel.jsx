import React, { useMemo, useRef, useState } from "react";
import { eur, eur0, fmtDate } from "../utils/format";
import Meter from "./Meter";

export default function StatsPanel({ expenses, categories, onAssignCategory }) {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);
  const GAP = 12;

  const stats = useMemo(() => {
    const totalSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const byCat = new Map();
    const uncategorized = [];
    expenses.forEach((e) => {
      const amt = e.amount || 0;
      const refund = e.foerderfaehig ? amt * ((e.foerderPercent || 0) / 100) : 0;
      if (!e.category) {
        uncategorized.push(e);
        return;
      }
      if (!byCat.has(e.category)) {
        byCat.set(e.category, {
          name: e.category,
          total: 0,
          count: 0,
          refund: 0,
          refundPaid: 0,
          max: null,
          last: "",
        });
      }
      const c = byCat.get(e.category);
      c.total += amt;
      c.count += 1;
      c.refund += refund;
      if (e.foerderfaehig && e.ausgezahlt) c.refundPaid += refund;
      if (!c.max || amt > (c.max.amount || 0)) c.max = e;
      if ((e.date || "") > c.last) c.last = e.date || "";
    });
    const cats = [...byCat.values()].sort((a, b) => b.total - a.total);
    uncategorized.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return { totalSpent, cats, uncategorized };
  }, [expenses]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || stats.cats.length === 0) return;
    const w = el.clientWidth + GAP;
    const i = Math.round(el.scrollLeft / w);
    setActive(Math.max(0, Math.min(stats.cats.length - 1, i)));
  };

  const goTo = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * (el.clientWidth + GAP), behavior: "smooth" });
  };

  return (
    <section className="bt-statspanel">
      <div className="bt-statspanel-head">
        <h2 className="bt-h2" style={{ margin: 0 }}>Statistiken</h2>
        <span className="bt-count">
          {stats.cats.length} {stats.cats.length === 1 ? "Kategorie" : "Kategorien"}
        </span>
      </div>

      {stats.cats.length === 0 ? (
        <div className="bt-empty" style={{ padding: "18px 4px 22px" }}>
          Noch keine kategorisierten Ausgaben – sobald du Ausgaben einer
          Kategorie zuordnest, erscheinen hier die Statistiken.
        </div>
      ) : (
        <>
          <div className="bt-swiper" ref={scrollerRef} onScroll={handleScroll}>
            {stats.cats.map((c) => {
              const share = stats.totalSpent > 0 ? (c.total / stats.totalSpent) * 100 : 0;
              return (
                <div className="bt-cat-card" key={c.name}>
                  <div className="bt-cs-top">
                    <span className="bt-cs-name">{c.name}</span>
                    <span className="bt-cs-share">
                      {share.toFixed(share >= 10 ? 0 : 1).replace(".", ",")}&nbsp;% der Ausgaben
                    </span>
                  </div>
                  <div className="bt-cs-total">{eur(c.total)}</div>
                  <Meter total={stats.totalSpent} effective={c.total} refund={0} thin />
                  <div className="bt-cs-rows">
                    <div className="bt-cs-row">
                      <span>Anzahl Ausgaben</span>
                      <strong>{c.count}</strong>
                    </div>
                    <div className="bt-cs-row">
                      <span>Ø pro Ausgabe</span>
                      <strong>{eur(c.total / c.count)}</strong>
                    </div>
                    {c.max && (
                      <div className="bt-cs-row">
                        <span className="bt-cs-ellip">
                          Größte: {c.max.desc || "Ohne Bezeichnung"}
                        </span>
                        <strong>{eur(c.max.amount)}</strong>
                      </div>
                    )}
                    {c.refund > 0 && (
                      <div className="bt-cs-row">
                        <span>Erw. Förderung</span>
                        <strong className="bt-cs-acc">
                          {eur0(c.refund)}
                          {c.refund - c.refundPaid > 0.005
                            ? ` (${eur0(c.refund - c.refundPaid)} offen)`
                            : ""}
                        </strong>
                      </div>
                    )}
                    {c.last && (
                      <div className="bt-cs-row">
                        <span>Letzte Ausgabe</span>
                        <strong>{fmtDate(c.last)}</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {stats.cats.length > 1 && (
            <div className="bt-dots" role="tablist" aria-label="Kategorie wählen">
              {stats.cats.map((c, i) => (
                <button
                  key={c.name}
                  className={"bt-dot" + (i === active ? " is-active" : "")}
                  onClick={() => goTo(i)}
                  aria-label={c.name}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </>
      )}

      {stats.uncategorized.length > 0 && (
        <div className="bt-nocat">
          <div className="bt-nocat-head">
            <span className="bt-nocat-title">Ohne Kategorie</span>
            <span className="bt-chip is-open">{stats.uncategorized.length}</span>
          </div>
          <p className="bt-nocat-hint">
            Diese Ausgaben sind noch keiner Kategorie zugeordnet – direkt hier
            zuweisen:
          </p>
          {stats.uncategorized.map((e) => (
            <div className="bt-nocat-row" key={e.id}>
              <div className="bt-nocat-main">
                <div className="bt-nocat-desc">{e.desc || "Ohne Bezeichnung"}</div>
                <div className="bt-nocat-sub">
                  {fmtDate(e.date)} · {eur(e.amount)}
                </div>
              </div>
              <div className="bt-select-wrap bt-nocat-selwrap">
                <select
                  className="bt-input bt-select bt-nocat-select"
                  value=""
                  onChange={(ev) => {
                    if (ev.target.value) onAssignCategory(e.id, ev.target.value);
                  }}
                  aria-label={`Kategorie für ${e.desc || "Ausgabe"} wählen`}
                >
                  <option value="">Zuordnen …</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="bt-select-arrow">▾</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
