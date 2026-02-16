import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import paperBg from "./assets/middlepage.png";
import firstPageBg from "./assets/firstpage.png";
import lastPageBg from "./assets/lastpage.png";
import "./DownloadStory.css";
import { HeyComicFont } from "./assets/fonts/heycomic-normal";

// Register custom font
jsPDF.API.events.push([
  "addFonts",
  function () {
    this.addFileToVFS("HeyComic.ttf", HeyComicFont);
    this.addFont("HeyComic.ttf", "HeyComic", "normal");
  },
]);

const DownloadStory = () => {
  const location = useLocation();
  const { title = "My Story", story = "" } = location.state || {};
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const generatePDF = () => {

      // ✅ FIXED LANDSCAPE SPELLING
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // ---------- FIRST PAGE ----------
      doc.addImage(firstPageBg, "PNG", 0, 0, pageWidth, pageHeight);
      doc.setFont("HeyComic", "normal");
      doc.setFontSize(13);
      doc.setTextColor("#65503D");

      // 🔥 CHANGE THIS VALUE ONLY TO MOVE TITLE UP/DOWN
      const marginTop = 260;

      const titleWidth = 350;
      const wrappedTitle = doc.splitTextToSize(title, titleWidth);

      wrappedTitle.forEach((line, i) => {
        doc.text(
          line,
          pageWidth / 2,                // ✅ perfectly centered horizontally
          marginTop + i * 36,           // ✅ vertical control
          { align: "center" }           // ✅ correct alignment
        );
      });

      // ---------- STORY PAGES ----------
      const marginTopStory = 80;
      const marginBottomStory = 100;
      const lineHeight = 35;

      const contentWidth = 230;
      const marginLeftStory = 50;
      const usableStoryWidth = contentWidth;

      const splitText = doc.splitTextToSize(story, usableStoryWidth);

      let y = marginTopStory;

      doc.addPage();
      doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);
      doc.setFont("HeyComic", "normal");
      doc.setFontSize(30);
      doc.setTextColor("#000000");

      splitText.forEach((line) => {
        if (y > pageHeight - marginBottomStory) {
          doc.addPage();
          doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);
          y = marginTopStory;
        }
        doc.text(line, marginLeftStory, y);
        y += lineHeight;
      });

      // ---------- LAST PAGE ----------
      doc.addPage();
      doc.addImage(lastPageBg, "PNG", 0, 0, pageWidth, pageHeight);

      // ---------- PREVIEW ----------
      const pdfBlob = doc.output("blob");
      const pdfPreviewUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfPreviewUrl);
    };

    generatePDF();
  }, [title, story]);

  return (
    <div className="download-container">
      <h2>📖 Preview Your Story</h2>
      {pdfUrl && (
        <>
          <iframe
            src={pdfUrl}
            width="900px"     // landscape preview size
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
