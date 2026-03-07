import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import { fetchBooks, setSearchQuery, setActiveLanguage } from "../store/slices/booksSlice";
import { Link } from "react-router-dom";
import { itemPath } from "../utils/slug";

export default function ResourcesSection() {
  const dispatch = useDispatch();
  const { items: books, loading, searchQuery, activeLanguage } = useSelector((s) => s.books);

  useEffect(() => {
    const language = activeLanguage === "all" ? undefined : activeLanguage === "english" ? "English" : "Telugu";
    dispatch(fetchBooks({ query: searchQuery || undefined, language }));
  }, [dispatch, searchQuery, activeLanguage]);

  return (
    <section className="py-16 md:py-24 bg-muted/30" id="resources">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 md:mb-4" data-testid="text-resources-title">Books & Resources</h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Access the profound writings and teachings of our Spiritual Father M.Devadas Ayyagaru. Available in English and Telugu.
            </p>
          </div>
          <div className="w-full md:w-auto flex-1 max-w-md">
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
              data-testid={`tab-${tab.key}-books`}
              onClick={() => dispatch(setActiveLanguage(tab.key))}
              className={`px-4 md:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeLanguage === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border bg-muted/30 animate-pulse">
                <div className="aspect-[3/4] bg-muted" />
                <div className="p-4 space-y-3"><div className="h-4 bg-muted rounded w-1/3" /><div className="h-6 bg-muted rounded w-3/4" /></div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 md:py-16 text-muted-foreground"><p className="text-lg">No books found matching your search.</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {books.slice(0, 5).map((book) => (
              <Link key={book.id} to={itemPath("books", book.id, book.title)} data-testid={`card-book-${book.id}`} className="border border-border/50 bg-background hover:border-primary/30 transition-colors shadow-sm hover:shadow-md block">
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
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-background/90 backdrop-blur-sm px-2 py-1 text-[10px] md:text-xs font-medium">{book.language}</div>
                </div>
                <div className="p-2 md:p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{book.category}</p>
                  <h3 className="font-serif text-xs md:text-sm font-bold mt-1 line-clamp-2">{book.title}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-1 line-clamp-2 hidden sm:block">{book.description}</p>
                  <span className="mt-2 w-full border border-border py-1 md:py-1.5 text-[10px] md:text-xs font-medium hover:bg-muted transition-colors block text-center">Read Online</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 md:mt-12 text-center">
          <Link to="/resources">
            <span className="inline-flex items-center h-10 md:h-12 px-6 md:px-8 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm md:text-base font-medium cursor-pointer" data-testid="link-view-library">
              View Complete Library
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
