import type { Movie } from "@/lib/tmdb";

type BannerProps = {
  movie: Movie | null;
};

function truncate(str: string | undefined, n: number): string {
  if (!str) {
    return "";
  }
  if (str.length > n) {
    return str.substr(0, n - 1) + "...";
  } else {
    return str;
  }
}

export function Banner({ movie }: BannerProps) {
  if (!movie) {
    return null;
  }

  return (
    <header
      className="relative text-white object-contain h-[80vh] min-h-[500px]"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-8 md:px-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold pb-4 drop-shadow-2xl">
            {movie.name}
          </h1>
          <div className="w-full md:w-[45rem] leading-relaxed pt-4 text-base md:text-lg max-w-[560px]">
            {truncate(movie.overview, 200)}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradual-gradient" />
    </header>
  );
}

