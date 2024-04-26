import { useProps } from "./useProps";
import { Layout, Props } from "./Layout";

export const Row = ({ title, fetchUrl }: Props) => {
  return <Layout title={title} {...useProps(fetchUrl, title)} />;
};
