import React from "react";

const Navbar = ({ onNavSelect }) => {
  const data = [
    { icon: "fas fa-film", name: "Movies" },
    { icon: "fas fa-tv", name: "TV Series" },
    { icon: "", name: "Soundtracks" },
    { icon: "fas fa-search", name: "Search" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-40">
      <div className="relative h-14 bg-black/80 backdrop-blur-md">
        <div className="h-full flex items-center justify-end gap-40 pr-16">
          {data.map((Val) => (
            <button
              key={Val.name}
              onClick={() => onNavSelect?.(Val.name)}
              className="group flex flex-col items-center text-[#467dc4] hover:text-[#e5eaf1] transition-colors"
            >
              {Val.icon && <i className={Val.icon} />}
              <span className="text-sm mt-1">{Val.name}</span>
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-full h-16 bg-gradient-to-b from-[#05070b] via-[#071b35] to-transparent" />
      </div>
    </nav>
  );
};

export default Navbar;


