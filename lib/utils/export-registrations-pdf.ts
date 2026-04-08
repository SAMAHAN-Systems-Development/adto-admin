import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Registration } from "@/lib/types/entities";

interface ExportRegistrantsToPdfOptions {
  eventId: string;
  eventName: string;
  registrations: Registration[];
}

const TABLE_HEADERS = [
  "Full Name",
  "Email",
  "Organization Group",
  "Organization",
  "Cluster",
  "Year Level",
  "Course",
  "Ticket",
  "Attended",
] as const;

// Total width is capped to fit inside 0.5in margins on A4 landscape.
const TABLE_COLUMN_WIDTHS = [42, 50, 38, 34, 16, 16, 32, 28, 15] as const;
const TABLE_FONT_SIZE = 7;
const TABLE_CELL_PADDING = 1.5;
const PAGE_MARGIN_MM = 12.7;
const BRAND_COLORS = {
  slate900: [15, 23, 42] as const,
  slate700: [51, 65, 85] as const,
  slate500: [100, 116, 139] as const,
  slate300: [203, 213, 225] as const,
  slate50: [248, 250, 252] as const,
  blue600: [37, 99, 235] as const,
  blue800: [30, 64, 175] as const,
};

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

const measureTextWidth = (doc: jsPDF, text: string, fontSize: number) => {
  return (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
};

const splitLongWordWithContinuation = (
  doc: jsPDF,
  word: string,
  maxWidthMm: number,
  fontSize: number,
) => {
  const segments: string[] = [];
  let remaining = word;

  while (remaining.length > 0) {
    let segmentLength = 0;

    for (let i = 1; i <= remaining.length; i += 1) {
      const candidate = remaining.slice(0, i);
      const hasMore = i < remaining.length;
      const candidateWithContinuation = hasMore ? `${candidate}...` : candidate;
      const candidateWidth = measureTextWidth(
        doc,
        candidateWithContinuation,
        fontSize,
      );

      if (candidateWidth <= maxWidthMm) {
        segmentLength = i;
      } else {
        break;
      }
    }

    if (segmentLength === 0) {
      segmentLength = 1;
    }

    const segment = remaining.slice(0, segmentLength);
    remaining = remaining.slice(segmentLength);
    segments.push(remaining.length > 0 ? `${segment}...` : segment);
  }

  return segments;
};

const wrapCellTextWithContinuation = (
  doc: jsPDF,
  value: string,
  columnWidthMm: number,
  fontSize: number,
) => {
  const normalized = value.trim();

  if (!normalized) {
    return "-";
  }

  const maxContentWidth = Math.max(
    1,
    columnWidthMm - TABLE_CELL_PADDING * 2,
  );
  const words = normalized.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  const flushCurrentLine = () => {
    if (currentLine) {
      lines.push(currentLine);
      currentLine = "";
    }
  };

  for (const word of words) {
    if (!word) {
      continue;
    }

    if (!currentLine) {
      if (measureTextWidth(doc, word, fontSize) <= maxContentWidth) {
        currentLine = word;
      } else {
        const segments = splitLongWordWithContinuation(
          doc,
          word,
          maxContentWidth,
          fontSize,
        );

        if (segments.length > 1) {
          lines.push(...segments.slice(0, -1));
          currentLine = segments[segments.length - 1] ?? "";
        } else {
          currentLine = segments[0] ?? "";
        }
      }

      continue;
    }

    const candidate = `${currentLine} ${word}`;
    if (measureTextWidth(doc, candidate, fontSize) <= maxContentWidth) {
      currentLine = candidate;
      continue;
    }

    flushCurrentLine();

    if (measureTextWidth(doc, word, fontSize) <= maxContentWidth) {
      currentLine = word;
    } else {
      const segments = splitLongWordWithContinuation(
        doc,
        word,
        maxContentWidth,
        fontSize,
      );

      if (segments.length > 1) {
        lines.push(...segments.slice(0, -1));
        currentLine = segments[segments.length - 1] ?? "";
      } else {
        currentLine = segments[0] ?? "";
      }
    }
  }

  flushCurrentLine();

  return lines.length > 0 ? lines.join("\n") : "-";
};

const wrapInlineText = (
  doc: jsPDF,
  value: string,
  maxWidthMm: number,
  fontSize: number,
) => {
  const normalized = value.trim();
  if (!normalized) {
    return ["-"];
  }

  const words = normalized.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  const flush = () => {
    if (currentLine) {
      lines.push(currentLine);
      currentLine = "";
    }
  };

  for (const word of words) {
    if (!currentLine) {
      if (measureTextWidth(doc, word, fontSize) <= maxWidthMm) {
        currentLine = word;
      } else {
        const chunks = splitLongWordWithContinuation(doc, word, maxWidthMm, fontSize);
        if (chunks.length > 1) {
          lines.push(...chunks.slice(0, -1));
          currentLine = chunks[chunks.length - 1] ?? "";
        } else {
          currentLine = chunks[0] ?? "";
        }
      }
      continue;
    }

    const candidate = `${currentLine} ${word}`;
    if (measureTextWidth(doc, candidate, fontSize) <= maxWidthMm) {
      currentLine = candidate;
      continue;
    }

    flush();
    if (measureTextWidth(doc, word, fontSize) <= maxWidthMm) {
      currentLine = word;
    } else {
      const chunks = splitLongWordWithContinuation(doc, word, maxWidthMm, fontSize);
      if (chunks.length > 1) {
        lines.push(...chunks.slice(0, -1));
        currentLine = chunks[chunks.length - 1] ?? "";
      } else {
        currentLine = chunks[0] ?? "";
      }
    }
  }

  flush();
  return lines.length > 0 ? lines : ["-"];
};

export const exportRegistrantsToPdf = ({
  eventId,
  eventName,
  registrations,
}: ExportRegistrantsToPdfOptions) => {
  const marginMm = PAGE_MARGIN_MM;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - marginMm * 2;
  const totalTableWidth = TABLE_COLUMN_WIDTHS.reduce((sum, width) => sum + width, 0);
  const safeScale = Math.min(1, contentWidth / totalTableWidth);
  const scaledColumnWidths = TABLE_COLUMN_WIDTHS.map((width) =>
    Number((width * safeScale).toFixed(2)),
  );
  const effectiveTableWidth = scaledColumnWidths.reduce((sum, width) => sum + width, 0);

  const headerBoxY = marginMm;
  const eventNamePrefix = "Event: ";
  const eventNameLineWidth = contentWidth - 8;
  const eventNameLines = wrapInlineText(
    doc,
    `${eventNamePrefix}${eventName}`,
    eventNameLineWidth,
    10,
  );
  const eventReference = registrations[0]?.ticketCategory?.event;
  const eventOrganizationName = eventReference?.org?.name?.trim() || "-";
  const eventDateStart = eventReference?.dateStart
    ? new Date(eventReference.dateStart)
    : null;
  const eventDateEnd = eventReference?.dateEnd
    ? new Date(eventReference.dateEnd)
    : null;
  const eventDateLabel = eventDateStart
    ? eventDateEnd && eventDateEnd.getTime() !== eventDateStart.getTime()
      ? `${eventDateStart.toLocaleString()} - ${eventDateEnd.toLocaleString()}`
      : eventDateStart.toLocaleString()
    : "-";
  const maxEventLines = 3;
  const eventLinesToRender = eventNameLines.slice(0, maxEventLines);
  const eventLineHeight = 4.2;
  const headerBoxHeight = Math.max(24, 19 + eventLinesToRender.length * eventLineHeight);

  doc.setFillColor(...BRAND_COLORS.slate50);
  doc.setDrawColor(...BRAND_COLORS.slate300);
  doc.roundedRect(marginMm, headerBoxY, contentWidth, headerBoxHeight, 2, 2, "FD");

  doc.setFillColor(...BRAND_COLORS.blue600);
  doc.rect(marginMm, headerBoxY, contentWidth, 2.4, "F");

  doc.setTextColor(...BRAND_COLORS.slate900);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Event Registrants", marginMm + 4, headerBoxY + 8.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  eventLinesToRender.forEach((line, index) => {
    doc.text(line, marginMm + 4, headerBoxY + 14 + index * eventLineHeight);
  });

  doc.setTextColor(...BRAND_COLORS.slate700);
  doc.setFontSize(9);
  const metaY = headerBoxY + headerBoxHeight - 5;
  doc.text(`Organization: ${eventOrganizationName}`, marginMm + 4, metaY);
  doc.text(`Event Date & Time: ${eventDateLabel}`, marginMm + contentWidth / 2, metaY);
  doc.text(
    `Total Registrants: ${registrations.length}`,
    marginMm + contentWidth - 4,
    metaY,
    { align: "right" },
  );

  const tableStartY = headerBoxY + headerBoxHeight + 4;

  doc.setFontSize(TABLE_FONT_SIZE);

  const wrappedHeaderRow = TABLE_HEADERS.map((header, index) =>
    wrapCellTextWithContinuation(
      doc,
      header,
      scaledColumnWidths[index] ?? 30,
      TABLE_FONT_SIZE,
    ),
  );

  const tableRows = registrations.map((registration) => {
    const row = [
      registration.fullName || "-",
      registration.email || "-",
      registration.organizationParent?.name || "-",
      registration.organizationChild?.name || "-",
      registration.cluster || "-",
      formatYearLevel(registration.yearLevel),
      registration.course || "-",
      registration.ticketCategory?.name || "-",
      registration.isAttended ? "Yes" : "No",
    ];

    return row.map((cellValue, index) =>
      wrapCellTextWithContinuation(
        doc,
        cellValue,
        scaledColumnWidths[index] ?? 30,
        TABLE_FONT_SIZE,
      ),
    );
  });

  autoTable(doc, {
    startY: tableStartY,
    head: [wrappedHeaderRow],
    body: tableRows,
    theme: "grid",
    styles: {
      fontSize: TABLE_FONT_SIZE,
      cellPadding: TABLE_CELL_PADDING,
      valign: "middle",
      overflow: "linebreak",
      textColor: [30, 41, 59],
      lineColor: [...BRAND_COLORS.slate300],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [...BRAND_COLORS.blue600],
      textColor: 255,
      fontStyle: "bold",
      minCellHeight: 8,
      halign: "left",
      lineColor: [...BRAND_COLORS.blue800],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [...BRAND_COLORS.slate50],
    },
    margin: {
      top: marginMm,
      left: marginMm,
      right: marginMm,
      bottom: marginMm,
    },
    tableWidth: effectiveTableWidth,
    columnStyles: {
      0: { cellWidth: scaledColumnWidths[0] },
      1: { cellWidth: scaledColumnWidths[1] },
      2: { cellWidth: scaledColumnWidths[2] },
      3: { cellWidth: scaledColumnWidths[3] },
      4: { cellWidth: scaledColumnWidths[4] },
      5: { cellWidth: scaledColumnWidths[5] },
      6: { cellWidth: scaledColumnWidths[6] },
      7: { cellWidth: scaledColumnWidths[7] },
      8: { cellWidth: scaledColumnWidths[8], halign: "center" },
    },
    didDrawPage: () => {
      const pageHeight = doc.internal.pageSize.getHeight();
      const footerY = pageHeight - marginMm - 1;

      doc.setTextColor(...BRAND_COLORS.slate500);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        `Generated by ADTO Admin`,
        marginMm,
        footerY,
      );
      doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth - marginMm, footerY, {
        align: "right",
      });
    },
  });

  const safeName = sanitizeFileName(eventName) || sanitizeFileName(eventId) || "event";
  doc.save(`${safeName}-registrants-${getDateStamp()}.pdf`);
};
