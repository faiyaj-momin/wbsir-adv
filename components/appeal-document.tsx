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
            
            color: "#111",
            boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
            border: "1px solid #e5e7eb",
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
                    textIndent: "2em",
                  }}
                >
                  {block.text}
                </p>
              );
            }
 
            if (block.type === "annexure-heading") {
              return (
                <div key={i} style={{ marginTop: "28px", marginBottom: "8px" }}>
                  <p
                    style={{
                      fontWeight: "700",
                      fontSize: "11pt",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      margin: 0,
                      borderBottom: "1.5px solid #333",
                      paddingBottom: "4px",
                      display: "inline-block",
                    }}
                  >
                    Annexure
                  </p>
                </div>
              );
            }
 
            if (block.type === "annexure-item") {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "4px",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ minWidth: "22px", fontWeight: "600", color: "#444" }}>{block.index}.</span>
                  <span>{block.text}</span>
                </div>
              );
            }
 
            if (block.type === "spacer") {
              return <div key={i} style={{ height: "36px" }} />;
            }
 
            if (block.type === "signature") {
              return (
                <p
                  key={i}
                  style={{
                    margin: "0 0 4px",
                    fontWeight: "600",
                    textAlign: "left",
                  }}
                >
                  {block.text}
                </p>
              );
            }
 
            return null;
          })}
 
          {/* Verification section */}
          <div
            style={{
              marginTop: "48px",
              borderTop: "1px solid #ccc",
              paddingTop: "20px",
            }}
          >
            <p style={{ fontWeight: "700", fontSize: "11pt", marginBottom: "8px" }}>VERIFICATION</p>
            <p style={{ textAlign: "justify", margin: "0 0 14px", textIndent: "2em" }}>
              I, {applicantName || "the applicant"}, do hereby declare that the information stated in this petition is true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "40px",
                alignItems: "flex-end",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: "10pt", color: "#666" }}>Place: {district || "__________"}</p>
                <p style={{ margin: "4px 0 0", fontSize: "10pt", color: "#666" }}>Date: {today}</p>
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
        </div>
      </div>
    </>
  );
}





export function AAppealDocument({ content, applicantName, district, caseType }: AppealDocumentProps) {
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

  return (
    <>
      {/* Print styles injected globally */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:wght@400;600;700&display=swap');

@media print {
  @page {
    size: A4;
    margin: 20mm 15mm;
  }

  html, body {
    height: auto;
    background: white;
  }

  /* REMOVE EVERYTHING */
  body * {
    display: none !important;
  }

  /* SHOW ONLY DOCUMENT */
  #appeal-print-area,
  #appeal-print-area * {
    display: block !important;
  }

  #appeal-print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .appeal-page {
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none;
    border: none;
  }

  p {
    page-break-inside: auto;
    orphans: 3;
    widows: 3;
  }

  .no-print {
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
      </div>

      {/* Document area */}
      <div id="appeal-print-area" ref={printRef}>
        <div
  className="appeal-page"
  style={{
    width: "100%",
    maxWidth: "210mm",
    margin: "0",
    padding: "0",
    fontFamily: "'EB Garamond', serif",
    fontSize: "13.5pt",
    lineHeight: "1.8",
    color: "#111"
  }}
        >
          <div style={{ padding: "20mm 15mm" }}>
          {/* Letterhead */}
          <div style={{ textAlign: "center", marginBottom: "32px", borderBottom: "2px double #333", paddingBottom: "16px" }}>
            <p style={{ fontSize: "10pt", letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", margin: 0 }}>
              West Bengal Special Intensive Revision 2026
            </p>
            <p style={{ fontSize: "9pt", color: "#888", margin: "4px 0 0" }}>
              Electoral Appeal Application &bull; Date: {today}
            </p>
          </div>

          {/* Rendered blocks */}
          {blocks.map((block, i) => {
            if (block.type === "court-header") {
              return (
                <p
                  key={i}
                  style={{
                    fontWeight: "700",
                    fontSize: "11.5pt",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginBottom: "6px",
                    marginTop: "0",
                  }}
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "subject") {
              return (
                <div
                  key={i}
                  style={{
                    margin: "12px 0 16px",
padding: "8px 12px",
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
                    textIndent: "2em",
                  }}
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "annexure-heading") {
              return (
                <div key={i} style={{ marginTop: "28px", marginBottom: "8px" }}>
                  <p
                    style={{
    margin: "0 0 12px",
    textAlign: "justify",
    textIndent: "1em",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    hyphens: "auto",
  }}
                  >
                    Annexure
                  </p>
                </div>
              );
            }

            if (block.type === "annexure-item") {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "4px",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ minWidth: "22px", fontWeight: "600", color: "#444" }}>{block.index}.</span>
                  <span>{block.text}</span>
                </div>
              );
            }

            if (block.type === "spacer") {
              return <div key={i} style={{ height: "36px" }} />;
            }

            if (block.type === "signature") {
              return (
                <p
                  key={i}
                  style={{
                    margin: "0 0 4px",
                    fontWeight: "600",
                    textAlign: "left",
                  }}
                >
                  {block.text}
                </p>
              );
            }

            return null;
          })}

          {/* Verification section */}
          <div
            style={{
              marginTop: "48px",
              borderTop: "1px solid #ccc",
              paddingTop: "20px",
            }}
          >
            <p style={{ fontWeight: "700", fontSize: "11pt", marginBottom: "8px" }}>VERIFICATION</p>
            <p style={{ textAlign: "justify", margin: "0 0 14px", textIndent: "2em" }}>
              I, {applicantName || "the applicant"}, do hereby declare that the information stated in this petition is true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "40px",
                alignItems: "flex-end",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: "10pt", color: "#666" }}>Place: {district || "__________"}</p>
                <p style={{ margin: "4px 0 0", fontSize: "10pt", color: "#666" }}>Date: {today}</p>
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
          </div>
          </div>
      </div>
    </>
  );
}
