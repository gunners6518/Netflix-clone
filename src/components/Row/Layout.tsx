import { Movie } from "./useProps.ts";

type LayoutProps = {
    title: string;
    movies: Movie[];
    isLargeRow?: boolean;
};

export const Layout = ({ title, movies, isLargeRow }: LayoutProps) => {
    const image_url = "https://image.tmdb.org/t/p/original";
    return (
        <div className="ml-5 text-white">
            <h2>{title}</h2>
            <div className="flex overflow-y-hidden overflow-x-scroll p-5 scrollbar-hide">
                {movies.map((movie: Movie) => (
                    // ①DOM表示にmapを使う際はkeyを必ず設定する
                    <img
                        key={movie.id}
                        // ②使用する画像を使い分ける
                        className={`object-contain w-full max-h-24 m-2 transform transition-transform duration-450 ${
                            isLargeRow ? "max-h-60 hover:scale-110" : "hover:scale-108"
                        }`}
                        src={`${image_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name}
                    />
                ))}
            </div>
        </div>
    );
};
