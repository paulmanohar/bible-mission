import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Play, Mic, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPodcasts } from "../store/slices/mediaSlice";
import { itemPath } from "../utils/slug";

export default function PodcastSection() {
  const dispatch = useDispatch();
  const { podcasts, podcastsLoading } = useSelector((s) => s.media);

  useEffect(() => {
    dispatch(fetchPodcasts());
  }, [dispatch]);

  return (
    <section className="py-16 md:py-24 bg-background border-t" id="podcasts">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold" data-testid="text-podcast-section-title">Daily Bread Podcast</h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Start your day with short, powerful messages derived from the teachings of M.Devadas Ayyagaru. Listen on the go, anytime, anywhere.
            </p>
            <Link to="/resources#podcasts" data-testid="link-all-podcasts" className="inline-flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all text-sm">
              Browse All Episodes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {podcastsLoading ? (
              [1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-sm" />)
            ) : (
              podcasts.slice(0, 4).map((podcast) => (
                <Link
                  key={podcast.id}
                  to={itemPath("podcasts", podcast.id, podcast.title)}
                  data-testid={`card-podcast-${podcast.id}`}
                  className="flex items-center gap-4 bg-muted/50 border border-border/50 p-3 md:p-4 hover:bg-muted hover:border-primary/20 transition-colors rounded-sm group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Play className="h-4 w-4 ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{podcast.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{podcast.duration || "—"} {podcast.category ? `· ${podcast.category}` : ""}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
