/**
 * Production-safe isolated print engine.
 * Clones ALL live stylesheets from the running Vite build (dev or dist/assets/index-*.css)
 * into a clean hidden iframe so Tailwind utilities and custom styles always load.
 *
 * Supports exact 3.1-inch wide centered badge / thermal tag printing with customizable length!
 */

function collectActiveHeadStyles() {
  const parts = [];
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const absHref = new URL(href, window.location.origin).href;
      parts.push(`<link rel="stylesheet" href="${absHref}">`);
    }
  });
  document.querySelectorAll('style').forEach((style) => {
    parts.push(`<style>${style.innerHTML}</style>`);
  });
  return parts.join('\n');
}

/**
 * @param {string} elementId - DOM ID of the element to print
 * @param {string} title - Document title in print spooler
 * @param {object} options
 * @param {'badge' | 'certificate' | 'document'} [options.mode='document']
 * @param {number} [options.widthIn=3.1] - Exact width in inches for badge tags (default 3.1in)
 * @param {number | 'auto'} [options.heightIn='auto'] - Height in inches or 'auto' for continuous roll
 * @param {'thermal' | 'sheet'} [options.paperMode='thermal'] - 'thermal' sets exact @page 3.1in x height; 'sheet' centers 3.1in tag on A4/Letter
 */
export function printElementCleanly(elementId, title = "Print Document", options = {}) {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    window.print();
    return;
  }

  const {
    mode = elementId === 'printable-badge' ? 'badge' : elementId === 'printable-certificate' ? 'certificate' : 'document',
    widthIn = 3.1,
    heightIn = 'auto',
    paperMode = 'thermal',
  } = options;

  let iframe = document.getElementById('app-isolated-print-iframe');
  if (iframe) {
    iframe.remove();
  }
  iframe = document.createElement('iframe');
  iframe.id = 'app-isolated-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '1px';
  iframe.style.height = '1px';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const liveStyles = collectActiveHeadStyles();

  // Compute exact @page rule & element sizing
  const numericHeight = typeof heightIn === 'number' && heightIn > 0 ? heightIn : null;
  let pageRule = `@page { size: auto; margin: 8mm; }`;
  let elementCss = '';

  if (mode === 'badge') {
    if (paperMode === 'thermal') {
      // Exact 3.1in wide tag stock (80mm thermal / lanyard tag stock)
      const pageSize = numericHeight ? `${widthIn}in ${numericHeight}in` : `${widthIn}in auto`;
      pageRule = `@page { size: ${pageSize}; margin: 0; }`;
    } else {
      // Centered 3.1in wide tag on standard A4 / Letter sheet
      pageRule = `@page { size: auto; margin: 8mm; }`;
    }

    elementCss = `
      html, body {
        width: 100% !important;
        min-height: 100% !important;
        margin: 0 !important;
        padding: ${paperMode === 'sheet' ? '10mm 0' : '0'} !important;
        background: #ffffff !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: ${paperMode === 'sheet' ? 'flex-start' : 'center'} !important;
      }
      #${elementId} {
        position: static !important;
        transform: none !important;
        width: ${widthIn}in !important;
        min-width: ${widthIn}in !important;
        max-width: ${widthIn}in !important;
        ${numericHeight ? `height: ${numericHeight}in !important; min-height: ${numericHeight}in !important; max-height: ${numericHeight}in !important;` : 'height: auto !important; min-height: 0 !important;'}
        margin: 0 auto !important;
        box-shadow: none !important;
        border-radius: ${paperMode === 'thermal' ? '10px' : '16px'} !important;
        overflow: hidden !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    `;
  } else if (mode === 'certificate') {
    pageRule = `@page { size: landscape; margin: 10mm; }`;
    elementCss = `
      html, body {
        width: 100% !important;
        margin: 0 !important;
        padding: 12px !important;
        background: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      #${elementId} {
        position: static !important;
        transform: none !important;
        margin: 0 auto !important;
        width: 100% !important;
        max-width: 9.5in !important;
        box-shadow: none !important;
        page-break-inside: avoid !important;
      }
    `;
  } else {
    elementCss = `
      html, body {
        width: 100% !important;
        margin: 0 !important;
        padding: 16px !important;
        background: #ffffff !important;
        display: flex !important;
        align-items: flex-start !important;
        justify-content: center !important;
      }
      #${elementId} {
        position: static !important;
        transform: none !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        page-break-inside: avoid !important;
      }
    `;
  }

  // Clone element HTML and ensure all relative image URLs resolve to absolute URLs
  const cloned = sourceEl.cloneNode(true);
  cloned.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('data:') && !src.startsWith('http')) {
      img.setAttribute('src', new URL(src, window.location.origin).href);
    }
  });

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en" data-theme="light">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        ${liveStyles}
        <style>
          ${pageRule}
          * {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body, body * {
            visibility: visible !important;
          }
          body {
            font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
          ${elementCss}
          img {
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        ${cloned.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Wait for stylesheets and images to finish loading before printing
  const triggerPrint = () => {
    const imgs = Array.from(iframe.contentWindow.document.images || []);
    const pending = imgs.filter((img) => !img.complete);
    if (pending.length === 0) {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          console.warn("Iframe print fallback to window.print", e);
          window.print();
        }
      }, 250);
    } else {
      let resolved = 0;
      const done = () => {
        resolved += 1;
        if (resolved >= pending.length) {
          setTimeout(() => {
            try {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
            } catch (e) {
              window.print();
            }
          }, 200);
        }
      };
      pending.forEach((img) => {
        img.onload = done;
        img.onerror = done;
      });
      // Safety fallback timeout
      setTimeout(() => {
        if (resolved < pending.length) {
          resolved = pending.length;
          try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          } catch (e) {
            window.print();
          }
        }
      }, 1800);
    }
  };

  setTimeout(triggerPrint, 300);
}
