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
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const generatedAt = new Date().toLocaleString();

  doc.setFontSize(14);
  doc.text(`Registrants - ${eventName}`, 14, 14);

  doc.setFontSize(10);
  doc.text(`Event ID: ${eventId}`, 14, 20);
  doc.text(`Generated: ${generatedAt}`, 14, 25);
  doc.text(`Total Registrants: ${registrations.length}`, 14, 30);

  const tableRows = registrations.map((registration) => [
    registration.fullName || "-",
    registration.email || "-",
    registration.cluster || "-",
    formatYearLevel(registration.yearLevel),
    registration.course || "-",
    registration.ticketCategory?.name || "-",
    registration.isAttended ? "Yes" : "No",
  ]);

  autoTable(doc, {
    startY: 36,
    head: [["Full Name", "Email", "Cluster", "Year Level", "Course", "Ticket", "Attended"]],
    body: tableRows,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: "middle",
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },
    margin: {
      left: 10,
      right: 10,
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 58 },
      2: { cellWidth: 28 },
      3: { cellWidth: 24 },
      4: { cellWidth: 44 },
      5: { cellWidth: 34 },
      6: { cellWidth: 20, halign: "center" },
    },
  });

  const safeName = sanitizeFileName(eventName) || sanitizeFileName(eventId) || "event";
  doc.save(`${safeName}-registrants-${getDateStamp()}.pdf`);
};
