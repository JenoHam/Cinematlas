import { useEffect, useRef, useState } from "react";

const IMG_BASE = "https://image.tmdb.org/t/p/";
const POSTER_SIZE = "w342";

// inline SVG fallback
const placeholder =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='228' height='342'>
      <rect width='100%' height='100%' fill='#0b1220'/>
      <text x='50%' y='50%' fill='#7aa7c7' font-size='14' text-anchor='middle' dy='.3em'>
        No Poster
      </text>
    </svg>`
  );

function TrendingRow() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // scroller + animation refs
  const trackRef = useRef(null);
  const rafRef = useRef(null);

  // === Fetch (v4 first, fallback to v3) ===
  useEffect(() => {
    const CACHE_KEY = "tmdb-trending-day-v2";
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setItems(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();
    (async () => {
      const V3 = import.meta.env.VITE_TMDB_KEY;        // short v3 key
      const V4 = import.meta.env.VITE_TMDB_V4_TOKEN;   // long JWT starting with eyJ…

      try {
        const endpoint =
          "https://api.themoviedb.org/3/trending/movie/day?language=en-US";

        // try v4
        const res = await fetch(endpoint, {
          signal: ctrl.signal,
          headers: V4 ? { Authorization: `Bearer ${V4}` } : undefined,
        });

        // fallback to v3 if v4 absent/failed
        const finalRes =
          res.ok || V4
            ? res
            : await fetch(`${endpoint}&api_key=${V3}`, { signal: ctrl.signal });

        if (!finalRes.ok) throw new Error(`TMDB ${finalRes.status}`);

        const json = await finalRes.json();

        const results = (json?.results ?? [])
          .slice(0, 18)
          .map((r) => ({
            id: `movie-${r.id}`,
            title: r.title ?? "Untitled",
            year: (r.release_date || "").slice(0, 4),
            poster: r.poster_path
              ? `${IMG_BASE}${POSTER_SIZE}${r.poster_path}`
              : placeholder,
          }));

        setItems(results);
        if (results.length) {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(results));
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setError(e.message || "Failed to load trending");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  // === Hover-to-scroll helpers ===
  function startAutoScroll(dir = 1) {
    stopAutoScroll();
    const el = trackRef.current;
    if (!el) return;

    const speed = 450 * dir; // px/sec
    let last = performance.now();

    const step = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      el.scrollLeft += speed * dt;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }

  function stopAutoScroll() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  function nudge(px) {
    trackRef.current?.scrollBy({ left: px, behavior: "smooth" });
  }

  const showArrows = items.length > 0;

  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto mt-16 px-4">
      <header className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Trending</h2>
        <span className="text-xs text-white/60">Data by TMDB • Movies</span>
      </header>

      {error && (
        <p className="mt-4 text-sm text-red-300/80">{error}</p>
      )}

      <div className="relative group mt-4">
        {/* Left arrow */}
        {showArrows && (
          <button
            aria-label="Scroll left"
            onMouseEnter={() => startAutoScroll(-1)}
            onMouseLeave={stopAutoScroll}
            onFocus={() => startAutoScroll(-1)}
            onBlur={stopAutoScroll}
            onClick={() => nudge(-350)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20
                       hidden md:flex items-center justify-center
                       h-10 w-10 rounded-full bg-black/50 ring-1 ring-white/20
                       opacity-0 group-hover:opacity-100 transition hover:bg-black/60"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={trackRef}
          className="overflow-x-auto no-scrollbar scroll-smooth"
        >
          <ul className="flex gap-4 pb-2 snap-x snap-mandatory">
            {(loading ? Array.from({ length: 10 }) : items).map((it, i) => {
              if (loading) {
                return (
                  <li key={`sk-${i}`} className="min-w-[228px] snap-start animate-pulse">
                    <div className="w-[180px] h-[270px] rounded-xl bg-white/10" />
                    <div className="h-4 mt-2 w-40 rounded bg-white/10" />
                  </li>
                );
              }
              return (
                <li key={it.id} className="min-w-[180px] snap-start">
                    <div className="relative w-[180px]">
                        <img
                            src={it.poster || placeholder}
                            alt={`${it.title} poster`}
                            className="w-[180px] h-[270px] rounded-xl object-cover ring-1 ring-white/10
                                        transform transition-transform duration-300
                                        hover:scale-[1.05]
                                        hover:drop-shadow-[0_0_22px_rgba(255,255,255,0.9)]"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = placeholder;
                            }}
                        />
                    </div>
                    <p className="mt-2 text-sm leading-tight line-clamp-2">{it.title}</p>
                    <p className="text-xs text-white/60">{it.year}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right arrow */}
        {showArrows && (
          <button
            aria-label="Scroll right"
            onMouseEnter={() => startAutoScroll(1)}
            onMouseLeave={stopAutoScroll}
            onFocus={() => startAutoScroll(1)}
            onBlur={stopAutoScroll}
            onClick={() => nudge(350)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20
                       hidden md:flex items-center justify-center
                       h-10 w-10 rounded-full bg-black/50 ring-1 ring-white/20
                       opacity-0 group-hover:opacity-100 transition hover:bg-black/60"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default TrendingRow;

