import React, { useState } from 'react';
import { FileText, Download, ExternalLink, X, Image as ImageIcon } from 'lucide-react';

export const ATTACHMENT_ACCEPT =
  'image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt';

export function formatFileSize(bytes = 0) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentList({ attachments = [], compact = false, onDark = false }) {
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [lightboxName, setLightboxName] = useState('');

  if (!Array.isArray(attachments) || attachments.length === 0) return null;

  return (
    <>
      <div className={`flex flex-col gap-2 ${compact ? 'mt-1.5' : 'mt-2'}`}>
        {attachments.map((att) => {
          const isImg = Boolean(att.isImage) || /^image\//i.test(att.type || '');
          if (isImg) {
            return (
              <div
                key={att.id || att.url}
                className="rounded-xl overflow-hidden border inline-block max-w-full"
                style={{
                  borderColor: onDark ? 'rgba(255,255,255,0.25)' : 'var(--border-color)',
                  background: onDark ? 'rgba(0,0,0,0.18)' : 'var(--bg-main)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLightboxUrl(att.url);
                    setLightboxName(att.name || 'Image');
                  }}
                  className="block p-0 border-0 bg-transparent cursor-pointer w-full text-left"
                  title="Click to enlarge"
                >
                  <img
                    src={att.url}
                    alt={att.name || 'Attachment'}
                    loading="lazy"
                    className={`${compact ? 'max-h-28' : 'max-h-56'} w-auto max-w-full object-cover block`}
                  />
                </button>
                <div
                  className="px-2.5 py-1.5 flex items-center justify-between gap-2 text-[11px]"
                  style={{ color: onDark ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}
                >
                  <span className="inline-flex items-center gap-1 min-w-0 truncate">
                    <ImageIcon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{att.name}</span>
                  </span>
                  <a
                    href={att.url}
                    download={att.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold underline shrink-0"
                    style={{ color: onDark ? '#ffffff' : 'var(--fp-olive)' }}
                  >
                    <Download className="w-3 h-3" />
                    <span>Save</span>
                  </a>
                </div>
              </div>
            );
          }

          return (
            <a
              key={att.id || att.url}
              href={att.url}
              download={att.name}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl border no-underline transition-opacity hover:opacity-90"
              style={{
                borderColor: onDark ? 'rgba(255,255,255,0.28)' : 'var(--border-color)',
                background: onDark ? 'rgba(255,255,255,0.12)' : 'var(--bg-main)',
                color: onDark ? '#ffffff' : 'var(--text-main)',
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: onDark ? 'rgba(255,255,255,0.18)' : 'var(--fp-sage)',
                    color: onDark ? '#ffffff' : 'var(--fp-olive)',
                  }}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate max-w-[200px] sm:max-w-[260px]">{att.name}</div>
                  <div
                    className="text-[10px]"
                    style={{ color: onDark ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}
                  >
                    {formatFileSize(att.size)} · Click to open / download
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
            </a>
          );
        })}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 23, 18, 0.82)' }}
          onClick={() => setLightboxUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between gap-3 text-white text-xs sm:text-sm">
              <span className="font-semibold truncate">{lightboxName}</span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={lightboxUrl}
                  download={lightboxName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white no-underline inline-flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxUrl(null)}
                  className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white border-0 cursor-pointer"
                  aria-label="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <img
              src={lightboxUrl}
              alt={lightboxName}
              className="max-h-[80vh] max-w-full rounded-xl object-contain bg-black/30"
            />
          </div>
        </div>
      )}
    </>
  );
}
