import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import MobileHeader from "./MobileHeader";

import paperBg from "./assets/middlepage.png";
import firstPageBg from "./assets/firstpage2.png";
import lastPageBg from "./assets/lastpage.png";

import "./DownloadStory.css";
import { HeyComicFont } from "./assets/fonts/heycomic-normal";
import { JelleeFont } from "./assets/fonts/jellee-normal";

// ✅ REGISTER FONTS
jsPDF.API.events.push([
  "addFonts",
  function () {
    // HeyComic
    this.addFileToVFS("HeyComic.ttf", HeyComicFont);
    this.addFont("HeyComic.ttf", "HeyComic", "normal");

    // Jellee
    this.addFileToVFS("Jellee.ttf", JelleeFont);
    this.addFont("Jellee.ttf", "Jellee", "normal");
  },
]);

const DownloadStory = () => {
  const location = useLocation();
  const { title = "My Story", story = "" } = location.state || {};
  const [pdfUrl, setPdfUrl] = useState(null);

useEffect(() => {
  generatePDF();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [title, story]);

  // ---------- SHADOW FUNCTION ----------
  const drawTextWithShadow = (doc, text, x, y, options = {}) => {
    const shadowColor = [255, 251, 192];

    const offsets = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];

    // Shadow layers
    doc.setTextColor(...shadowColor);
    offsets.forEach(([dx, dy]) => {
      doc.text(text, x + dx, y + dy, options);
    });

    // Main text
    doc.setTextColor("#65503D");
    doc.text(text, x, y, options);
  };

  // ---------- MAIN PDF FUNCTION ----------
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ---------- FIRST PAGE ----------
    doc.addImage(firstPageBg, "PNG", 0, 0, pageWidth, pageHeight);

    doc.setFont("Jellee", "normal"); // ✅ FIXED
    doc.setFontSize(28);

    const titleWidth = 200;
    const lineHeight = 25;

    const wrappedTitle = doc.splitTextToSize(title, titleWidth);

    // Center vertically
    const totalHeight = wrappedTitle.length * lineHeight;
    let startY = (pageHeight / 2) - (totalHeight / 2);

    wrappedTitle.forEach((line, i) => {
      drawTextWithShadow(
        doc,
        line,
        pageWidth / 2,
        startY + i * lineHeight,
        { align: "center" }
      );
    });

    // ---------- STORY PAGES ----------
    const marginTop = 80;
    const marginBottom = 100;
    const lineHeightStory = 30;

    const contentWidth = 650;
    const marginLeft = 50;

    const splitText = doc.splitTextToSize(story, contentWidth);

    let y = marginTop;

    doc.addPage();
    doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);

    doc.setFont("HeyComic", "normal");
    doc.setFontSize(25);
    doc.setTextColor("#000000");

    splitText.forEach((line) => {
      if (y > pageHeight - marginBottom) {
        doc.addPage();
        doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);
        y = marginTop;
      }

      doc.text(line, marginLeft, y);
      y += lineHeightStory;
    });

    // ---------- LAST PAGE ----------
    doc.addPage();
    doc.addImage(lastPageBg, "PNG", 0, 0, pageWidth, pageHeight);

    // ---------- PREVIEW ----------
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  return (
    
    <div className="download-container">
      <MobileHeader />
      <h2>📖 Preview Your Story</h2>

      {pdfUrl && (
        <>
          <iframe
            src={pdfUrl}
            width="900px"
            height="600px"
            style={{
              border: "3px solid #ffb6c1",
              borderRadius: "16px",
              background: "#fff",
            }}
            title="Story Preview"
          />

          <br />

          <a href={pdfUrl} download={`${title}.pdf`}>
            <button className="download-btns">Download PDF</button>
          </a>
        </>
      )}
    </div>
  );
};

export default DownloadStory;