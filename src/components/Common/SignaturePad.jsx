import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, PenTool } from 'lucide-react';

/**
 * Smooth HTML5 Canvas Signature Pad (Touch + Mouse + Stylus)
 * Works cleanly on iPhones, iPads, Android phones, and laptops.
 */
export default function SignaturePad({ onChange, height = 140 }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [hasStroke, setHasStroke] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.offsetWidth || 360;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#141d1f';
  }, [height]);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0] || e.changedTouches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pt = getPoint(e);
    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
  };

  const draw = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pt = getPoint(e);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    if (!hasStroke) setHasStroke(true);
  };

  const endDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange?.(canvas.toDataURL('image/png'));
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
    onChange?.('');
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold inline-flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5" style={{ color: 'var(--fp-olive)' }} />
          <span>Sign below (finger or mouse) *</span>
        </span>
        {hasStroke && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold inline-flex items-center gap-1 hover:underline bg-transparent border-0 p-0 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>
      <div
        className="rounded-xl border-2 border-dashed bg-white overflow-hidden relative select-none"
        style={{ borderColor: hasStroke ? 'var(--fp-olive)' : 'var(--border-color)' }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${height}px`, touchAction: 'none', display: 'block' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        {!hasStroke && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-400">
            Draw your signature here
          </div>
        )}
      </div>
    </div>
  );
}
