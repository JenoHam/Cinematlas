import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onNavSelect }) => {
  const data = [
    { icon: "fas fa-film", name: "Movies" },
    { icon: "fas fa-tv", name: "TV Series" },
    { icon: "", name: "Soundtracks" },
    { icon: "fas fa-search", name: "Search" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-40">
      <div className="relative h-16 bg-black backdrop-blur-md">
        <div className="h-full flex items-center justify-between pr-8">
          {/* LEFT: LOGO */}
          <div className="flex items-center gap-2 translate-y-1">
            <img
              src="/photos/cinelogo2.png"
              alt="Cinematlas logo"
              className="h-10 w-auto object-contain md:h-25"
            />
          </div>

          {/* RIGHT: NAV BUTTONS */}
          <div className="flex items-center gap-16">
            {data.map((Val) => {
              let path = "/";

              if (Val.name === "Movies") path = "/movies";
              if (Val.name === "TV Series") path = "/tv";
              if (Val.name === "Soundtracks") path = "/soundtracks";
              if (Val.name === "Search") path = "/search";

              return (
                <Link
                  key={Val.name}
                  to={path}
                  className="group flex flex-col items-center text-[#467dc4] hover:text-[#e5eaf1] transition-colors"
                  >
                  {Val.icon && <i className={Val.icon} />}
                  <span className="text-sm mt-1">{Val.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-full h-10 bg-gradient-to-b from-[#05070b] via-[#071b35] to-transparent" />
      </div>
    </nav>
  );
};

export default Navbar;

