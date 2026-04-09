"use client";

import React, { useRef } from "react";

interface AppealDocumentProps {
  content: string;
  applicantName?: string;
  district?: string;
  caseType?: string;
}

/**
 * Parses the raw template string into structured blocks for styled rendering.
 */
/**
 * Parses the raw template string into structured blocks for styled rendering.
 */
function parseAppealContent(raw: string) {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
 
  type Block =
    | { type: "court-header"; text: string }
    | { type: "subject"; text: string }
    | { type: "paragraph"; text: string }
    | { type: "annexure-heading" }
    | { type: "annexure-item"; index: number; text: string }
    | { type: "signature"; text: string }
    | { type: "spacer" };
 
  const blocks: Block[] = [];
  let inAnnexure = false;
  let annexureIndex = 0;
 
  for (const line of lines) {
    // Court header line
    if (line.startsWith("BEFORE THE")) {
      blocks.push({ type: "court-header", text: line });
      inAnnexure = false;
      continue;
    }
 
    // Subject line
    if (line.startsWith("Sub:-") || line.startsWith("Sub:") || line.startsWith("[Sub:-") || line.startsWith("[Sub:")) {
      const cleaned = line.replace(/^\[/, "").replace(/\]$/, "");
      blocks.push({ type: "subject", text: cleaned });
      inAnnexure = false;
      continue;
    }
 
    // Annexure heading
    if (line.toLowerCase() === "annexure:" || line.toLowerCase() === "annexure") {
      blocks.push({ type: "annexure-heading" });
      inAnnexure = true;
      annexureIndex = 0;
      continue;
    }
 
    // Numbered annexure item
    if (inAnnexure && /^\d+\./.test(line)) {
      annexureIndex++;
      const text = line.replace(/^\d+\.\s*/, "");
      blocks.push({ type: "annexure-item", index: annexureIndex, text });
      continue;
    }
 
    // Placeholder annexure
    if (inAnnexure && line === "[Same as above]") {
      blocks.push({ type: "paragraph", text: "(Annexure documents as listed above)" });
      inAnnexure = false;
      continue;
    }
 
    // Signature / submitted by
    if (
      line.toLowerCase().startsWith("submitted by") ||
      line.toLowerCase().startsWith("yours faithfully") ||
      line.toLowerCase().startsWith("yours sincerely")
    ) {
      blocks.push({ type: "spacer" });
      blocks.push({ type: "signature", text: line });
      continue;
    }
 
    // If line after "Submitted by" — treat as name in signature block
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock?.type === "signature" && !line.toLowerCase().startsWith("submitted by")) {
      blocks.push({ type: "signature", text: line });
      continue;
    }
 
    // Default paragraph
    blocks.push({ type: "paragraph", text: line });
  }
 
  return blocks;
}

export function AppealDocument({ content, applicantName, district, caseType }: AppealDocumentProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const blocks = parseAppealContent(content);
 
  const handlePrint = () => {
    window.print();
  };
 
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
 
  const annexureItems = ["Aadhaar Card", "Voter ID Card ", "PAN Card", "Ration Card", "BLO Enumeration Form","Hearing Notice", "2002 SIR Voter List"]

  return (
    <>
      {/* Print styles injected globally */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:wght@400;600;700&display=swap');
 
        @media print {
          body * { visibility: hidden !important; }
          #appeal-print-area,
          #appeal-print-area * { visibility: visible !important; }
          #appeal-print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            
            background: white !important;
          }
          .no-print { display: none !important; }
          .appeal-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 16pt !important;
          }
          .appeal-page p { font-size: 16pt !important; }
          .appeal-page div { font-size: 16pt !important; }
          .appeal-page span { font-size: 16pt !important; }
          .watermark {
            display: none !important;
          }
        }
      `}</style>
 
      {/* Action bar */}
      <div className="no-print flex items-center justify-between mb-6 px-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Appeal Application Preview</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {caseType?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} &mdash; {district || "District"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Download / Print PDF
          </button>
          <p className="text-xs text-gray-400 italic">
            Powered by MD Faiyaj Momin
          </p>
        </div>
      </div>
 
      {/* Document area */}
      <div id="appeal-print-area" ref={printRef}>
        <div
          className="appeal-page bg-white mx-auto"
          style={{
            maxWidth: "794px",
            minHeight: "1123px",
            padding: "48px 64px",
            fontFamily: "'EB Garamond', 'Times New Roman', Georgia, serif",
            fontSize: "13.5pt",
            lineHeight: "1.8",
            color: "#111",
            boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
            border: "1px solid #e5e7eb",
            position: "relative",
          }}
        >
          {/* Letterhead */}
          
 
          {/* Rendered blocks */}
          {blocks.map((block, i) => {
            if (block.type === "court-header") {
              return (
                <div key={i} style={{ textAlign: "center", marginBottom: "32px", borderBottom: "2px double #333", paddingBottom: "16px" }}>
            <p style={{ fontSize: "10pt", letterSpacing: "0.12em", textTransform: "uppercase", color: "black", fontWeight: "bold", margin: 0 }}>
              {block.text}
            </p>
            <p style={{ fontSize: "9pt", color: "#888", margin: "4px 0 0" }}>
              Electoral Appeal Application &bull; Date: {today}
            </p>
          </div>
              );
            }
 
            if (block.type === "subject") {
              return (
                <div
                  key={i}
                  style={{
                    margin: "20px 0 24px",
                    padding: "10px 16px",
                    borderLeft: "4px solid #111",
                    background: "#f9f9f9",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "12.5pt" }}>{block.text}</p>
                </div>
              );
            }
 
            if (block.type === "paragraph") {
              return (
                <p
                  key={i}
                  style={{
                    margin: "0 0 14px",
                    textAlign: "justify",
                    lineHeight: "1",
                  }}
                >
                  {block.text}
                </p>
              );
            }

            return null;
          })}
 
          {/* Annexure section */}
          <div style={{lineHeight: 0.8}}>
            <div style={{ marginTop: "28px", marginBottom: "8px" }}>
                  <p
                    style={{
                      fontWeight: "600",
                      fontSize: "12pt",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      margin: 0,
                      borderBottom: "1.5px solid #333",
                      paddingBottom: "2px",
                      display: "inline-block",
                    }}
                  >
                    Annexure
                  </p>
            </div>
            {annexureItems.map((item, i) => (
<div key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "4px",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ minWidth: "22px", fontWeight: "600", color: "#444" }}>{i+1}.</span>
                  <span>{item}</span>
                </div>
            ))}
          </div>
          {/* Verification section */}
          <div
            style={{
              marginTop: "48px",
              borderTop: "1px solid #ccc",
              paddingTop: "20px",
              lineHeight: 1.
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "40px",
                alignItems: "flex-end",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ margin: 0, fontSize: "10pt", color: "#666", marginBottom: "8px" }}>Place: ____________</p>
                <p style={{ margin: "4px 0 0", fontSize: "10pt", color: "#666" }}>Date: ___/___/______</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "160px", borderBottom: "1.5px solid #333", marginBottom: "6px" }} />
                <p style={{ margin: 0, fontSize: "10pt" }}>Signature of Applicant</p>
                {applicantName && (
                  <p style={{ margin: "2px 0 0", fontSize: "10pt", fontWeight: "600" }}>{applicantName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Promotional Watermark */}
          <div className="watermark w-100" style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            background: "var(--primary-color, #111) linear-gradient(135deg, rgba(255,255,255,0.15) 25%, transparent 25%) -10px 0/ 20px 20px",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            border: "2px solid rgba(255,255,255,0.2)"
          }}>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", textTransform: "uppercase" }}>
              🚀 Developed by MD FAIYAJ MOMIN
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
