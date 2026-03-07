import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";

export default function AudioPlayer({ url, title, subtitle }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  if (!url) return null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) audioRef.current.pause();
      else audioRef.current.play();
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const skip = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * duration;
    }
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-sm" data-testid="audio-player">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
        data-testid="audio-element"
      />

      {title && (
        <div className="mb-4">
          <p className="font-serif font-bold text-lg">{title}</p>
          {subtitle && <p className="text-sm text-primary-foreground/70">{subtitle}</p>}
        </div>
      )}

      <div className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3" onClick={handleSeek} data-testid="audio-seekbar">
        <div className="h-full bg-white rounded-full transition-all" style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-primary-foreground/70">{formatTime(progress)}</span>

        <div className="flex items-center gap-4">
          <button onClick={() => skip(-15)} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Back 15s" data-testid="button-skip-back">
            <SkipBack className="h-4 w-4" />
          </button>
          <button onClick={togglePlay} className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center hover:bg-white/90 transition-colors" data-testid="button-audio-play">
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
          <button onClick={() => skip(15)} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Forward 15s" data-testid="button-skip-forward">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-primary-foreground/70">{formatTime(duration)}</span>
          <button onClick={toggleMute} className="p-1 hover:bg-white/10 rounded transition-colors" data-testid="button-audio-mute">
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
