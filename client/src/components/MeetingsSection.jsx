import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { fetchEvents } from "../store/slices/eventsSlice";
import { Link } from "react-router-dom";

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return { month: months[d.getMonth()], day: d.getDate() };
}

function formatDateLong(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function MeetingsSection() {
  const dispatch = useDispatch();
  const { items: events, loading } = useSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <section className="py-24 bg-background" id="meetings">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b pb-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-meetings-title">Upcoming Meetings</h2>
            <p className="text-muted-foreground text-lg">Join us in fellowship and worship. Find official events hosted by our pastors worldwide.</p>
          </div>
          <Link to="/meetings">
            <span className="inline-flex items-center h-10 px-6 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer" data-testid="button-view-all-events">
              View All Events <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i}><div className="aspect-video bg-muted animate-pulse mb-6" /><div className="h-6 bg-muted rounded w-3/4 mb-3 animate-pulse" /><div className="h-4 bg-muted rounded w-1/2 animate-pulse" /></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground"><p className="text-lg">No upcoming events at this time.</p></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => {
              const { month, day } = formatDateShort(event.date);
              return (
                <div key={event.id} data-testid={`card-event-${event.id}`} className="group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden mb-6 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-4xl font-serif font-bold text-primary/30">{event.title.substring(0, 2).toUpperCase()}</div>
                    <div className="absolute bottom-4 right-4 bg-background p-3 text-center shadow-lg">
                      <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">{month}</span>
                      <span className="block text-2xl font-serif font-bold leading-none">{day}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary/80 transition-colors">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0" /><span>{formatDateLong(event.date)}</span></div>
                    {event.time && <div className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" /><span>{event.time}</span></div>}
                    <div className="flex items-start gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" /><span>{event.location}</span></div>
                  </div>
                  <Link to="/meetings">
                    <span className="w-full border border-border/60 hover:bg-muted flex items-center justify-between py-2 px-4 text-sm font-medium transition-colors cursor-pointer">
                      View Details & Map <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
