import { useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Download, ChevronLeft, ChevronRight } from "lucide-react";

export default function PdfViewer({ url, title }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!url) return null;

  const toggleFullscreen = () => {
    const el = document.getElementById("pdf-container");
    if (!isFullscreen) {
      if (el?.requestFullscreen) el.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div id="pdf-container" className="border bg-muted/30" data-testid="pdf-viewer">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
        <span className="text-sm font-medium truncate">{title || "Document"}</span>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-background rounded transition-colors"
            title="Download PDF"
            data-testid="button-download-pdf"
          >
            <Download className="h-4 w-4" />
          </a>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-background rounded transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            data-testid="button-fullscreen-pdf"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <iframe
        src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
        className="w-full border-0"
        style={{ height: isFullscreen ? "100vh" : "70vh" }}
        title={title || "PDF Document"}
        data-testid="iframe-pdf"
      />
    </div>
  );
}
