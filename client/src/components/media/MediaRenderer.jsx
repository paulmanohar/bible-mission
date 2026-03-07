import PdfViewer from "./PdfViewer";
import ImageViewer from "./ImageViewer";
import VideoPlayer from "./VideoPlayer";
import AudioPlayer from "./AudioPlayer";

export default function MediaRenderer({ sourceUrl, sourceType, title, subtitle, poster }) {
  if (!sourceUrl) return null;

  switch (sourceType) {
    case "pdf":
      return <PdfViewer url={sourceUrl} title={title} />;
    case "image":
      return <ImageViewer url={sourceUrl} alt={title} />;
    case "video":
      return <VideoPlayer url={sourceUrl} title={title} poster={poster} />;
    case "audio":
      return <AudioPlayer url={sourceUrl} title={title} subtitle={subtitle} />;
    case "text":
      return (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-10 px-6 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors" data-testid="link-view-source">
          View Source Document
        </a>
      );
    default:
      return null;
  }
}
