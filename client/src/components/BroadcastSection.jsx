import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Play, ArrowRight, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchLivestreams } from "../store/slices/mediaSlice";
import { itemPath } from "../utils/slug";

export default function BroadcastSection() {
  const dispatch = useDispatch();
  const { livestreams, streamsLoading } = useSelector((s) => s.media);

  useEffect(() => {
    dispatch(fetchLivestreams());
  }, [dispatch]);

  const liveNow = livestreams.find((s) => s.isLive);
  const featured = liveNow || livestreams[0];
  const scheduledStreams = livestreams.filter((s) => s.id !== featured?.id);

  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground" id="broadcasts">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium mb-4">
            <Radio className="h-4 w-4" />
            Live & Upcoming
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-broadcast-title">Broadcasts</h2>
          <p className="text-primary-foreground/80 text-base md:text-lg">
            Join our live broadcasts, watch replays, and stay connected with the spiritual journey wherever you are.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          <div className="lg:col-span-3 bg-white/5 border border-white/10 overflow-hidden">
            <Link to={featured ? itemPath("broadcasts", featured.id, featured.title) : "#"} className="block">
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform hover:bg-primary">
                    <Play className="h-5 w-5 md:h-6 md:w-6 ml-1" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
                  {liveNow ? (
                    <span className="inline-flex items-center rounded-sm bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>LIVE NOW
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">UPCOMING</span>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20">
                  <h3 className="font-serif text-lg md:text-xl font-bold text-white mb-1">{featured?.title || "Sunday Global Service"}</h3>
                  <p className="text-sm text-white/80">{featured?.pastorName || "Senior Pastor"}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-4 md:p-6 flex flex-col">
            <h4 className="font-serif font-bold text-lg mb-4">Upcoming Broadcasts</h4>
            {streamsLoading ? (
              <div className="space-y-3 flex-1">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-white/10 animate-pulse rounded" />)}</div>
            ) : scheduledStreams.length === 0 ? (
              <p className="text-sm text-primary-foreground/60 flex-1 flex items-center">No upcoming broadcasts scheduled.</p>
            ) : (
              <ul className="space-y-3 flex-1 overflow-y-auto">
                {scheduledStreams.slice(0, 5).map((stream) => (
                  <li key={stream.id} data-testid={`text-stream-${stream.id}`}>
                    <Link
                      to={itemPath("broadcasts", stream.id, stream.title)}
                      className="flex justify-between items-center border-b border-white/10 pb-3 hover:bg-white/5 transition-colors px-2 py-1 -mx-2 rounded-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="block text-sm font-medium truncate">{stream.title}</span>
                        <span className="block text-xs text-primary-foreground/60 mt-0.5">{stream.pastorName}</span>
                      </div>
                      <span className="text-white text-xs shrink-0 ml-3">{stream.scheduledAt}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link to="/#broadcasts" data-testid="link-all-broadcasts" className="inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all">
                View All Broadcasts <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
