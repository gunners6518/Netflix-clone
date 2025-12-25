import { MovieDetail } from "@/app/components/MovieDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ModalMoviePage({ params }: PageProps) {
  const { id } = await params;
  return <MovieDetail movieId={id} isModal={true} />;
}

