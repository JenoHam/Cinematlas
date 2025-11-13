import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import VideoBackground from "./VideoBackground";
import SearchBar from "./SearchBar";
import TrendingRow from "./TrendingRow";

function Landing() {
  const [bgPulse, setBgPulse] = useState(0);

  function handleNavSelect(name) {
    // you can also navigate based on `name` later
    setBgPulse((n) => n + 1);
  }

  function handleSearchSelect(item) {
    // could also route to a details page later
    setBgPulse((n) => n + 1);
    console.log("Selected from search:", item);
  }

  return (
    <motion.div
      className="h-dvh overflow-x-hidden relative text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Navbar onNavSelect={handleNavSelect} />
      <VideoBackground pulseTrigger={bgPulse} />

      <section className="h-[36vh] grid place-items-center px-4 pb-4 relative z-20">
        <div className="translate-y-10 md:translate-y-20">
        <SearchBar onSelect={handleSearchSelect} />
        </div>
      </section>

      <div className="px-4">
        <TrendingRow />
      </div>

      <footer className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs text-white/60">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </motion.div>
  );
}

export default Landing;



