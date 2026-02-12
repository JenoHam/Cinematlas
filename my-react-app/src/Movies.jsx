import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TMDB_IMG = "https://image.tmdb.org/t/p/w342";
const V4 = import.meta.env.VITE_TMDB_V4_TOKEN;
const V3 = import.meta.env.VITE_TMDB_KEY;

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const url = "https://api.themoviedb.org/3/trending/movie/week";

        let res;

        if (V4) {
          res = await fetch(url, {
            headers: { Authorization: `Bearer ${V4}` },
          });
        } else {
          res = await fetch(`${url}?api_key=${V3}`);
        }

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

  return (
    <motion.div
      className="min-h-dvh text-white p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="text-3xl font-semibold mb-6">
        Trending This Week
      </h1>

      {loading ? (
        <p className="text-white/60">Loading movies…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group cursor-pointer transition-transform hover:scale-105"
            >
              <img
                src={
                  movie.poster_path
                    ? TMDB_IMG + movie.poster_path
                    : "/placeholder.png"
                }
                alt={movie.title}
                className="rounded-xl shadow-lg"
              />
              <div className="mt-2 text-sm font-medium truncate">
                {movie.title}
              </div>
              <div className="text-xs text-white/60">
                {movie.release_date?.slice(0, 4)}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Movies;
