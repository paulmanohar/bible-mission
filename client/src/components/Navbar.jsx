import { Link, useLocation } from "wouter";
import { useSelector } from "react-redux";
import { Menu, X, User, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Resources", href: "/resources" },
    { label: "Meetings", href: "/meetings" },
    { label: "Connect", href: "/connect" },
  ];

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <button
            className="md:hidden mr-2 p-2 hover:bg-muted rounded transition-colors"
            onClick={() => setMobileOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/">
            <span className="font-serif text-2xl font-bold tracking-tight cursor-pointer" data-testid="link-logo">Bible Mission</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/search">
              <span className="p-2 hover:bg-muted rounded transition-colors cursor-pointer" data-testid="button-search">
                <Search className="h-5 w-5 text-muted-foreground" />
              </span>
            </Link>
            <Link href="/connect">
              <span className="hidden lg:inline-flex items-center h-9 px-4 border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer" data-testid="button-join">
                Join as Pastor/Member
              </span>
            </Link>
            <Link href={isAuthenticated ? "/profile" : "/login"}>
              <span className="inline-flex items-center h-9 px-4 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer" data-testid="button-login">
                <User className="mr-2 h-4 w-4" />
                {isAuthenticated ? user?.fullName?.split(" ")[0] : "Login"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background flex flex-col">
          <div className="flex items-center justify-between px-4 h-20 border-b">
            <Link href="/" onClick={closeMenu}>
              <span className="font-serif text-2xl font-bold tracking-tight cursor-pointer">Bible Mission</span>
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 hover:bg-muted rounded transition-colors"
              data-testid="button-close-menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col px-6 pt-8 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="block py-4 text-xl font-medium hover:text-primary border-b border-border/50 transition-colors cursor-pointer"
                  onClick={closeMenu}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/search">
              <span className="block py-4 text-xl font-medium hover:text-primary border-b border-border/50 transition-colors cursor-pointer" onClick={closeMenu} data-testid="link-mobile-search">
                Search
              </span>
            </Link>
          </nav>

          <div className="px-6 pb-8 space-y-3">
            <Link href="/connect">
              <span className="block w-full text-center py-3 border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer" onClick={closeMenu} data-testid="link-mobile-join">
                Join as Pastor/Member
              </span>
            </Link>
            <Link href={isAuthenticated ? "/profile" : "/login"}>
              <span className="block w-full text-center py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer" onClick={closeMenu} data-testid="link-mobile-login">
                <User className="inline mr-2 h-4 w-4" />
                {isAuthenticated ? user?.fullName?.split(" ")[0] : "Login"}
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
