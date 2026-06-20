import React from "react";

export default function Legend({ swatch, label, value }) {
  return (
    <div className="bt-leg">
      <span className={"bt-sw sw-" + swatch} />
      <span className="bt-leg-l">{label}</span>
      <span className="bt-leg-v">{value}</span>
    </div>
  );
}
