import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import paperBg from "./assets/middlepage.png";
import firstPageBg from "./assets/firstpage2.png";
import lastPageBg from "./assets/lastpage.png";
import "./DownloadStory.css";
import { HeyComicFont } from "./assets/fonts/heycomic-normal";

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


doc.addImage(firstPageBg, "PNG", 0, 0, pageWidth, pageHeight);

doc.setFont("HeyComic", "normal");
doc.setFontSize(28); // 🔥 increase size like UI
doc.setTextColor("#65503D");

const titleWidth = pageWidth * 0.4;

const wrappedTitle = doc.splitTextToSize(
  picturebook.title,
  titleWidth
);

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

      
      picturebook.pages.forEach((page) => {
        doc.addPage();
        doc.addImage(paperBg, "PNG", 0, 0, pageWidth, pageHeight);

        doc.setFont("HeyComic", "normal");
        doc.setFontSize(22);
        doc.setTextColor("#000000");

        const imgX = 55;
        const imgY = 63;
        const imgWidth = 300;
        const imgHeight = 320;
        const radius = 10;

        if (page.image) {
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

        const contentWidth = 200;
        const maxHeight = 300;   
        const textX = 380;
        let textY = 80;
        const lineSpacing = 28;


        const splitText = doc.splitTextToSize(
          page.text,
          contentWidth
        );
        splitText.forEach((line) => {
        if (textY > 80 + maxHeight) return;  
        doc.text(line, textX, textY);
        textY += lineSpacing;
        });

      });

      
      doc.addPage();
      doc.addImage(lastPageBg, "PNG", 0, 0, pageWidth, pageHeight);

      
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
