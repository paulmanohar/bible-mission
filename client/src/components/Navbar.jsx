import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X, User, Search, Palette, Check } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { setTheme } from "../store/slices/themeSlice";

const mobilePreviewColors = {
  classic: "bg-[hsl(215,25%,15%)]",
  blue: "bg-[hsl(217,71%,45%)]",
  green: "bg-[hsl(152,55%,28%)]",
};

function MobileThemePicker() {
  const dispatch = useDispatch();
  const { active, themes } = useSelector((s) => s.theme);
  return (
    <div className="flex items-center gap-2 py-2">
      <Palette className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground mr-1">Theme:</span>
      {themes.map((t) => (
        <button
          key={t.key}
          onClick={() => dispatch(setTheme(t.key))}
          data-testid={`button-mobile-theme-${t.key}`}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${mobilePreviewColors[t.key]} ${
            active === t.key ? "border-foreground scale-110" : "border-transparent opacity-70 hover:opacity-100"
          }`}
          title={t.label}
        >
          {active === t.key && <Check className="h-3.5 w-3.5 text-white" />}
        </button>
      ))}
    </div>
  );
}

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
    { label: "Broadcasts", href: "/#broadcasts" },
    { label: "Meetings", href: "/meetings" },
    { label: "Connect", href: "/connect" },
  ];

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <button
            className="md:hidden mr-2 p-2 hover:bg-muted rounded transition-colors"
            onClick={() => setMobileOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link to="/">
            <span className="font-serif text-2xl font-bold tracking-tight cursor-pointer" data-testid="link-logo">Bible Mission</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <ThemeSwitcher />
            <Link to="/search">
              <span className="p-2 hover:bg-muted rounded transition-colors cursor-pointer" data-testid="button-search">
                <Search className="h-5 w-5 text-muted-foreground" />
              </span>
            </Link>
            <Link to="/connect">
              <span className="hidden lg:inline-flex items-center h-9 px-4 border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer" data-testid="button-join">
                Join as Pastor/Member
              </span>
            </Link>
            <Link to={isAuthenticated ? "/profile" : "/login"}>
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
            <Link to="/" onClick={closeMenu}>
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
              <Link key={link.href} to={link.href}>
                <span
                  className="block py-4 text-xl font-medium hover:text-primary border-b border-border/50 transition-colors cursor-pointer"
                  onClick={closeMenu}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link to="/search">
              <span className="block py-4 text-xl font-medium hover:text-primary border-b border-border/50 transition-colors cursor-pointer" onClick={closeMenu} data-testid="link-mobile-search">
                Search
              </span>
            </Link>
          </nav>

          <div className="px-6 pb-8 space-y-3">
            <MobileThemePicker />
            <Link to="/connect">
              <span className="block w-full text-center py-3 border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer" onClick={closeMenu} data-testid="link-mobile-join">
                Join as Pastor/Member
              </span>
            </Link>
            <Link to={isAuthenticated ? "/profile" : "/login"}>
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
