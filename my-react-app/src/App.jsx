/*import here*/
import "./index.css";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'
import Navbar from "./Navbar";
import VideoBackground from "./VideoBackground";
import SearchBar from "./SearchBar";

function App() {

  return (
    <div className="h-screen text-white overflow-hidden">
      {/* Fixed navbar */}
      <Navbar />

      {/* Video background */}
      <VideoBackground />

      {/* Full-screen search bar area */}
      <main className="h-screen flex items-center justify-center px-4">
        <SearchBar onSelect={(item) => console.log(item)} />
      </main>

      <footer className="absolute bottom-2 w-full text-center text-xs text-white/60">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
};

export default App
