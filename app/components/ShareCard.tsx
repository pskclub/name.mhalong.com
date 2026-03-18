import type { Ref } from "react";
import type { ResultType } from "../types";
import { getNumPred } from "../lib/calc";
import { kalakineeMap } from "../lib/numerology";

interface Props {
  result: ResultType;
  fullName: string;
  cardRef: Ref<HTMLDivElement>;
}

export default function ShareCard({ result, fullName, cardRef }: Props) {
  const { fn, ln, total, dayIdx, badInFirst } = result;
  const fnInfo = getNumPred(fn.sum);
  const lnInfo = ln ? getNumPred(ln.sum) : null;
  const totalInfo = getNumPred(total);
  const kalaOk = badInFirst.length === 0;

  const scoreColor = (s: number) => s >= 4 ? "#059669" : s >= 3 ? "#d97706" : "#dc2626";
  const scoreBg = (s: number) => s >= 4 ? "#d1fae5" : s >= 3 ? "#fef3c7" : "#fee2e2";

  return (
    <div
      ref={cardRef}
      className="bg"
      style={{
        position: "fixed", top: 0, left: 0, zIndex: -1, pointerEvents: "none",
        width: 600, fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif",
        padding: 32, boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#28261c" }}>เลขศาสตร์</div>
          <div style={{ fontSize: 12, color: "#98926c", marginTop: 2 }}>name.mhalong.com</div>
        </div>
        {fullName && (
          <div style={{ fontSize: 20, fontWeight: 700, color: "#28261c", textAlign: "right" }}>{fullName}</div>
        )}
      </div>

      {/* Score Cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, background: "#fefdfb", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: "1px solid #dad5c3" }}>
          <div style={{ fontSize: 11, color: "#7b7556", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>เลขชื่อ</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#28261c", lineHeight: 1 }}>{fn.sum}</div>
          <div style={{ fontSize: 12, color: "#625d45", marginTop: 6 }}>{fnInfo.title}</div>
          <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: scoreBg(fnInfo.score), color: scoreColor(fnInfo.score) }}>★ {fnInfo.score}/5</div>
        </div>
        {ln && lnInfo && (
          <div style={{ flex: 1, background: "#fefdfb", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: "1px solid #dad5c3" }}>
            <div style={{ fontSize: 11, color: "#7b7556", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>เลขนามสกุล</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#28261c", lineHeight: 1 }}>{ln.sum}</div>
            <div style={{ fontSize: 12, color: "#625d45", marginTop: 6 }}>{lnInfo.title}</div>
            <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: scoreBg(lnInfo.score), color: scoreColor(lnInfo.score) }}>★ {lnInfo.score}/5</div>
          </div>
        )}
        <div style={{ flex: 1, background: "#98926c", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: "1px solid #7b7556" }}>
          <div style={{ fontSize: 11, color: "#eceae1", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>เลขรวม</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: 12, color: "#f6f5f0", marginTop: 6 }}>{totalInfo.title}</div>
          <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.25)", color: "#fff" }}>★ {totalInfo.score}/5</div>
        </div>
      </div>

      {/* Predictions */}
      {[
        { label: "คำทำนายเลขชื่อ", info: fnInfo, highlight: false },
        ...(ln && lnInfo ? [{ label: "คำทำนายเลขนามสกุล", info: lnInfo, highlight: false }] : []),
        { label: "คำทำนายเลขรวม", info: totalInfo, highlight: true },
      ].map((item, i) => (
        <div key={i} style={{
          background: item.highlight ? "#eceae1" : "#fefdfb",
          borderRadius: 16, padding: 20, marginBottom: 12,
          border: item.highlight ? "1.5px solid #b9b28f" : "1.5px solid #dad5c3",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#28261c", marginBottom: 6 }}>
            {item.label} — {item.info.title}
          </div>
          <div style={{ fontSize: 11, color: "#28261c", fontWeight: 700, display: "inline-block", background: scoreBg(item.info.score), padding: "1px 8px", borderRadius: 99, marginBottom: 6 }}>★ {item.info.score}/5</div>
          <div style={{ fontSize: 12, color: "#4f4a38", lineHeight: 1.8, marginBottom: 12 }}>{item.info.text}</div>
          <div style={{ borderTop: "1px solid #d4cfbb", paddingTop: 12, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#625d45", background: "#f0ece0", border: "1px solid #c8c4a8", padding: "1px 8px", borderRadius: 99 }}>อีกตำราหนึ่ง</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4f4a38" }}>{item.info.titleAlter}</div>
            </div>
            <div style={{ fontSize: 11, color: "#28261c", fontWeight: 700, display: "inline-block", background: scoreBg(item.info.scoreAlter), padding: "1px 8px", borderRadius: 99, marginBottom: 6 }}>★ {item.info.scoreAlter}/5</div>
            <div style={{ fontSize: 12, color: "#4f4a38", lineHeight: 1.8 }}>{item.info.textAlter}</div>
          </div>
        </div>
      ))}

      {/* Kalakinee */}
      {dayIdx !== null && (
        <div style={{
          borderRadius: 16, padding: "14px 18px",
          background: kalaOk ? "#f0fdf4" : "#fff7ed",
          border: `1.5px solid ${kalaOk ? "#86efac" : "#fdba74"}`,
          display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
        }}>
          <div style={{ fontSize: 22 }}>{kalaOk ? "✅" : "⚠️"}</div>
          <div>
            <div style={{ fontSize: 11, color: "#625d45", marginBottom: 2 }}>
              วันเกิด: <strong>วัน{kalakineeMap[dayIdx as keyof typeof kalakineeMap]?.day}</strong>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: kalaOk ? "#166534" : "#9a3412" }}>
              {kalaOk ? "ไม่พบอักษรกาลกิณีในชื่อ" : "พบอักษรกาลกิณีในชื่อ"}
            </div>
            {!kalaOk && (
              <div style={{ fontSize: 12, color: "#9a3412", marginTop: 2 }}>
                {`ชื่อ: ${badInFirst.join(", ")}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: 11, color: "#98926c", marginTop: 8 }}>
        name.mhalong.com · ดูดวงชื่อ-นามสกุล วันนี้ดวงเป็นยังไง? มาเช็กกับมหาหลง
      </div>
    </div>
  );
}
