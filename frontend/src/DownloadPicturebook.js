import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import paperBg from "./assets/middlepage.png";
import firstPageBg from "./assets/firstpage2.png";
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

const DownloadPicturebook = () => {
  const location = useLocation();
  const picturebook =
    location.state?.picturebook ||
    JSON.parse(localStorage.getItem("picturebookStory"));

  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const generatePDF = () => {
      if (!picturebook) return;

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

// =============================
// 📘 COVER PAGE
// =============================
doc.addImage(firstPageBg, "PNG", 0, 0, pageWidth, pageHeight);

doc.setFont("HeyComic", "normal");
doc.setFontSize(28); // 🔥 increase size like UI
doc.setTextColor("#65503D");

// 🎯 Control width like CSS max-width: 40%
const titleWidth = pageWidth * 0.4;

// 🎯 Split text automatically
const wrappedTitle = doc.splitTextToSize(
  picturebook.title,
  titleWidth
);

// 🎯 Center vertically (better alignment)
const startY = 200;
const lineHeight = 32;

wrappedTitle.forEach((line, i) => {
  doc.text(
    line,
    pageWidth / 2,
    startY + i * lineHeight,
    { align: "center" }
  );
});

      // =============================
      // 📖 STORY PAGES
      // =============================
      picturebook.pages.forEach((page) => {
        doc.addPage();
        doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);

        doc.setFont("HeyComic", "normal");
        doc.setFontSize(22);
        doc.setTextColor("#000000");

        // ===== IMAGE (match UI) =====
        const imgX = 55;
        const imgY = 63;
        const imgWidth = 300;
        const imgHeight = 320;
        const radius = 10;

        if (page.image) {
          // Yellow border
          doc.setDrawColor(255, 222, 89); // #ffde59
          doc.setLineWidth(10);
          doc.roundedRect(
            imgX,
            imgY,
            imgWidth,
            imgHeight,
            radius,
            radius
          );

          // Clip for rounded image
          doc.saveGraphicsState();
          doc.roundedRect(
            imgX,
            imgY,
            imgWidth,
            imgHeight,
            radius,
            radius
          );
          doc.clip();
          doc.addImage(
            page.image,
            "PNG",
            imgX,
            imgY,
            imgWidth,
            imgHeight
          );
          doc.restoreGraphicsState();
        }

        // ===== TEXT (match CSS width 300px) =====
        const contentWidth = 200;
        const maxHeight = 300;   // 🔥 control text area height
        const textX = 380;
        let textY = 80;
        const lineSpacing = 28;


        const splitText = doc.splitTextToSize(
          page.text,
          contentWidth
        );
        splitText.forEach((line) => {
        if (textY > 80 + maxHeight) return;  // stop printing
        doc.text(line, textX, textY);
        textY += lineSpacing;
        });

      });

      // =============================
      // 🎉 LAST PAGE
      // =============================
      doc.addPage();
      doc.addImage(lastPageBg, "PNG", 0, 0, pageWidth, pageHeight);

      // =============================
      // PREVIEW
      // =============================
      const pdfBlob = doc.output("blob");
      const pdfPreviewUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfPreviewUrl);
    };

    generatePDF();
  }, [picturebook]);

  if (!picturebook) {
    return <div>No picturebook data found.</div>;
  }

  return (
    <div className="download-container">
      <h2>📖 Preview Your Picturebook</h2>

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
            title="Picturebook Preview"
          />
          <br />
          <a href={pdfUrl} download={`${picturebook.title}.pdf`}>
            <button className="download-btns">
              Download Picturebook 📥
            </button>
          </a>
        </>
      )}
    </div>
  );
};

export default DownloadPicturebook;
