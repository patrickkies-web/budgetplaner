import React from "react";

export default function Style() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

:root{
  --bg:#F4F5F7; --surface:#FFFFFF; --ink:#16181D; --muted:#71767F;
  --faint:#9AA0A8; --line:#E7E9ED; --line-soft:#EEF0F3;
  --accent:#2F6BFF; --accent-soft:#EAF0FF; --track:#ECEEF1;
  --warn:#E5484D; --ok:#0F9D6E;
  --r-lg:18px; --r-md:13px; --r-sm:10px;
  --fb:'Inter',system-ui,-apple-system,sans-serif;
  --fd:'Space Grotesk','Inter',system-ui,sans-serif;
}
*{box-sizing:border-box}
.bt-root{
  font-family:var(--fb); background:var(--bg); color:var(--ink);
  min-height:100vh; width:100%; -webkit-font-smoothing:antialiased;
  font-feature-settings:"tnum" 0;
}
.bt-loading{padding:80px 0;text-align:center;color:var(--muted)}
.bt-shell{max-width:560px;margin:0 auto;padding:22px 16px 48px}

/* header */
.bt-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px}
.bt-brand{display:flex;gap:12px;align-items:center}
.bt-mark{
  width:30px;height:30px;border-radius:9px;flex:0 0 auto;
  background:var(--ink);
  background-image:linear-gradient(135deg,var(--ink) 0 50%,var(--accent) 50% 100%);
}
.bt-eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);font-weight:600}
.bt-title{font-family:var(--fd);font-size:22px;font-weight:600;margin:1px 0 0;letter-spacing:-.01em}
.bt-gear{
  border:1px solid var(--line);background:var(--surface);color:var(--ink);
  font-family:var(--fb);font-size:13px;font-weight:600;padding:8px 14px;border-radius:999px;
  cursor:pointer;transition:.15s;white-space:nowrap;
}
.bt-gear:hover{border-color:#d6dae0}
.bt-gear.is-on{background:var(--ink);color:#fff;border-color:var(--ink)}

/* settings */
.bt-settings{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);
  padding:18px;margin-bottom:16px;animation:drop .22s ease;
}
.bt-credit-edit{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
@media(max-width:440px){.bt-credit-edit{grid-template-columns:1fr}}

/* hero */
.bt-hero{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);
  padding:22px 20px;margin-bottom:16px;box-shadow:0 1px 2px rgba(20,24,32,.03),0 12px 30px -18px rgba(20,24,32,.18);
}
.bt-hero-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.bt-label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);font-weight:600}
.bt-pill{font-size:11px;font-weight:600;padding:4px 9px;border-radius:999px}
.bt-pill.is-ok{background:#E9F7F1;color:var(--ok)}
.bt-pill.is-warn{background:#FCEBEB;color:var(--warn)}
.bt-hero-num{
  font-family:var(--fd);font-size:40px;font-weight:600;letter-spacing:-.02em;
  font-variant-numeric:tabular-nums;line-height:1.05;margin:2px 0 18px;
}
.bt-hero-num.is-warn{color:var(--warn)}

/* meter */
.bt-meter{
  display:flex;height:12px;border-radius:999px;overflow:hidden;background:var(--track);
}
.bt-meter.is-thin{height:8px}
.bt-seg{height:100%;transition:width .45s cubic-bezier(.2,.7,.2,1)}
.seg-ink{background:var(--ink)}
.seg-acc{background:var(--accent)}

.bt-legend{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:14px}
.bt-leg{display:flex;align-items:center;gap:7px;font-size:12.5px}
.bt-sw{width:9px;height:9px;border-radius:3px;flex:0 0 auto}
.sw-ink{background:var(--ink)} .sw-accent{background:var(--accent)} .sw-track{background:var(--track);border:1px solid var(--line)}
.bt-leg-l{color:var(--muted)}
.bt-leg-v{font-weight:600;font-variant-numeric:tabular-nums}

.bt-stats{
  display:grid;grid-template-columns:1fr 1fr;gap:1px;margin-top:18px;
  background:var(--line-soft);border:1px solid var(--line-soft);border-radius:var(--r-md);overflow:hidden;
}
.bt-stat{background:var(--surface);padding:12px 14px}
.bt-stat-l{font-size:11.5px;color:var(--muted);margin-bottom:3px;font-weight:500}
.bt-stat-v{font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.bt-stat-v.is-acc{color:var(--accent)}

/* credits */
.bt-credits{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
@media(max-width:440px){.bt-credits{grid-template-columns:1fr}}
.bt-credit{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:16px}
.bt-credit-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.bt-credit-name{font-weight:600;font-size:14px}
.bt-credit-rem{font-family:var(--fd);font-weight:600;font-size:17px;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.bt-credit-rem.is-warn{color:var(--warn)}
.bt-credit-sub{font-size:11.5px;color:var(--faint);margin:1px 0 12px}
.bt-credit-foot{display:flex;justify-content:space-between;gap:8px;margin-top:10px;font-size:11.5px;color:var(--muted)}
.bt-acc{color:var(--accent);font-weight:600}

/* form */
.bt-form{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}
.bt-form.is-editing{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
.bt-h2{font-family:var(--fd);font-size:16px;font-weight:600;margin:0 0 14px;letter-spacing:-.01em}
.bt-form-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:12px}
.bt-field{margin-bottom:14px}
.bt-field:last-child{margin-bottom:0}
.bt-flabel{display:block;font-size:12px;color:var(--muted);font-weight:500;margin-bottom:6px}
.bt-input{
  width:100%;border:1px solid var(--line);background:var(--surface);color:var(--ink);
  font-family:var(--fb);font-size:15px;padding:11px 13px;border-radius:var(--r-sm);
  transition:.15s;outline:none;
}
.bt-input::placeholder{color:var(--faint)}
.bt-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
.bt-input-lg{font-family:var(--fd);font-size:20px;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.01em}

/* select */
.bt-select-wrap{position:relative}
.bt-select{appearance:none;-webkit-appearance:none;-moz-appearance:none;padding-right:34px;cursor:pointer;background:var(--surface)}
.bt-select-arrow{position:absolute;right:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--faint);font-size:12px}

/* categories */
.bt-flabel-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.bt-mini{border:none;background:transparent;color:var(--accent);font-family:var(--fb);font-size:12.5px;font-weight:600;cursor:pointer;padding:2px 4px;border-radius:6px}
.bt-mini:hover{background:var(--accent-soft)}
.bt-add-cat{display:flex;gap:8px}
.bt-add-cat .bt-input{flex:1}
.bt-mini-add{
  border:none;background:var(--ink);color:#fff;font-family:var(--fb);font-size:13px;font-weight:600;
  padding:0 16px;border-radius:var(--r-sm);cursor:pointer;white-space:nowrap;transition:.15s;
}
.bt-mini-add:hover:not(:disabled){background:#000}
.bt-mini-add:disabled{background:var(--track);color:var(--faint);cursor:not-allowed}
.bt-cat-list{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.bt-cat-tag{display:inline-flex;align-items:center;gap:5px;background:var(--bg);border:1px solid var(--line-soft);border-radius:7px;padding:5px 6px 5px 10px;font-size:12.5px;font-weight:500}
.bt-cat-x{border:none;background:transparent;color:var(--faint);font-size:15px;line-height:1;cursor:pointer;padding:0 2px;border-radius:5px}
.bt-cat-x:hover{color:var(--warn)}
.bt-cat-empty{font-size:12.5px;color:var(--faint)}

/* upload */
.bt-upload{
  display:block;text-align:center;border:1px dashed var(--line);background:var(--bg);color:var(--muted);
  font-family:var(--fb);font-size:13.5px;font-weight:600;padding:13px;border-radius:var(--r-sm);
  cursor:pointer;transition:.15s;position:relative;overflow:hidden;
}
.bt-upload:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}
.bt-upload input{position:absolute;inset:0;opacity:0;cursor:pointer;font-size:0}
.bt-files{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.bt-file{display:inline-flex;align-items:center;gap:6px;background:var(--bg);border:1px solid var(--line-soft);border-radius:8px;padding:5px 6px 5px 9px;font-size:12px;max-width:100%}
.bt-file-ic{font-size:13px}
.bt-file-name{max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink);font-weight:500}
.bt-file-x{border:none;background:transparent;color:var(--faint);font-size:16px;line-height:1;cursor:pointer;padding:0 2px;border-radius:5px}
.bt-file-x:hover{color:var(--warn)}

/* segmented */
.bt-seg-ctrl{display:flex;gap:6px;background:var(--bg);padding:4px;border-radius:var(--r-sm);border:1px solid var(--line-soft)}
.bt-seg-btn{
  flex:1;min-width:0;border:none;background:transparent;color:var(--muted);
  font-family:var(--fb);font-size:13px;font-weight:600;padding:9px 6px;border-radius:7px;cursor:pointer;transition:.15s;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.bt-seg-btn.is-active{background:var(--surface);color:var(--ink);box-shadow:0 1px 2px rgba(20,24,32,.08)}
.bt-seg-btn.is-active.is-acc{background:var(--accent);color:#fff}
.bt-seg-btn.is-active.is-good{background:var(--ok);color:#fff}

/* pct */
.bt-reveal{animation:drop .2s ease}
.bt-pct-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.bt-quick{
  border:1px solid var(--line);background:var(--surface);color:var(--muted);
  font-family:var(--fb);font-size:13px;font-weight:600;padding:8px 12px;border-radius:999px;cursor:pointer;transition:.15s;
}
.bt-quick.is-active{background:var(--accent);border-color:var(--accent);color:#fff}
.bt-pct-input{position:relative;flex:1;min-width:90px}
.bt-pct-input .bt-input{padding-right:30px}
.bt-pct-suffix{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--faint);font-size:14px;font-weight:600}
.bt-hint{margin-top:9px;font-size:13px;color:var(--muted)}
.bt-hint strong{color:var(--accent);font-variant-numeric:tabular-nums}

.bt-add{
  width:100%;margin-top:18px;border:none;background:var(--ink);color:#fff;
  font-family:var(--fb);font-size:15px;font-weight:600;padding:14px;border-radius:var(--r-md);cursor:pointer;transition:.15s;
}
.bt-add:hover:not(:disabled){background:#000}
.bt-add:disabled{background:var(--track);color:var(--faint);cursor:not-allowed}
.bt-cancel{
  width:100%;margin-top:8px;border:1px solid var(--line);background:var(--surface);color:var(--muted);
  font-family:var(--fb);font-size:15px;font-weight:600;padding:12px;border-radius:var(--r-md);cursor:pointer;transition:.15s;
}
.bt-cancel:hover{background:var(--bg);color:var(--ink)}

/* list */
.bt-list{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:18px 18px 8px}
.bt-list-head{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.bt-count{background:var(--bg);color:var(--muted);font-size:12px;font-weight:600;padding:2px 9px;border-radius:999px}
.bt-empty{padding:26px 4px 30px;text-align:center;color:var(--faint);font-size:14px}
.bt-rows{list-style:none;margin:0;padding:0}
.bt-row{border-top:1px solid var(--line-soft)}
.bt-row:first-child{border-top:none}
.bt-row-line{display:flex;align-items:center;gap:10px;padding:14px 0;cursor:pointer;border-radius:var(--r-sm);transition:background .15s}
.bt-row-line:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.bt-row-main{flex:1;min-width:0}
.bt-row-top{display:flex;justify-content:space-between;gap:10px;align-items:baseline}
.bt-row-desc{font-weight:600;font-size:14.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bt-row-amt{font-family:var(--fd);font-weight:600;font-size:15px;font-variant-numeric:tabular-nums;white-space:nowrap}
.bt-row-meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:7px}
.bt-date{font-size:11.5px;color:var(--faint);font-variant-numeric:tabular-nums}
.bt-chip{font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;background:var(--bg);color:var(--muted)}
.bt-chip.is-acc{background:var(--accent-soft);color:var(--accent)}
.bt-chip.is-mut{background:transparent;border:1px solid var(--line);color:var(--faint)}
.bt-chip.is-priv{background:#F1ECFE;color:#6D44E0}
.bt-chip.is-good{background:#E9F7F1;color:var(--ok)}
.bt-chip.is-open{background:#FFF4E5;color:#B5780B}
.bt-chip.is-cat{background:#EAF0FF;color:#2453C2}
.bt-chip.is-file{font-family:var(--fb);font-size:11px;font-weight:600;border:1px solid var(--line);background:var(--surface);color:var(--muted);cursor:pointer;display:inline-flex;align-items:center;gap:3px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bt-chip.is-file:hover{border-color:var(--accent);color:var(--accent)}
.bt-row-actions{display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0}
.bt-del{
  flex:0 0 auto;width:28px;height:28px;border-radius:8px;border:1px solid var(--line-soft);
  background:var(--surface);color:var(--faint);font-size:18px;line-height:1;cursor:pointer;transition:.15s;
}
.bt-del:hover{background:#FCEBEB;border-color:#F6D4D4;color:var(--warn)}
.bt-chevron{
  width:28px;height:28px;display:flex;align-items:center;justify-content:center;
  color:var(--faint);font-size:13px;transition:transform .2s ease,color .15s;
}
.bt-row.is-open .bt-chevron{transform:rotate(180deg);color:var(--accent)}
.bt-row-editor{margin:2px 0 14px;animation:drop .2s ease}
.bt-form.bt-form-inline{
  padding:16px;margin-bottom:0;background:var(--bg);
  border-color:var(--line);box-shadow:none;border-radius:var(--r-md);
}

/* stat sub-line */
.bt-stat-sub{font-size:10.5px;color:var(--faint);margin-top:3px;font-weight:500}

/* private summary */
.bt-credit-priv{margin-bottom:16px;border-color:#E6DEFA}
.bt-credit-priv .bt-credit-name{display:inline-flex;align-items:center;gap:8px}
.bt-private-dot{width:9px;height:9px;border-radius:3px;background:#6D44E0}

/* stats panel */
.bt-statspanel{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:18px;margin-bottom:16px}
.bt-statspanel-head{display:flex;align-items:center;gap:9px;margin-bottom:14px}
.bt-swiper{
  display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;
  -webkit-overflow-scrolling:touch;scrollbar-width:none;overscroll-behavior-x:contain;
}
.bt-swiper::-webkit-scrollbar{display:none}
.bt-cat-card{
  flex:0 0 100%;min-width:0;scroll-snap-align:start;
  background:var(--bg);border:1px solid var(--line-soft);border-radius:var(--r-md);padding:16px;
}
.bt-cs-top{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.bt-cs-name{font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bt-cs-share{font-size:11.5px;color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.bt-cs-total{font-family:var(--fd);font-size:26px;font-weight:600;letter-spacing:-.01em;font-variant-numeric:tabular-nums;margin:4px 0 12px}
.bt-cs-rows{margin-top:12px}
.bt-cs-row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-top:1px solid var(--line-soft);font-size:12.5px;align-items:baseline}
.bt-cs-row span{color:var(--muted);min-width:0}
.bt-cs-row strong{font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
.bt-cs-row .bt-cs-acc{color:var(--accent)}
.bt-cs-ellip{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bt-dots{display:flex;justify-content:center;gap:6px;margin-top:12px}
.bt-dot{
  width:7px;height:7px;border-radius:999px;border:none;padding:0;cursor:pointer;
  background:var(--track);transition:.2s;
}
.bt-dot:hover{background:var(--faint)}
.bt-dot.is-active{background:var(--ink);width:18px}

/* uncategorized */
.bt-nocat{margin-top:16px;border-top:1px solid var(--line-soft);padding-top:14px}
.bt-nocat-head{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.bt-nocat-title{font-size:13.5px;font-weight:600}
.bt-nocat-hint{font-size:11.5px;color:var(--faint);line-height:1.5;margin:0 0 6px}
.bt-nocat-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid var(--line-soft)}
.bt-nocat-row:first-of-type{border-top:none}
.bt-nocat-main{flex:1;min-width:0}
.bt-nocat-desc{font-weight:600;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bt-nocat-sub{font-size:11.5px;color:var(--faint);margin-top:2px;font-variant-numeric:tabular-nums}
.bt-nocat-selwrap{flex:0 0 auto}
.bt-nocat-select{width:auto;font-size:12.5px;padding:8px 28px 8px 11px}

/* data / backup */
.bt-data{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:18px;margin-top:16px}
.bt-data-btns{display:flex;flex-wrap:wrap;gap:8px}
.bt-data-btn{
  flex:1;min-width:120px;text-align:center;border:1px solid var(--line);background:var(--surface);color:var(--ink);
  font-family:var(--fb);font-size:13.5px;font-weight:600;padding:11px 12px;border-radius:var(--r-sm);cursor:pointer;transition:.15s;
}
.bt-data-btn:hover{border-color:#d6dae0;background:var(--bg)}
.bt-data-btn.is-primary{background:var(--ink);color:#fff;border-color:var(--ink)}
.bt-data-btn.is-primary:hover{background:#000}
.bt-data-btn.is-file{position:relative;overflow:hidden}
.bt-data-btn.is-file input{position:absolute;inset:0;opacity:0;cursor:pointer;font-size:0}
.bt-data-note{font-size:11.5px;color:var(--faint);line-height:1.5;margin:12px 0 0}

.bt-foot{text-align:center;font-size:11.5px;color:var(--faint);margin-top:22px}

@keyframes drop{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
    `}</style>
  );
}
