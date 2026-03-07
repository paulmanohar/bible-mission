import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Radio, Calendar, User, Play } from "lucide-react";
import { apiService } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaRenderer from "../components/media/MediaRenderer";

export default function BroadcastDetailPage() {
  const { id } = useParams();
  const [broadcast, setBroadcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiService.getLivestream(id)
      .then((data) => setBroadcast(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-muted rounded w-32" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="aspect-video bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !broadcast) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Broadcast Not Found</h1>
            <p className="text-muted-foreground mb-8">{error || "This broadcast could not be found."}</p>
            <Link to="/" className="text-primary font-medium hover:underline">Back to Home</Link>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 md:mb-8" data-testid="link-back-home">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="bg-primary text-primary-foreground p-6 md:p-10 lg:p-12 mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Radio className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">Broadcast</p>
                {broadcast.isLive && (
                  <span className="inline-flex items-center rounded-sm bg-red-600 px-2 py-0.5 text-xs font-semibold text-white mt-1">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>LIVE NOW
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-broadcast-title">{broadcast.title}</h1>

            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-primary-foreground/70">
              {broadcast.pastorName && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {broadcast.pastorName}
                </span>
              )}
              {broadcast.scheduledAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {broadcast.scheduledAt}
                </span>
              )}
              {broadcast.category && <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{broadcast.category}</span>}
            </div>
          </div>

          {(broadcast.sourceUrl || broadcast.streamUrl) && (
            <div className="mb-6 md:mb-8">
              <MediaRenderer
                sourceUrl={broadcast.sourceUrl || broadcast.streamUrl}
                sourceType={broadcast.sourceType || "video"}
                title={broadcast.title}
                subtitle={broadcast.pastorName}
              />
            </div>
          )}

          {!broadcast.sourceUrl && !broadcast.streamUrl && (
            <div className="mb-6 md:mb-8 bg-muted/30 border p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-primary ml-1" />
              </div>
              <p className="text-muted-foreground text-sm">
                {broadcast.isLive ? "The live stream will appear here when available." : "This broadcast will be available at the scheduled time."}
              </p>
            </div>
          )}

          {broadcast.description && (
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg font-serif font-bold mb-3">About This Broadcast</h3>
              <p className="text-muted-foreground leading-relaxed">{broadcast.description}</p>
            </div>
          )}

          {broadcast.tags && broadcast.tags.length > 0 && (
            <div className="pt-6 border-t">
              <h4 className="text-sm font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {broadcast.tags.map((tag) => (
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
