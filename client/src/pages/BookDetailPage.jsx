import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, User, Globe } from "lucide-react";
import { apiService } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaRenderer from "../components/media/MediaRenderer";

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiService.getBook(id)
      .then((data) => setBook(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="animate-pulse max-w-4xl mx-auto">
              <div className="h-6 bg-muted rounded w-24 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="aspect-[3/4] bg-muted rounded" />
                <div className="md:col-span-2 space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-32 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Book Not Found</h1>
            <p className="text-muted-foreground mb-8">{error || "This book could not be found."}</p>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Link to="/resources" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 md:mb-8" data-testid="link-back-resources">
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </Link>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
              <div className="md:col-span-1">
                <div className="aspect-[3/4] bg-muted overflow-hidden border shadow-lg sticky top-24">
                  {book.imageId ? (
                    <img
                      src={`/assets/images/books/${book.imageId}.jpg`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      data-testid="img-book-detail-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1">{book.category}</span>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> {book.language}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-book-title">{book.title}</h1>

                <div className="flex items-center gap-2 text-muted-foreground mb-8">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{book.author}</span>
                </div>

                {book.description && (
                  <div className="prose prose-sm max-w-none mb-8">
                    <h3 className="text-lg font-serif font-bold mb-3">About This Book</h3>
                    <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                  </div>
                )}

                {book.tags && book.tags.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold mb-3">Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-muted text-muted-foreground border">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {book.contentUrl && !book.sourceUrl && (
                  <a
                    href={book.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-12 px-8 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    data-testid="button-read-book"
                  >
                    <BookOpen className="h-4 w-4" /> Read Online
                  </a>
                )}
              </div>
            </div>

            {book.sourceUrl && (
              <div className="mt-10">
                <MediaRenderer
                  sourceUrl={book.sourceUrl}
                  sourceType={book.sourceType || "pdf"}
                  title={book.title}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
