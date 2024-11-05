import { useProps } from "./useProps";
import { Layout} from "./Layout";

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
  return (
    <Layout title={title} isLargeRow={isLargeRow} {...useProps(fetchUrl)} />
  );
};
type Props = {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
};
