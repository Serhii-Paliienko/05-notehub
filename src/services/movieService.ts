import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";

interface SearchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<SearchMoviesResponse> {
  const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;
  if (!token) {
    throw new Error("Missing TMDB token");
  }

  const { data } = await axios.get<SearchMoviesResponse>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
  });

  return {
    results: Array.isArray(data?.results) ? data.results : [],
    total_pages: typeof data?.total_pages === "number" ? data.total_pages : 0,
  };
}
