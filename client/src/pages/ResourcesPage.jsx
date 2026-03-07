import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, BookOpen, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchBooks, setSearchQuery, setActiveLanguage } from "../store/slices/booksSlice";
import { fetchBlogPosts } from "../store/slices/blogSlice";
import { fetchPodcasts } from "../store/slices/mediaSlice";
import { subscribeNewsletter, resetFormStatus } from "../store/slices/formsSlice";
import { itemPath } from "../utils/slug";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = ["All", "Theology", "Prayer", "Devotional", "Sermons"];

export default function ResourcesPage() {
  const dispatch = useDispatch();
  const { items: books, loading: booksLoading, searchQuery, activeLanguage } = useSelector((s) => s.books);
  const { posts, loading: postsLoading } = useSelector((s) => s.blog);
  const { podcasts, podcastsLoading } = useSelector((s) => s.media);
  const { newsletter } = useSelector((s) => s.forms);

  const [activeCategory, setActiveCategory] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    const language = activeLanguage === "all" ? undefined : activeLanguage === "english" ? "English" : "Telugu";
    dispatch(fetchBooks({ query: searchQuery || undefined, language }));
  }, [dispatch, searchQuery, activeLanguage]);

  useEffect(() => {
    dispatch(fetchBlogPosts());
    dispatch(fetchPodcasts());
  }, [dispatch]);

  useEffect(() => {
    if (newsletter.status === "success") {
      setNewsletterEmail("");
      setTimeout(() => dispatch(resetFormStatus("newsletter")), 3000);
    }
  }, [newsletter.status, dispatch]);

  const filteredBooks = activeCategory === "All"
    ? books
    : books.filter((b) => b.category === activeCategory);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) dispatch(subscribeNewsletter(newsletterEmail));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="relative py-16 sm:py-20 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-widest mb-3 md:mb-4 text-primary-foreground/70 font-medium">Resources</p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-4 md:mb-6 leading-tight" data-testid="text-resources-page-title">
                Books, Blogs & Teachings
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl">
                Explore the complete library of writings by our Spiritual Father M.Devadas Ayyagaru, alongside daily devotionals, blogs, and podcast episodes.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-8 mb-8 md:mb-12">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Book Library</h2>
                <p className="text-muted-foreground text-sm md:text-base">Search in English and Telugu (తెలుగు)</p>
              </div>
              <div className="w-full lg:w-96">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    data-testid="input-search-books"
                    type="search"
                    placeholder="Search books by title, topic..."
                    className="w-full h-11 md:h-12 pl-10 pr-4 border border-input bg-background text-base focus:outline-none focus:ring-1 focus:ring-ring"
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-0 border-b mb-6 md:mb-8 overflow-x-auto">
              {[
                { key: "all", label: "All Books" },
                { key: "english", label: "English" },
                { key: "telugu", label: "Telugu (తెలుగు)" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  data-testid={`tab-lang-${tab.key}`}
                  onClick={() => dispatch(setActiveLanguage(tab.key))}
                  className={`px-4 md:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeLanguage === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
              <Filter className="h-5 w-5 text-muted-foreground mt-1 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  data-testid={`filter-category-${cat.toLowerCase()}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 md:px-4 py-1.5 text-sm border transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {booksLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border bg-muted/30 animate-pulse">
                    <div className="aspect-[4/5] bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-6 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12 md:py-20 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No books found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {filteredBooks.map((book) => (
                  <Link key={book.id} to={itemPath("books", book.id, book.title)} data-testid={`card-book-${book.id}`} className="border border-border/50 bg-background hover:border-primary/30 transition-colors shadow-sm hover:shadow-md group block">
                    <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                      {book.imageId ? (
                        <img
                          src={`/assets/images/books/${book.imageId}.jpg`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          data-testid={`img-book-cover-${book.id}`}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <div className="text-center p-4 md:p-6">
                            <div className="text-4xl md:text-5xl mb-3 md:mb-4 opacity-30">📖</div>
                            <p className="font-serif text-xs md:text-sm font-bold text-primary/60">{book.author}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-background/90 backdrop-blur-sm px-2 py-1 text-[10px] md:text-xs font-medium">
                        {book.language}
                      </div>
                    </div>
                    <div className="p-2 md:p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{book.category}</p>
                      <h3 className="font-serif text-xs md:text-sm font-bold mt-1 line-clamp-2 group-hover:text-primary/80 transition-colors">{book.title}</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground mt-1 line-clamp-2 hidden sm:block">{book.description}</p>
                      <span data-testid={`button-read-${book.id}`} className="mt-2 w-full border border-border py-1 md:py-1.5 text-[10px] md:text-xs font-medium hover:bg-muted transition-colors block text-center">
                        Read Online
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 md:py-20 bg-muted/30 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 border-b pb-4 md:pb-6 gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Latest Articles & Devotionals</h2>
                <p className="text-muted-foreground text-sm md:text-base">Daily spiritual nourishment and reflections</p>
              </div>
            </div>

            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-background border animate-pulse p-5 md:p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-20 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {posts.map((post) => (
                  <Link key={post.id} to={itemPath("articles", post.id, post.title)} data-testid={`card-blog-${post.id}`} className="bg-background border p-5 md:p-6 lg:p-8 hover:border-primary/30 transition-colors group block">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 md:mb-3">{post.category}</p>
                    <h3 className="font-serif text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-3">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{post.author}</span>
                      <span className="text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all" data-testid={`link-read-post-${post.id}`}>
                        Read More <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 md:py-20 bg-primary text-primary-foreground" id="podcasts">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 md:mb-4">Daily Bread Podcast</h2>
              <p className="text-primary-foreground/80 text-base md:text-lg">Short, powerful messages from the teachings of M.Devadas Ayyagaru</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-3 md:space-y-4">
              {podcastsLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 p-4 h-16 animate-pulse rounded-sm" />
                ))
              ) : (
                podcasts.map((podcast) => (
                  <Link key={podcast.id} to={itemPath("podcasts", podcast.id, podcast.title)} data-testid={`card-podcast-${podcast.id}`} className="flex items-center gap-3 md:gap-4 bg-white/5 p-3 md:p-4 hover:bg-white/10 transition-colors cursor-pointer rounded-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-primary rounded-full flex items-center justify-center shrink-0">
                      <span className="ml-0.5">▶</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{podcast.title}</p>
                      <p className="text-xs md:text-sm text-primary-foreground/60">{podcast.duration || "—"} {podcast.description ? `· ${podcast.description.substring(0, 60)}` : ""}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 md:mb-4">Stay Connected</h2>
              <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8">Subscribe to receive weekly devotionals, new book announcements, and spiritual resources.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  data-testid="input-newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 h-11 md:h-12 px-4 border border-input bg-background text-base focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  data-testid="button-subscribe"
                  type="submit"
                  disabled={newsletter.status === "pending"}
                  className="h-11 md:h-12 px-6 md:px-8 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {newsletter.status === "pending" ? "Subscribing..." : newsletter.status === "success" ? "Subscribed!" : "Subscribe"}
                </button>
              </form>
              {newsletter.error && <p className="text-destructive text-sm mt-2">{newsletter.error}</p>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
