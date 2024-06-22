import { useProps } from "./useProps";
import { Layout } from "./Layout";

export const Banner = () => {
  // ①propsをスプレッド構文で渡す
  return <Layout {...useProps()} />;
};