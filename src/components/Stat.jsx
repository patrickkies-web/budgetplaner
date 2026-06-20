import React from "react";

export default function Stat({ label, value, accent, sub }) {
  return (
    <div className="bt-stat">
      <div className="bt-stat-l">{label}</div>
      <div className={"bt-stat-v" + (accent ? " is-acc" : "")}>{value}</div>
      {sub && <div className="bt-stat-sub">{sub}</div>}
    </div>
  );
}
