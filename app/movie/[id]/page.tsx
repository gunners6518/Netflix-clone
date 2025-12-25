import { MovieDetail } from "@/app/components/MovieDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  return <MovieDetail movieId={id} isModal={false} />;
}

