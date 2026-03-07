import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mic, Play, Clock } from "lucide-react";
import { apiService } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaRenderer from "../components/media/MediaRenderer";

export default function PodcastDetailPage() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiService.getPodcast(id)
      .then((data) => setPodcast(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-3xl">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-muted rounded w-24" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !podcast) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Podcast Not Found</h1>
            <p className="text-muted-foreground mb-8">{error || "This podcast episode could not be found."}</p>
            <Link to="/resources" className="text-primary font-medium hover:underline">Back to Resources</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-3xl">
          <Link to="/resources" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 md:mb-8" data-testid="link-back-resources">
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </Link>

          <div className="bg-primary text-primary-foreground p-5 sm:p-6 md:p-8 lg:p-12 mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Mic className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">Daily Bread Podcast</p>
                {podcast.episodeNumber && <p className="text-sm text-primary-foreground/80">Episode {podcast.episodeNumber}</p>}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-podcast-title">{podcast.title}</h1>

            <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
              {podcast.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {podcast.duration}
                </span>
              )}
              {podcast.category && <span>{podcast.category}</span>}
            </div>

            {podcast.sourceUrl && (
              <div className="mt-8">
                <MediaRenderer
                  sourceUrl={podcast.sourceUrl}
                  sourceType={podcast.sourceType || "audio"}
                  title={podcast.title}
                  subtitle={`Episode ${podcast.episodeNumber || ""} · ${podcast.duration || ""}`}
                />
              </div>
            )}

            {!podcast.sourceUrl && podcast.audioUrl && (
              <div className="mt-8">
                <MediaRenderer
                  sourceUrl={podcast.audioUrl}
                  sourceType="audio"
                  title={podcast.title}
                  subtitle={`Episode ${podcast.episodeNumber || ""} · ${podcast.duration || ""}`}
                />
              </div>
            )}

            {!podcast.sourceUrl && !podcast.audioUrl && (
              <button className="mt-8 inline-flex items-center gap-2 h-12 px-8 bg-white text-primary font-medium hover:bg-white/90 transition-colors" data-testid="button-play-podcast">
                <Play className="h-4 w-4" /> Play Episode
              </button>
            )}
          </div>

          {podcast.description && (
            <div className="mb-8">
              <h3 className="text-lg font-serif font-bold mb-3">Episode Description</h3>
              <p className="text-muted-foreground leading-relaxed">{podcast.description}</p>
            </div>
          )}

          {podcast.tags && podcast.tags.length > 0 && (
            <div className="pt-6 border-t">
              <h4 className="text-sm font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {podcast.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-muted text-muted-foreground border">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
