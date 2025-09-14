import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import paperBg from "./assets/middlepage1.png";
import firstPageBg from "./assets/firstpage1.png";
import lastPageBg from "./assets/lastpage1.png";
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
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // ---------- FIRST PAGE ----------
      doc.addImage(firstPageBg, "PNG", 0, 0, pageWidth, pageHeight);
      doc.setFont("HeyComic", "normal");
      doc.setFontSize(13);
      doc.setTextColor("#65503D"); // custom color for title

      const marginSide = 60; // left/right margins
      const usableWidth = pageWidth - marginSide * 2;
      const marginTop = 345; // push down from top

      // Wrap long title text
      const wrappedTitle = doc.splitTextToSize(title, usableWidth);
      wrappedTitle.forEach((line, i) => {
        doc.text(line, pageWidth / 2, marginTop + i * 36, { align: "center" });
      });

      // ---------- STORY PAGES ----------
      const marginTopStory = 100;
      const marginBottomStory = 120;
      const marginLeftStory = 60;
      const marginRightStory = 150;
      const lineHeight = 30;

      const usableStoryWidth = pageWidth - marginLeftStory - marginRightStory;
      const splitText = doc.splitTextToSize(story, usableStoryWidth);

      let y = marginTopStory;

      doc.addPage();
      doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);
      doc.setFont("HeyComic", "normal");
      doc.setFontSize(18);
      doc.setTextColor("#000000"); // black story text

      splitText.forEach((line) => {
        if (y > pageHeight - marginBottomStory) {
          doc.addPage();
          doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);
          y = marginTopStory; // reset y to top margin
        }
        doc.text(line, marginLeftStory, y);
        y += lineHeight;
      });

      // ---------- LAST PAGE ----------
      doc.addPage();
      doc.addImage(lastPageBg, "PNG", 0, 0, pageWidth, pageHeight);


      // ---------- PREVIEW ----------
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
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
            width="300px"
            height="450px"
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
