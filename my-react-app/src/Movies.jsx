import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

const TMDB_IMG_LARGE = "https://image.tmdb.org/t/p/original";
const TMDB_IMG_THUMB = "https://image.tmdb.org/t/p/w342";
const V4 = import.meta.env.VITE_TMDB_V4_TOKEN;
const V3 = import.meta.env.VITE_TMDB_KEY;

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroTrailer, setHeroTrailer] = useState(null);
  const [activeModalTrailer, setActiveModalTrailer] = useState(null);

  // 1. Fetch Trending Movies
  useEffect(() => {
    async function fetchTrending() {
      try {
        const url = "https://api.themoviedb.org/3/trending/movie/week";
        const res = V4 
          ? await fetch(url, { headers: { Authorization: `Bearer ${V4}` } })
          : await fetch(`${url}?api_key=${V3}`);
        const data = await res.json();
        setMovies(data.results ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  // 2. Fetch Trailer for the Hero Movie whenever heroIndex changes
  useEffect(() => {
    if (movies.length > 0) {
      fetchHeroTrailer(movies[heroIndex].id);
    }
  }, [movies, heroIndex]);

  async function fetchHeroTrailer(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos`;
    const res = V4 
      ? await fetch(url, { headers: { Authorization: `Bearer ${V4}` } })
      : await fetch(`${url}?api_key=${V3}`);
    const data = await res.json();
    const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
    setHeroTrailer(trailer ? trailer.key : null);
  }

  const nextHero = () => {
    setHeroIndex((prev) => (prev + 1) % movies.length);
  };

  const currentHero = movies[heroIndex];

  return (
    <div className="min-h-dvh bg-zinc-950 text-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      {!loading && currentHero && (
        <section className="relative h-[70vh] w-full overflow-hidden bg-black">
          {/* Background: Video or Poster */}
          <div className="absolute inset-0 z-0">
            {heroTrailer ? (
              <iframe
                className="w-full h-full scale-[1.5] pointer-events-none"
                src={`https://www.youtube.com/embed/${heroTrailer}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroTrailer}&showinfo=0`}
                allow="autoplay"
              />
            ) : (
              <img 
                src={TMDB_IMG_LARGE + currentHero.backdrop_path} 
                className="w-full h-full object-cover opacity-50"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center h-full p-12 max-w-2xl">
            <motion.h1 
              key={currentHero.title}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-bold mb-4"
            >
              {currentHero.title}
            </motion.h1>
            <p className="text-lg text-gray-300 line-clamp-3 mb-6">
              {currentHero.overview}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={nextHero}
                className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-white/80 transition"
              >
                Next Movie
              </button>
            </div>
          </div>
        </section>
      )}

      {/* --- TRENDING GRID --- */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group cursor-pointer transition-transform hover:scale-105"
            >
              <img
                src={movie.poster_path ? TMDB_IMG_THUMB + movie.poster_path : "/placeholder.png"}
                alt={movie.title}
                className="rounded-xl shadow-lg border border-white/10"
              />
              <div className="mt-2 text-sm font-medium truncate">{movie.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Movies;
