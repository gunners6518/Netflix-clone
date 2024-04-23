import { useProps } from "./useProps";
import { Layout } from "./Layout";

export const Banner = () => {
  return <Layout {...useProps()} />;
};
