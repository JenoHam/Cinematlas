import React from "react";

const Navbar = () => {
  const data = [
    { icon: "fas fa-film", name: "Movies" },
    { icon: "fas fa-tv", name: "TV Series" },
    { icon: "", name: "Soundtrack" },
    { icon: "fas fa-search", name: "Search" },
  ];

//   return (
//     <div className="fixed top-0 left-0 right-0 z-40">
//       <div className="flex justify-center gap-60 bg-gradient-to-b from-[#023E8A] to-black/60 p-4">
//         {data.map((Val) => (
//           <button
//             key={Val.name}
//             className="flex flex-col items-center text-white hover:text-[#023E8A]"
//           >
//             <i className={`${Val.icon}`}></i>
//             <span className="text-sm mt-1">{Val.name}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

  return (
    <nav className="fixed inset-x-0 top-0 z-40">
      {/* Give the bar a fixed height so we can place the fade precisely */}
      <div className="relative h-14 bg-black/80 backdrop-blur-md">
        {/* nav items row, vertically centered in the bar */}
        <div className="h-full flex items-center justify-center gap-24">
          {data.map((Val) => (
            <button
              key={Val.name}
              className="flex flex-col items-center text-white hover:text-[#023E8A] transition-colors"
            >
              <i className={`${Val.icon}`} />
              <span className="text-sm mt-1">{Val.name}</span>
            </button>
          ))}
        </div>

        {/* *** THE BLEND *** — starts at the exact bottom of the bar and fades down */}
        <div className="pointer-events-none absolute left-0 right-0 top-full h-16
                        bg-gradient-to-b from-[#0b1b2b] via-[#023E8A]/35 to-transparent" />
      </div>
    </nav>
  );
};

export default Navbar;