import { useProps } from "./useProps";
import { Layout, Props } from "./Layout";

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
    const movies = useProps(fetchUrl);

    return <Layout title={title} movies={movies} isLargeRow={isLargeRow} />;
};