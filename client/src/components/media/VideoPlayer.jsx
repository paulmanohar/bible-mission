import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, PictureInPicture2 } from "lucide-react";

export default function VideoPlayer({ url, title, poster }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pipSupported, setPipSupported] = useState(false);

  useEffect(() => {
    setPipSupported(document.pictureInPictureEnabled || false);
  }, []);

  if (!url) return null;

  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

  if (isYouTube) {
    let embedUrl = url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/);
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}?rel=0`;

    return (
      <div className="border bg-black" data-testid="video-player">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={title || "Video"}
            data-testid="iframe-youtube"
          />
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) videoRef.current.pause();
      else videoRef.current.play();
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
    }
  };

  const togglePip = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch {}
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border bg-black rounded-sm overflow-hidden" data-testid="video-player">
      <div className="relative aspect-video group">
        <video
          ref={videoRef}
          src={url}
          poster={poster}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => setPlaying(false)}
          onClick={togglePlay}
          data-testid="video-element"
        />
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={togglePlay} data-testid="button-video-overlay">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-7 w-7 text-black ml-1" />
            </div>
          </div>
        )}
      </div>
      <div className="bg-neutral-900 text-white px-4 py-2">
        <div className="w-full h-1 bg-white/20 rounded cursor-pointer mb-2" onClick={handleSeek} data-testid="video-seekbar">
          <div className="h-full bg-white rounded" style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="p-1 hover:bg-white/10 rounded" data-testid="button-play-pause">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={toggleMute} className="p-1 hover:bg-white/10 rounded" data-testid="button-mute">
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <span className="text-xs font-mono">{formatTime(progress)} / {formatTime(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            {pipSupported && (
              <button onClick={togglePip} className="p-1 hover:bg-white/10 rounded" title="Picture in Picture" data-testid="button-pip">
                <PictureInPicture2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={toggleFullscreen} className="p-1 hover:bg-white/10 rounded" title="Fullscreen" data-testid="button-fullscreen-video">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
