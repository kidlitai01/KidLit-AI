import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import paperBg from "./assets/middlepage1.png"; // middle page background
import firstPageBg from "./assets/firstpage1.png"; // custom first page background
import lastPageBg from "./assets/lastpage1.png"; // custom last page background
import "./DownloadStory.css";

const DownloadStory = () => {
  const location = useLocation();
  const { title = "My Story", story = "" } = location.state || {};

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
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(title, pageWidth / 2, pageHeight / 2, { align: "center" });

      // ---------- STORY PAGES ----------
      const margin = 40;
      const lineHeight = 20;
      const textWidth = pageWidth - margin * 2;

      let y = margin;
      const splitText = doc.splitTextToSize(story, textWidth);

      // Add story on subsequent pages
      doc.addPage();
      doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);

      splitText.forEach((line) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);
          y = margin;
        }
        doc.setFontSize(14);
        doc.setFont("times", "normal");
        doc.text(line, margin, y);
        y += lineHeight;
      });

      // ---------- LAST PAGE ----------
      doc.addPage();
      doc.addImage(lastPageBg, "PNG", 0, 0, pageWidth, pageHeight);
      // No text here

      // ---------- SAVE ----------
      doc.save(`${title}.pdf`);
    };

    generatePDF();
  }, [title, story]);

  return (
    <div className="download-container">
      <h2>Your story is downloading...</h2>
    </div>
  );
};

export default DownloadStory;
