import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Calendar, Clock, ArrowRight, Users, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchEvents, submitEvent, clearSubmitStatus } from "../store/slices/eventsSlice";
import { itemPath } from "../utils/slug";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function formatDateLong(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return { month: months[d.getMonth()], day: d.getDate() };
}

function SubmitEventForm({ onClose }) {
  const dispatch = useDispatch();
  const { submitStatus } = useSelector((s) => s.events);
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "",
    location: "", latitude: "", longitude: "",
    pastorName: "", posterImage: "",
  });

  useEffect(() => {
    if (submitStatus === "success") {
      setTimeout(() => {
        dispatch(clearSubmitStatus());
        onClose();
      }, 2000);
    }
  }, [submitStatus, dispatch, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitEvent({ ...form, approved: false }));
  };

  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background border w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-2xl font-bold mb-6">Submit Event for Promotion</h3>

        {submitStatus === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h4 className="font-bold text-lg mb-2">Submitted Successfully!</h4>
            <p className="text-muted-foreground text-sm">Your event will be reviewed and published once approved.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input data-testid="input-event-title" placeholder="Event Title" value={form.title} onChange={updateField("title")} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <textarea data-testid="input-event-description" placeholder="Event Description" value={form.description} onChange={updateField("description")} rows={3} className="w-full px-3 py-2 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
            <div className="grid grid-cols-2 gap-4">
              <input data-testid="input-event-date" type="date" value={form.date} onChange={updateField("date")} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              <input data-testid="input-event-time" placeholder="Time (e.g., 9 AM - 5 PM)" value={form.time} onChange={updateField("time")} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <input data-testid="input-event-location" placeholder="Full venue address" value={form.location} onChange={updateField("location")} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <div className="grid grid-cols-2 gap-4">
              <input data-testid="input-event-lat" placeholder="Latitude (optional)" value={form.latitude} onChange={updateField("latitude")} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              <input data-testid="input-event-lng" placeholder="Longitude (optional)" value={form.longitude} onChange={updateField("longitude")} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <input data-testid="input-event-pastor" placeholder="Pastor / Speaker name" value={form.pastorName} onChange={updateField("pastorName")} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <input data-testid="input-event-poster" placeholder="Poster image URL (optional)" value={form.posterImage} onChange={updateField("posterImage")} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />

            <div className="bg-muted/50 p-3 text-xs text-muted-foreground border flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <span>Only posters that are officially submitted and requested for promotion will be advertised on our pages.</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 h-10 border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button data-testid="button-submit-event-form" type="submit" disabled={submitStatus === "pending"} className="flex-1 h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitStatus === "pending" ? "Submitting..." : "Submit Event"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function MeetingsPage() {
  const dispatch = useDispatch();
  const { items: events, loading } = useSelector((s) => s.events);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-widest mb-4 text-primary-foreground/70 font-medium">Events</p>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight" data-testid="text-meetings-page-title">
                Upcoming Meetings & Events
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl">
                Find gatherings, conventions, and worship services hosted by pastors across all our locations worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b pb-6">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">All Upcoming Events</h2>
                <p className="text-muted-foreground">Officially approved events with venue details and pin locations</p>
              </div>
              <button
                data-testid="button-submit-event-open"
                onClick={() => setShowForm(true)}
                className="h-10 px-6 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
              >
                Submit Your Event
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border animate-pulse p-6">
                    <div className="flex gap-6">
                      <div className="w-20 h-20 bg-muted rounded" />
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No upcoming events</p>
                <p className="text-sm">Check back soon for new event announcements</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {events.map((event) => {
                  const { month, day } = formatDateShort(event.date);
                  return (
                    <Link key={event.id} to={itemPath("events", event.id, event.title)} data-testid={`card-event-${event.id}`} className="border border-border hover:border-primary/30 transition-colors group block">
                      <div className="flex">
                        <div className="w-24 bg-primary text-primary-foreground flex flex-col items-center justify-center p-4 shrink-0">
                          <span className="text-xs font-bold uppercase tracking-wider opacity-80">{month}</span>
                          <span className="text-3xl font-serif font-bold leading-none mt-1">{day}</span>
                        </div>

                        <div className="flex-1 p-6">
                          <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-primary/80 transition-colors">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                          )}
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 shrink-0 text-primary/60" />
                              <span>{formatDateLong(event.date)}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 shrink-0 text-primary/60" />
                                <span>{event.time}</span>
                              </div>
                            )}
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
                              <span>{event.location}</span>
                            </div>
                            {event.pastorName && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 shrink-0 text-primary/60" />
                                <span>Speaker: <strong className="text-foreground">{event.pastorName}</strong></span>
                              </div>
                            )}
                          </div>

                          {(event.latitude && event.longitude) && (
                            <span
                              onClick={(e) => { e.preventDefault(); window.open(`https://maps.google.com/?q=${event.latitude},${event.longitude}`, '_blank'); }}
                              className="inline-flex items-center gap-1 mt-4 text-sm text-primary font-medium hover:underline cursor-pointer"
                              data-testid={`link-map-${event.id}`}
                            >
                              <MapPin className="h-3 w-3" /> View on Google Maps <ArrowRight className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Submit Event CTA */}
        <section className="py-16 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="font-serif text-2xl font-bold mb-2">Hosting a Meeting?</h3>
                <p className="text-muted-foreground max-w-lg">
                  Pastors may submit complete meeting details including posters and exact pin locations for official promotion.
                </p>
              </div>
              <button
                data-testid="button-submit-event-bottom"
                onClick={() => setShowForm(true)}
                className="h-12 px-8 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shrink-0"
              >
                Submit Event Details
              </button>
            </div>

            <div className="mt-8 max-w-4xl mx-auto bg-background border p-4 flex items-start gap-3 text-sm text-muted-foreground">
              <Info className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
              <p><strong className="text-foreground">Note:</strong> Only posters that are officially submitted and requested for promotion will be advertised on our pages. We verify all event details before publishing.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {showForm && <SubmitEventForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
