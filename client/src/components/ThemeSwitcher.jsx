import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/slices/themeSlice";
import { Palette, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const previewColors = {
  classic: "bg-[hsl(215,25%,15%)]",
  blue: "bg-[hsl(217,71%,45%)]",
  green: "bg-[hsl(152,55%,28%)]",
};

export default function ThemeSwitcher() {
  const dispatch = useDispatch();
  const { active, themes } = useSelector((s) => s.theme);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-muted rounded transition-colors"
        data-testid="button-theme-switcher"
        title="Switch Theme"
      >
        <Palette className="h-5 w-5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border shadow-lg rounded-md overflow-hidden z-50" data-testid="dropdown-theme">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Theme</p>
          </div>
          {themes.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                dispatch(setTheme(t.key));
                setOpen(false);
              }}
              data-testid={`button-theme-${t.key}`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left ${
                active === t.key ? "bg-muted/50 font-medium" : ""
              }`}
            >
              <span className={`w-4 h-4 rounded-full shrink-0 border border-border ${previewColors[t.key]}`} />
              <span className="flex-1">{t.label}</span>
              {active === t.key && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
