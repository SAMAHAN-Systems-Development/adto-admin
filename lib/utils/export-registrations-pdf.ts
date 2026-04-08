import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Registration } from "@/lib/types/entities";

interface ExportRegistrantsToPdfOptions {
  eventId: string;
  eventName: string;
  registrations: Registration[];
}

const sanitizeFileName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s-]/g, "")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-|-$/g, "");

const formatYearLevel = (yearLevel?: string) => {
  if (!yearLevel) {
    return "-";
  }

  switch (yearLevel) {
    case "1":
      return "1st Year";
    case "2":
      return "2nd Year";
    case "3":
      return "3rd Year";
    default:
      return `${yearLevel}th Year`;
  }
};

const getDateStamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const exportRegistrantsToPdf = ({
  eventId,
  eventName,
  registrations,
}: ExportRegistrantsToPdfOptions) => {
  const marginMm = 12.7;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const generatedAt = new Date().toLocaleString();

  doc.setFontSize(14);
  doc.text(`Registrants - ${eventName}`, marginMm, marginMm);

  doc.setFontSize(10);
  const metaStartY = marginMm + 7;
  const metaLineGap = 5;
  doc.text(`Event ID: ${eventId}`, marginMm, metaStartY);
  doc.text(`Generated: ${generatedAt}`, marginMm, metaStartY + metaLineGap);
  doc.text(
    `Total Registrants: ${registrations.length}`,
    marginMm,
    metaStartY + metaLineGap * 2,
  );

  const tableStartY = metaStartY + metaLineGap * 2 + 6;

  const tableRows = registrations.map((registration) => [
    registration.fullName || "-",
    registration.email || "-",
    registration.organizationParent?.name || "-",
    registration.organizationChild?.name || "-",
    registration.cluster || "-",
    formatYearLevel(registration.yearLevel),
    registration.course || "-",
    registration.ticketCategory?.name || "-",
    registration.isAttended ? "Yes" : "No",
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [[
      "Full Name",
      "Email",
      "Organization Group",
      "Organization",
      "Cluster",
      "Year Level",
      "Course",
      "Ticket",
      "Attended",
    ]],
    body: tableRows,
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      valign: "middle",
      overflow: "ellipsize",
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },
    margin: {
      top: marginMm,
      left: marginMm,
      right: marginMm,
      bottom: marginMm,
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 55 },
      2: { cellWidth: 38 },
      3: { cellWidth: 36 },
      4: { cellWidth: 18 },
      5: { cellWidth: 16 },
      6: { cellWidth: 38 },
      7: { cellWidth: 20 },
      8: { cellWidth: 10, halign: "center" },
    },
  });

  const safeName = sanitizeFileName(eventName) || sanitizeFileName(eventId) || "event";
  doc.save(`${safeName}-registrants-${getDateStamp()}.pdf`);
};
