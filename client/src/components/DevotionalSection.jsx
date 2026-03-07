import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchBlogPosts } from "../store/slices/blogSlice";
import { subscribeNewsletter, resetFormStatus } from "../store/slices/formsSlice";
import { itemPath } from "../utils/slug";

export default function DevotionalSection() {
  const dispatch = useDispatch();
  const { posts } = useSelector((s) => s.blog);
  const { newsletter } = useSelector((s) => s.forms);
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  useEffect(() => {
    if (newsletter.status === "success") {
      setEmail("");
      setTimeout(() => dispatch(resetFormStatus("newsletter")), 3000);
    }
  }, [newsletter.status, dispatch]);

  const latestPost = posts[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) dispatch(subscribeNewsletter(email));
  };

  return (
    <section className="py-16 md:py-24 bg-background border-t" id="devotional">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">
              <BookOpen className="h-4 w-4 mr-2" />
              Daily Devotional
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold leading-tight" data-testid="text-devotional-title">
              Spiritual Nourishment for Every Day
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Dive into our daily blogs and newsletters. Get inspired by timeless wisdom and contemporary reflections.
            </p>

            {latestPost && (
              <div className="pt-2 md:pt-4">
                <Link to={itemPath("articles", latestPost.id, latestPost.title)} className="block bg-muted/50 p-4 md:p-6 border-l-4 border-primary hover:bg-muted/70 transition-colors">
                  <h4 className="font-bold mb-2 text-sm md:text-base" data-testid="text-latest-post-title">Today's Reading: {latestPost.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground italic mb-3 md:mb-4">
                    {latestPost.excerpt || latestPost.content.substring(0, 120) + "..."}
                  </p>
                  <span className="text-sm font-semibold text-primary inline-flex items-center hover:gap-2 transition-all gap-1" data-testid="link-read-article">
                    Read Full Article <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="bg-card border shadow-sm p-6 md:p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4">Subscribe to our Newsletter</h3>
                <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8">Receive weekly updates, event announcements, and spiritual resources directly in your inbox.</p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    data-testid="input-newsletter-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-11 md:h-12 px-4 border border-input bg-transparent text-base focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button
                    data-testid="button-subscribe-newsletter"
                    type="submit"
                    disabled={newsletter.status === "pending"}
                    className="h-11 md:h-12 px-6 md:px-8 bg-primary text-primary-foreground text-sm md:text-base font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {newsletter.status === "pending" ? "Subscribing..." : newsletter.status === "success" ? "Subscribed!" : "Subscribe"}
                  </button>
                </form>
                {newsletter.error && <p className="text-destructive text-sm mt-2">{newsletter.error}</p>}
                <p className="text-xs text-muted-foreground mt-4">By subscribing, you agree to our privacy policy. Unsubscribe any time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
