import { useProps } from "./useProps";

import { Layout } from "./Layout";
import { Movie } from "../../type";

export const Banner = () => {
    // ①propsをスプレッド構文で渡す
    return <Layout {...useProps()} />;
};