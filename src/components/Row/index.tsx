import { useProps } from "./useProps";
import { Layout, Props } from "./Layout";

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
    const results = useProps(fetchUrl);

    return <Layout 
                title={title}
                movies={results.movies} 
                isLargeRow={isLargeRow} 
                handleClick={results.handleClick}
                trailerUrl={results.trailerUrl}
            />;
};