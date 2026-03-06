import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Play, Mic, ArrowRight } from "lucide-react";
import { fetchPodcasts, fetchLivestreams } from "../store/slices/mediaSlice";

export default function MediaSection() {
  const dispatch = useDispatch();
  const { podcasts, livestreams, podcastsLoading, streamsLoading } = useSelector((s) => s.media);

  useEffect(() => {
    dispatch(fetchPodcasts());
    dispatch(fetchLivestreams());
  }, [dispatch]);

  const liveNow = livestreams.find((s) => s.isLive);
  const scheduledStreams = livestreams.filter((s) => !s.isLive);

  return (
    <section className="py-24 bg-primary text-primary-foreground" id="media">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6" data-testid="text-media-title">Watch & Listen</h2>
          <p className="text-primary-foreground/80 text-lg">
            Join our livestreams, listen to uplifting podcasts, and stay connected with the spiritual journey wherever you are.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white/5 border border-white/10 p-1 md:p-2">
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-16 h-16 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform hover:bg-primary">
                  <Play className="h-6 w-6 ml-1" />
                </div>
              </div>
              <div className="absolute top-4 left-4 z-20">
                {liveNow ? (
                  <span className="inline-flex items-center rounded-sm bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>LIVE NOW
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-sm bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">UPCOMING</span>
                )}
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <h3 className="font-serif text-xl font-bold text-white mb-1">{liveNow?.title || livestreams[0]?.title || "Sunday Global Service"}</h3>
                <p className="text-sm text-white/80">{liveNow?.pastorName || livestreams[0]?.pastorName || "Senior Pastor"} • Guntur Headquarters</p>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-serif font-bold text-lg mb-2">Upcoming Broadcasts</h4>
              {streamsLoading ? (
                <div className="space-y-3 mt-4">{[1, 2].map((i) => <div key={i} className="h-8 bg-white/10 animate-pulse rounded" />)}</div>
              ) : (
                <ul className="space-y-3 mt-4 text-sm text-primary-foreground/80">
                  {scheduledStreams.map((stream) => (
                    <li key={stream.id} data-testid={`text-stream-${stream.id}`} className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span>{stream.title}</span>
                      <span className="text-white text-xs">{stream.scheduledAt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 md:p-8 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4">Daily Bread Podcast</h3>
            <p className="text-primary-foreground/80 mb-8 leading-relaxed">
              Start your day with short, powerful messages derived from the teachings of M.Devadas Ayyagaru.
            </p>

            {podcastsLoading ? (
              <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white/10 animate-pulse rounded-sm" />)}</div>
            ) : (
              <div className="space-y-4">
                {podcasts.slice(0, 3).map((podcast) => (
                  <div key={podcast.id} data-testid={`card-podcast-${podcast.id}`} className="flex items-center gap-4 bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer rounded-sm">
                    <div className="w-10 h-10 bg-primary-foreground text-primary rounded-full flex items-center justify-center shrink-0">
                      <Play className="h-4 w-4 ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-white">{podcast.title}</p>
                      <p className="text-xs text-primary-foreground/60">{podcast.duration || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10">
              <button data-testid="button-subscribe-podcast" className="w-full h-10 bg-white text-primary hover:bg-white/90 text-sm font-medium transition-colors">
                Subscribe & Listen All
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
