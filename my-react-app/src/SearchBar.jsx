import { useEffect, useMemo, useRef, useState } from "react";
import { Combobox } from "@headlessui/react";
import {MagnifyingGlassIcon, CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/outline";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/multi";
const TMDB_IMG ="https://image.tmdb.org/t/p/w92";

function labelFor(item){
    //TMDB fields for movies vs tv vs persom
    return item.media_type === "tv" ? item.name : item.title ?? item.name ?? "";
}

function badgeFor(type){
    if(type === "movie") return "Movie";
    if(type === "tv") return "TV";
    if(type === "person") return "Person";
    return "Unknown";
}

export default function SearchBar({onSelect}){
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const abortRef = useRef(null);

    const displayList = useMemo(() => {
        if(!query.trim()) return [];
        return results;
    }, [query, results]);

    useEffect(() => {
        if(abortRef.current) abortRef.current.abort();

        //Oly search when at least 2 characters are typed
        if(query.trim().length < 2){
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        const id = setTimeout(async () => {
            try {
                const url = new URL(TMDB_SEARCH_URL);
                url.searchParams.set("api_key", TMDB_KEY);
                url.searchParams.set("query", query.trim());
                url.searchParams.set("include_adult", "false");
                url.searchParams.set("language", "en-US");
                url.searchParams.set("page", "1");

                const res = await fetch(url.toString(), {signal: ctrl.signal});
                if (!res.ok) throw new Error(`TMDB ${res.status}`);
                const json = await res.json();

                const mapped = (json.results ?? [])
                .filter(r => ["movie", "tv", "person"].includes(r.media_type))
                .map(r => ({
                    id: `${r.media_type}-${r.id}`,
                    media_type: r.media_type,
                    title: labelFor(r),
                    poster: r.poster_path || r.profile_path ? TMDB_IMG + (r.poster_path || r.profile_path) : null,
                    year:
                        r.release_date?.slice(0, 4) ??
                        r.first_air_date?.slice(0, 4) ??
                        "",
                    raw: r,
                }));

                setResults(mapped);
            } catch (e) {
                if(e.name !== "AbortError"){
                    console.error(e);
                    setResults([]);
                }
            }   finally {
                setLoading(false);
            }
        }, 300);

        return() => {
            clearTimeout(id);
            ctrl.abort();
        };
    }, [query]);

    function handleChange(item) {
        setSelected(item);
        onSelect?.(item);
    }

  return (
    <div className="w-full max-w-xl">
      <Combobox value={selected} onChange={handleChange}>
        <div className="relative">
          {/* Input */}
          <div className="relative w-full overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-indigo-400">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <Combobox.Input
              className="w-full bg-transparent py-3 pl-10 pr-10 text-white placeholder:text-white/50 focus:outline-none"
              displayValue={(item) => item?.title ?? ""}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Movies, TV, Soundtracks, People…"
              autoComplete="off"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-white/60" />
            </Combobox.Button>
          </div>

          {/* Loading / No results bubbles */}
          {loading && (
            <div className="absolute z-50 mt-2 w-full rounded-xl bg-gray-800/95 px-3 py-2 text-sm text-white/70 ring-1 ring-black/20 backdrop-blur">
              Searching…
            </div>
          )}

          {!loading && displayList.length === 0 && query.trim().length >= 2 && (
            <div className="absolute z-50 mt-2 w-full rounded-xl bg-gray-800/95 px-3 py-2 text-sm text-white/70 ring-1 ring-black/20 backdrop-blur">
              No results for “{query}”
            </div>
          )}

          {/* Options */}
          {displayList.length > 0 && (
            <Combobox.Options className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl bg-gray-800/95 p-1 shadow-2xl ring-1 ring-black/20 backdrop-blur">
              {displayList.map((item) => (
                <Combobox.Option
                  key={item.id}
                  value={item}
                  className={({ active }) =>
                    `flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                      active ? "bg-indigo-600 text-white" : "text-white/90"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt=""
                          className="h-10 w-7 rounded object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-10 w-7 rounded bg-white/10" />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="truncate">{item.title}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-white/60">
                          <span className="rounded bg-white/10 px-1.5 py-0.5">
                            {badgeFor(item.media_type)}
                          </span>
                          {item.year && <span>{item.year}</span>}
                        </div>
                      </div>

                      {selected && <CheckIcon className="h-4 w-4" />}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
}