import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Movies from "./Movies";
import TV from "./TV";
import Soundtracks from "./Soundtracks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/tv" element={<TV />} />
      <Route path="/soundtracks" element={<Soundtracks />} />
    </Routes>
  );
}

export default App;