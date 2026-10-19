/**
 * Prints an element cleanly by isolating it in a temporary print iframe.
 * Avoids modal backdrop dark mode bleeding, SPA overflow clipping, and multi-page spillover.
 */
export function printElementCleanly(elementId, title = "Print Document") {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    window.print();
    return;
  }

  let iframe = document.getElementById('app-isolated-print-iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'app-isolated-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page {
            size: auto;
            margin: 8mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            overflow: visible;
          }
          #${elementId} {
            margin: 0 auto !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
          /* Ensure images and QR render crisply */
          img {
            max-width: 100%;
            display: block;
          }
        </style>
        <!-- Copy main application stylesheets into print frame -->
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body style="background: #ffffff !important; padding: 20px 0;">
        ${sourceEl.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Allow images, SVGs, and fonts to render, then trigger print
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.warn("Iframe print fallback to window.print", e);
      window.print();
    }
  }, 350);
}
