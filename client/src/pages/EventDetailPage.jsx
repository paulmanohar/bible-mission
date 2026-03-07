import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import { apiService } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaRenderer from "../components/media/MediaRenderer";

function formatDateLong(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiService.getEvent(id)
      .then((data) => setEvent(data))
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

  if (error || !event) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">{error || "This event could not be found."}</p>
            <Link to="/meetings" className="text-primary font-medium hover:underline">Back to Meetings</Link>
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
          <Link to="/meetings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 md:mb-8" data-testid="link-back-meetings">
            <ArrowLeft className="h-4 w-4" /> Back to Meetings
          </Link>

          <div className="border p-5 sm:p-6 md:p-8 lg:p-12 mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 md:mb-6" data-testid="text-event-title">{event.title}</h1>

            <div className="space-y-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary/60 shrink-0" />
                <span className="text-base">{formatDateLong(event.date)}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary/60 shrink-0" />
                  <span className="text-base">{event.time}</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary/60 shrink-0 mt-0.5" />
                <span className="text-base">{event.location}</span>
              </div>
              {event.pastorName && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary/60 shrink-0" />
                  <span className="text-base">Speaker: <strong className="text-foreground">{event.pastorName}</strong></span>
                </div>
              )}
            </div>

            {event.sourceUrl && (
              <div className="pt-6 border-t mb-8">
                <MediaRenderer
                  sourceUrl={event.sourceUrl}
                  sourceType={event.sourceType || "image"}
                  title={event.title}
                  poster={event.posterImage}
                />
              </div>
            )}

            {event.description && (
              <div className="pt-6 border-t mb-8">
                <h3 className="text-lg font-serif font-bold mb-3">About This Event</h3>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            )}

            {(event.latitude && event.longitude) && (
              <div className="pt-6 border-t">
                <h3 className="text-lg font-serif font-bold mb-4">Location</h3>
                <a
                  href={`https://maps.google.com/?q=${event.latitude},${event.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-6 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  data-testid="link-google-maps"
                >
                  <ExternalLink className="h-4 w-4" /> Open in Google Maps
                </a>
              </div>
            )}

            {event.tags && event.tags.length > 0 && (
              <div className="pt-6 border-t mt-8">
                <h4 className="text-sm font-semibold mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-muted text-muted-foreground border">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
