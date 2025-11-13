import Navbar from "./Navbar";
import VideoBackground from "./VideoBackground";
import SearchBar from "./SearchBar";
import TrendingRow from "./TrendingRow";

function Landing() {
  return (
    <div className="h-dvh overflow-hidden relative text-white">
      <Navbar />
      <VideoBackground />

    <section className="h-[36vh] grid place-items-center px-4">
    <div className="translate-y-10 md:translate-y-20">
        <SearchBar />
    </div>
    </section>

      <div className="px-4">
        <TrendingRow compact />
      </div>

      <footer className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs text-white/60">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}

export default Landing;
