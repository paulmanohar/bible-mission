import { useState, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCw, Maximize2, X } from "lucide-react";

export default function ImageViewer({ url, alt }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const containerRef = useRef(null);

  if (!url) return null;

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 4));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  const rotate = () => setRotation((r) => (r + 90) % 360);
  const resetView = () => { setZoom(1); setRotation(0); };

  const imageStyle = {
    transform: `scale(${zoom}) rotate(${rotation}deg)`,
    transition: "transform 0.2s ease",
  };

  const controls = (
    <div className="flex items-center gap-1">
      <button onClick={zoomOut} className="p-1.5 hover:bg-white/20 rounded transition-colors" title="Zoom Out" data-testid="button-zoom-out">
        <ZoomOut className="h-4 w-4" />
      </button>
      <span className="text-xs font-mono min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
      <button onClick={zoomIn} className="p-1.5 hover:bg-white/20 rounded transition-colors" title="Zoom In" data-testid="button-zoom-in">
        <ZoomIn className="h-4 w-4" />
      </button>
      <button onClick={rotate} className="p-1.5 hover:bg-white/20 rounded transition-colors" title="Rotate" data-testid="button-rotate">
        <RotateCw className="h-4 w-4" />
      </button>
      <button onClick={resetView} className="px-2 py-1 text-xs hover:bg-white/20 rounded transition-colors" data-testid="button-reset-view">Reset</button>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col" data-testid="image-viewer-modal">
        <div className="flex items-center justify-between px-4 py-3 text-white">
          <span className="text-sm font-medium truncate">{alt || "Image"}</span>
          <div className="flex items-center gap-2">
            {controls}
            <button onClick={() => { setIsModal(false); resetView(); }} className="p-1.5 hover:bg-white/20 rounded transition-colors" data-testid="button-close-modal">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto flex items-center justify-center p-4">
          <img src={url} alt={alt || ""} style={imageStyle} className="max-w-none" draggable={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="border bg-muted/30" data-testid="image-viewer">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
        <span className="text-sm font-medium truncate">{alt || "Image"}</span>
        <div className="flex items-center gap-2">
          {controls}
          <button onClick={() => setIsModal(true)} className="p-1.5 hover:bg-background rounded transition-colors" title="View Fullscreen" data-testid="button-expand-image">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={containerRef} className="overflow-auto flex items-center justify-center bg-black/5" style={{ height: "50vh" }}>
        <img src={url} alt={alt || ""} style={imageStyle} className="max-w-none cursor-zoom-in" onClick={() => setIsModal(true)} draggable={false} />
      </div>
    </div>
  );
}
