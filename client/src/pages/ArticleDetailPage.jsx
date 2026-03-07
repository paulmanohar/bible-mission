import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { apiService } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaRenderer from "../components/media/MediaRenderer";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiService.getBlogPostById(id)
      .then((data) => setPost(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-4">
          <div className="container mx-auto px-4 py-16 max-w-3xl">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-muted rounded w-24" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-4">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">{error || "This article could not be found."}</p>
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
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Link to="/resources" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8" data-testid="link-back-resources">
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </Link>

          <article>
            <div className="mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1">{post.category}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6" data-testid="text-article-title">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author}
              </span>
              {post.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
            </div>

            {post.sourceUrl && (
              <div className="mb-8">
                <MediaRenderer
                  sourceUrl={post.sourceUrl}
                  sourceType={post.sourceType || "text"}
                  title={post.title}
                  subtitle={post.author}
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none" data-testid="text-article-content">
              {post.content.split("\n").map((paragraph, i) => (
                paragraph.trim() ? <p key={i} className="text-foreground/90 leading-relaxed mb-4">{paragraph}</p> : null
              ))}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h4 className="text-sm font-semibold mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-muted text-muted-foreground border">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
