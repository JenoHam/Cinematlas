import React from "react";

const Navbar = () => {
  const data = [
    { icon: "fas fa-film", name: "Movies" },
    { icon: "fas fa-tv", name: "TV Series" },
    { icon: "", name: "Soundtracks" },
    { icon: "fas fa-search", name: "Search" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-40">
      {/* slightly translucent bar so glow shows nicely */}
      <div className="relative h-16 bg-black/90 backdrop-blur-md">
        <div className="h-full flex items-center justify-end gap-40 pr-20">
          {data.map((Val) => (
            <button
              key={Val.name}
              className="
                relative px-4 py-1
                text-sm tracking-wide
                text-[#588acc]
                transition
                hover:text-[#eff3f8]
                hover:drop-shadow-[0_0_12px_rgba(34,211,238,.9)]
              "
            >
              {Val.icon && (
                <i className={`${Val.icon} mb-0.5`} aria-hidden="true" />
              )}
              <span>{Val.name}</span>

              {/* underline glow on hover */}
              <span
                className="
                  pointer-events-none
                  absolute left-1/2 top-full -translate-x-1/2
                  h-[2px] w-0 rounded-full
                  bg-[#023E8A]
                  shadow-[0_0_10px_rgba(34,211,238,.9)]
                  transition-all
                  group-hover:w-8
                "
              />
            </button>
          ))}
        </div>

        {/* bottom blend into the page */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-full h-16
                     bg-gradient-to-b from-[#060708] to-transparent"
        />
      </div>
    </nav>
  );
};

export default Navbar;
