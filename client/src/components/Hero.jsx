import { Link } from "wouter";

export default function Hero() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/90">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm mb-4" data-testid="badge-live">
            <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
            Live Services Available
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white tracking-tight leading-tight" data-testid="text-hero-title">
            Proclaiming the Truth, <br /> Transforming Lives.
          </h1>

          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Welcome to the official online home of Bible Mission. Explore the teachings of our Spiritual Father M.Devadas Ayyagaru, join our global community, and find daily spiritual nourishment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/resources">
              <span className="w-full sm:w-auto text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 inline-flex items-center justify-center font-medium cursor-pointer transition-colors" data-testid="button-explore-books">
                Explore Books & Teachings
              </span>
            </Link>
            <Link href="/meetings">
              <span className="w-full sm:w-auto text-lg px-8 py-4 border border-white text-white hover:bg-white/10 inline-flex items-center justify-center font-medium cursor-pointer backdrop-blur-sm transition-colors" data-testid="button-find-meetings">
                Find Upcoming Meetings
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
