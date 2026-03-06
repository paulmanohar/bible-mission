import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Search, X, BookOpen, Calendar, Mic, Radio, FileText,
  ChevronDown, ChevronUp, SlidersHorizontal, Tag, User,
} from "lucide-react";
import {
  performSearch, setSearchQuery, toggleType, toggleCategory,
  toggleTag, setAuthorFilter, setSortBy, setPage, clearAllFilters,
} from "../store/slices/searchSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const typeIcons = {
  Book: BookOpen,
  Event: Calendar,
  Article: FileText,
  Podcast: Mic,
  Livestream: Radio,
};

const typeColors = {
  Book: "bg-amber-100 text-amber-800",
  Event: "bg-blue-100 text-blue-800",
  Article: "bg-green-100 text-green-800",
  Podcast: "bg-purple-100 text-purple-800",
  Livestream: "bg-red-100 text-red-800",
};

function FacetSection({ title, icon, items, activeItems, onToggle, showCount, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded !== false);
  const [showAll, setShowAll] = useState(false);
  const sorted = Object.entries(items).sort((a, b) => b[1] - a[1]);
  const visible = showAll ? sorted : sorted.slice(0, 5);

  if (sorted.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          {icon}
          {title}
        </span>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="space-y-1.5">
          {visible.map(([key, count]) => {
            const isActive = activeItems.includes(key);
            return (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group" data-testid={`filter-${title.toLowerCase()}-${key}`}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggle(key)}
                  className="accent-primary w-3.5 h-3.5"
                />
                <span className={`text-sm flex-1 ${isActive ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"} transition-colors`}>
                  {key}
                </span>
                {showCount && (
                  <span className="text-xs text-muted-foreground tabular-nums">{count.toLocaleString()}</span>
                )}
              </label>
            );
          })}
          {sorted.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-semibold text-primary hover:underline mt-1"
              data-testid={`toggle-show-${title.toLowerCase()}`}
            >
              {showAll ? "SHOW LESS" : "SHOW MORE"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultCard({ result }) {
  const Icon = typeIcons[result.sourceType] || FileText;
  const colorClass = typeColors[result.sourceType] || "bg-gray-100 text-gray-800";
  let metadata = null;
  try {
    if (result.metadata) metadata = JSON.parse(result.metadata);
  } catch {}

  return (
    <div className="border-b border-border/60 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0" data-testid={`search-result-${result.sourceType}-${result.sourceId}`}>
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-sm ${colorClass}`}>
              <Icon className="h-3 w-3" />
              {result.sourceType.toUpperCase()}
            </span>
            {result.language && (
              <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-sm">{result.language}</span>
            )}
            {metadata?.duration && (
              <span className="text-xs text-muted-foreground">{metadata.duration}</span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold mb-1.5 hover:text-primary/80 transition-colors cursor-pointer">
            {result.title}
          </h3>

          {result.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {result.description}
            </p>
          )}

          <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
            {result.author && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {result.author}
              </span>
            )}
            {result.category && (
              <span className="px-2 py-0.5 bg-muted/50 rounded-sm">{result.category}</span>
            )}
            {result.date && (
              <span>{new Date(result.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
            )}
            {metadata?.location && (
              <span className="truncate max-w-[200px]">{metadata.location}</span>
            )}
          </div>

          {result.tags && result.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {result.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 bg-primary/5 text-primary/80 border border-primary/10 rounded-sm">
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {result.imageUrl && (
          <div className="w-24 h-32 bg-muted/50 shrink-0 overflow-hidden hidden sm:block">
            <img src={result.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const dispatch = useDispatch();
  const {
    query, results, total, facets, activeFilters,
    sortBy, page, loading, hasSearched,
  } = useSelector((s) => s.search);

  const [localQuery, setLocalQuery] = useState(query);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const doSearch = useCallback(() => {
    dispatch(performSearch({
      query: query || undefined,
      types: activeFilters.types.length ? activeFilters.types : undefined,
      categories: activeFilters.categories.length ? activeFilters.categories : undefined,
      tags: activeFilters.tags.length ? activeFilters.tags : undefined,
      author: activeFilters.author || undefined,
      sort: sortBy,
      page,
      limit: 20,
    }));
  }, [dispatch, query, activeFilters, sortBy, page]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get("q");
    if (q && q !== query) {
      dispatch(setSearchQuery(q));
      setLocalQuery(q);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localQuery));
    dispatch(setPage(1));
  };

  const activeFilterCount =
    activeFilters.types.length +
    activeFilters.categories.length +
    activeFilters.tags.length +
    (activeFilters.author ? 1 : 0);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Search Header */}
        <section className="bg-background border-b sticky top-20 z-40">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  data-testid="input-global-search"
                  type="search"
                  placeholder="Search books, events, articles, podcasts, livestreams..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 border border-input bg-background text-base focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                data-testid="button-search-submit"
                type="submit"
                className="h-12 px-6 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shrink-0"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden h-12 px-4 border border-border flex items-center gap-2 text-sm font-medium hover:bg-muted transition-colors"
                data-testid="button-toggle-filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>
                )}
              </button>
            </form>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={`w-64 shrink-0 ${sidebarOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:p-0" : "hidden lg:block"}`}>
              {sidebarOpen && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-serif text-lg font-bold">Filters</h3>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-muted rounded">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {activeFilterCount > 0 && (
                <button
                  onClick={() => dispatch(clearAllFilters())}
                  className="text-xs font-semibold text-primary hover:underline mb-4 flex items-center gap-1"
                  data-testid="button-clear-filters"
                >
                  <X className="h-3 w-3" /> Clear all filters
                </button>
              )}

              <FacetSection
                title="Type"
                icon={<FileText className="h-3.5 w-3.5" />}
                items={facets.types}
                activeItems={activeFilters.types}
                onToggle={(t) => dispatch(toggleType(t))}
                showCount
                defaultExpanded
              />

              <FacetSection
                title="Category"
                icon={<Tag className="h-3.5 w-3.5" />}
                items={facets.categories}
                activeItems={activeFilters.categories}
                onToggle={(c) => dispatch(toggleCategory(c))}
                showCount
                defaultExpanded
              />

              <FacetSection
                title="Author"
                icon={<User className="h-3.5 w-3.5" />}
                items={facets.authors}
                activeItems={activeFilters.author ? [activeFilters.author] : []}
                onToggle={(a) => dispatch(setAuthorFilter(activeFilters.author === a ? "" : a))}
                showCount
              />

              <FacetSection
                title="Tags"
                icon={<Tag className="h-3.5 w-3.5" />}
                items={facets.tags}
                activeItems={activeFilters.tags}
                onToggle={(t) => dispatch(toggleTag(t))}
                showCount
              />
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                  {loading ? "Searching..." : (
                    <>
                      <strong className="text-foreground">{total.toLocaleString()}</strong> {total === 1 ? "RESULT" : "RESULTS"}
                      {query && <> for &ldquo;<strong className="text-foreground">{query}</strong>&rdquo;</>}
                      {totalPages > 1 && <> &mdash; PAGE {page}</>}
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">SORT BY</span>
                  <select
                    data-testid="select-sort"
                    value={sortBy}
                    onChange={(e) => dispatch(setSortBy(e.target.value))}
                    className="text-sm font-medium border-0 bg-transparent text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="relevant">Relevant</option>
                    <option value="newest">Newest</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeFilters.types.map((t) => (
                    <button key={`type-${t}`} onClick={() => dispatch(toggleType(t))} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-sm hover:bg-primary/20 transition-colors">
                      {t} <X className="h-3 w-3" />
                    </button>
                  ))}
                  {activeFilters.categories.map((c) => (
                    <button key={`cat-${c}`} onClick={() => dispatch(toggleCategory(c))} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-sm hover:bg-primary/20 transition-colors">
                      {c} <X className="h-3 w-3" />
                    </button>
                  ))}
                  {activeFilters.tags.map((t) => (
                    <button key={`tag-${t}`} onClick={() => dispatch(toggleTag(t))} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-sm hover:bg-primary/20 transition-colors">
                      #{t} <X className="h-3 w-3" />
                    </button>
                  ))}
                  {activeFilters.author && (
                    <button onClick={() => dispatch(setAuthorFilter(""))} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-sm hover:bg-primary/20 transition-colors">
                      {activeFilters.author} <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b pb-6 animate-pulse">
                      <div className="h-4 bg-muted rounded w-20 mb-3" />
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full mb-1" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && hasSearched && results.length === 0 && (
                <div className="text-center py-20">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="font-serif text-xl font-bold mb-2">No results found</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Try different keywords or remove some filters.
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => dispatch(clearAllFilters())}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}

              {/* Results List */}
              {!loading && results.length > 0 && (
                <div>
                  {results.map((result) => (
                    <SearchResultCard key={`${result.sourceType}-${result.sourceId}`} result={result} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t">
                  <button
                    disabled={page <= 1}
                    onClick={() => dispatch(setPage(page - 1))}
                    className="h-9 px-4 border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-prev-page"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => dispatch(setPage(p))}
                      className={`h-9 w-9 text-sm font-medium transition-colors ${
                        p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
                      }`}
                      data-testid={`button-page-${p}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => dispatch(setPage(page + 1))}
                    className="h-9 px-4 border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-next-page"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
