import { useEffect, useState } from "react";
import axios from "../../axios";

// ②データの整形
export type Movie = {
    id: string;
    name: string;
    poster_path: string;
    backdrop_path: string;
};

export const useProps = (fetchUrl: string) => {
    const [movies, setMovies] = useState<Movie[]>([]);

    // ①APIの取得はuseEffectを使う
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            // ②データの整形
            const movies = request.data.results.map((movie: Movie) => ({
                id: movie.id,
                name: movie.name,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
            }));
            setMovies(movies);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    return movies;
};