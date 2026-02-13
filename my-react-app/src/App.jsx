import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Navbar from "./Navbar";
import Movies from "./Movies";
import TV from "./TV";
import Soundtracks from "./Soundtracks";
import MainVidBackground from "./MainVidBackground";

function App() {
  return (
    <> 
      <Navbar/>
      <MainVidBackground/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv" element={<TV />} />
        <Route path="/soundtracks" element={<Soundtracks />} />
      </Routes>
  </>
  );
}

export default App;