import React, { useMemo, useState } from "react";

interface Movie {
  id: number;
  title: string;
  rating: number;
  genre: string;
}

interface Challenge4Props {
  initialCount?: number;
}

const ROW_HEIGHT = 40;
const LIST_HEIGHT = 500;

const generateMovies = (count: number): Movie[] => {
  const genres = ["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Romance"];
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    title: `Movie ${index + 1}`,
    rating: parseFloat((Math.random() * 5).toFixed(1)),
    genre: genres[Math.floor(Math.random() * genres.length)],
  }));
};

// Note: rendering a simple list here; filtering is memoized above.

const Challenge4: React.FC<Challenge4Props> = ({ initialCount = 100000 }) => {
  const [movies] = useState<Movie[]>(() => generateMovies(initialCount));
  const [search, setSearch] = useState("");

  const filteredMovies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q)
    );
  }, [movies, search]);

  const [scrollTop, setScrollTop] = useState(0);
  const visibleSlotCount = Math.ceil(LIST_HEIGHT / ROW_HEIGHT) + 5; // overscan
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT));
  const visibleMovies = filteredMovies.slice(
    startIndex,
    Math.min(filteredMovies.length, startIndex + visibleSlotCount)
  );

  return (
    <div style={{ padding: 20 }} data-testid="challenge4-root">
      <h1 data-testid="challenge4-title">
        Challenge 4: Filtered Virtualized Movies
      </h1>

      <p data-testid="challenge4-description">
        This list renders <strong>{initialCount.toLocaleString()}</strong>{" "}
        movies using a virtualized <code>List</code>. Use the search box and
        observe that scrolling stays smooth.
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Notice the lag when rendering a large list.</li>
          <li>Implement list virtualization using react-window.</li>
          <li>
            Observe the improved performance and scrolling after optimization.
          </li>
        </ol>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 16,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
        data-testid="challenge4-controls"
      >
        <label
          style={{ display: "flex", flexDirection: "column", gap: 4 }}
          data-testid="challenge4-search-label"
        >
          Search by title or genre
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Movie 123 or Action"
            style={{ padding: "6px 8px", minWidth: 200 }}
            data-testid="challenge4-search-input"
          />
        </label>

        <div style={{ fontSize: 14 }} data-testid="challenge4-count">
          Showing <strong>{filteredMovies.length.toLocaleString()}</strong>{" "}
          movies
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontStyle: "italic",
          }}
          data-testid="challenge4-empty"
        >
          No movies match your filters.
        </div>
      ) : (
        <div
          className="list-wrapper"
          style={{ height: LIST_HEIGHT, border: "1px solid #ddd", overflow: "auto" }}
          data-testid="challenge4-list-wrapper"
          onScroll={(e) => setScrollTop((e.target as HTMLElement).scrollTop)}
        >
          <div style={{ height: filteredMovies.length * ROW_HEIGHT, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: startIndex * ROW_HEIGHT,
                left: 0,
                right: 0,
              }}
            >
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {visibleMovies.map((movie) => (
                  <li
                    key={movie.id}
                    data-testid={`movie-row-${movie.id}`}
                    style={{
                      height: ROW_HEIGHT,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                      borderBottom: "1px solid #eee",
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{ flex: 1 }}>{movie.title} - {movie.genre}</div>
                    <div style={{ width: 80, textAlign: "right" }}>{movie.rating} ★</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenge4;
