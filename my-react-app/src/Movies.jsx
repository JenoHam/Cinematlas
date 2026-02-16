import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

const TMDB_IMG_LARGE = "https://image.tmdb.org/t/p/original";
const TMDB_IMG_THUMB = "https://image.tmdb.org/t/p/w342";
const V4 = import.meta.env.VITE_TMDB_V4_TOKEN;
const V3 = import.meta.env.VITE_TMDB_KEY;

// --- REUSABLE ROW COMPONENT ---
const MovieRow = ({ title, genreId }) => {
  const [movies, setMovies] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchByGenre() {
      // Logic to fetch trending if no genreId is provided, otherwise fetch genre
      const url = genreId 
        ? `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`
        : `https://api.themoviedb.org/3/trending/movie/week`;

      const res = V4
        ? await fetch(url, { headers: { Authorization: `Bearer ${V4}` } })
        : await fetch(`${url}${url.includes('?') ? '&' : '?'}api_key=${V3}`);
      
      const data = await res.json();
      setMovies(data.results || []);
    }
    fetchByGenre();
  }, [genreId]);

  {/*--- MOVIE GENRE ROWS --- */}
  const displayedMovies = showAll ? movies : movies.slice(0, 7);

  return (
    <div className="mb-10 px-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar">
        {displayedMovies.map((movie) => (
          <div key={movie.id} className="min-w-[120px] sm:min-w-[150px] flex-shrink-0 transition-transform hover:scale-105 cursor-pointer">
            <img 
              src={movie.poster_path ? TMDB_IMG_THUMB + movie.poster_path : "/placeholder.png"} 
              className="rounded-lg shadow-md border border-white/5" 
              alt={movie.title} 
            />
            <p className="mt-2 text-xl font-medium truncate w-full">{movie.title}</p>
          </div>
        ))}

        {!showAll && movies.length > 7 && (
          <button 
            onClick={() => setShowAll(true)}
            className="min-w-[120px] sm:min-w-[150px] flex-shrink-0 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-lg border-2 border-dashed border-white/20 transition-colors"
          >
            <span className="text-white/60 font-semibold">View More →</span>
          </button>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroTrailer, setHeroTrailer] = useState(null);

  const genres = [
    { id: 28, name: "Action Hits" },
    { id: 35, name: "Comedy Central" },
    { id: 27, name: "Horror Nights" },
    { id: 878, name: "Sci-Fi Adventures" }
  ];

  // Fetch initial list for the Hero section
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

  // Fetch Trailer for Hero
  useEffect(() => {
    if (movies.length > 0) {
      async function fetchHeroTrailer() {
        const movieId = movies[heroIndex].id;
        const url = `https://api.themoviedb.org/3/movie/${movieId}/videos`;
        const res = V4 
          ? await fetch(url, { headers: { Authorization: `Bearer ${V4}` } })
          : await fetch(`${url}?api_key=${V3}`);
        const data = await res.json();
        const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        setHeroTrailer(trailer ? trailer.key : null);
      }
      fetchHeroTrailer();
    }
  }, [movies, heroIndex]);

  const currentHero = movies[heroIndex];

  return (
    <div className="min-h-dvh bg-zinc-950 text-white overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      {!loading && currentHero && (
        <section className="relative h-[75vh] w-full overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            {heroTrailer ? (
              <iframe
                className="w-full h-full scale-[1.4] pointer-events-none opacity-60"
                src={`https://www.youtube.com/embed/${heroTrailer}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroTrailer}&showinfo=0`}
                allow="autoplay"
              />
            ) : (
              <img 
                src={TMDB_IMG_LARGE + currentHero.backdrop_path} 
                className="w-full h-full object-cover opacity-40"
              />
            )}
            {/* Gradient blend to make the bottom look professional */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full p-12 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">{currentHero.title}</h1>
                <p className="text-lg text-gray-300 line-clamp-3 mb-6 drop-shadow-md">
                  {currentHero.overview}
                </p>
                <button 
                  onClick={() => setHeroIndex((prev) => (prev + 1) % movies.length)}
                  className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition active:scale-95"
                >
                  Next Preview
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* --- MOVIE ROWS --- */}
      <div className="relative z-20 -mt-20">
        <MovieRow title="Trending Now" genreId="" />
        {genres.map((genre) => (
          <MovieRow key={genre.id} title={genre.name} genreId={genre.id} />
        ))}
      </div>
    </div>
  );
}

export default Movies;
