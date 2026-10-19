/**
 * Converts attendee records into downloadable CSV file with Excel-compatible UTF-8 BOM
 */
export function exportAttendeesToCSV(attendees, eventTitle = "Event") {
  if (!attendees || attendees.length === 0) {
    alert("No attendee records available to export.");
    return false;
  }

  const headers = [
    "Ticket Code",
    "Full Name",
    "Email",
    "Phone",
    "Organization",
    "Job Title",
    "Category",
    "Status",
    "Registered At",
    "Checked In At",
    "Checked In By",
    "Badge Printed Count"
  ];

  const rows = attendees.map(att => [
    `"${(att.ticketCode || '').replace(/"/g, '""')}"`,
    `"${(att.name || '').replace(/"/g, '""')}"`,
    `"${(att.email || '').replace(/"/g, '""')}"`,
    `"${(att.phone || '').replace(/"/g, '""')}"`,
    `"${(att.organization || '').replace(/"/g, '""')}"`,
    `"${(att.jobTitle || '').replace(/"/g, '""')}"`,
    `"${(att.category || '').replace(/"/g, '""')}"`,
    `"${(att.status || '').replace(/"/g, '""')}"`,
    `"${(att.registeredAt || '').replace(/"/g, '""')}"`,
    `"${(att.checkedInAt || 'N/A').replace(/"/g, '""')}"`,
    `"${(att.checkedInBy || 'N/A').replace(/"/g, '""')}"`,
    att.badgePrintedCount || 0
  ]);

  // \uFEFF ensures Microsoft Excel and Google Sheets open CSVs with full UTF-8 formatting
  const csvString = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\r\n");
  const filename = `${eventTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}_attendees_${new Date().toISOString().slice(0, 10)}.csv`;

  try {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
      return true;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 500);

    return true;
  } catch (err) {
    console.error("Blob download failed, falling back to data URI", err);
    // Data URI fallback
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvString);
    const fallbackLink = document.createElement("a");
    fallbackLink.setAttribute("href", encodedUri);
    fallbackLink.setAttribute("download", filename);
    fallbackLink.style.display = "none";
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
    return true;
  }
}
