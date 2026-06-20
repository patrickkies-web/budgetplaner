import React from "react";
import { clamp } from "../utils/format";

export default function Meter({ total, effective, refund, thin }) {
  const safeTotal = total > 0 ? total : Math.max(effective + refund, 1);
  const effPct = clamp((effective / safeTotal) * 100, 0, 100);
  const refPct = clamp((refund / safeTotal) * 100, 0, 100 - effPct);
  return (
    <div className={"bt-meter" + (thin ? " is-thin" : "")}>
      <div className="bt-seg seg-ink" style={{ width: effPct + "%" }} />
      <div className="bt-seg seg-acc" style={{ width: refPct + "%" }} />
    </div>
  );
}
