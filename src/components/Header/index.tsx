import { useProps } from "./useProps";
import { Layout } from "./Layout";

export const Header = () => {
  return <Layout {...useProps()} />;
};
