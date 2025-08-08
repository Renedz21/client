import { useQuery } from "@tanstack/react-query";
import { getImages, type IImageItem } from "@/lib/api";

export default function ImageCard() {
  const {
    data: images,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<IImageItem>({
    queryKey: ["images"],
    queryFn: getImages,
  });

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse h-40 w-full rounded-lg bg-muted"
          />
        ))}
      </>
    );
  }

  if (isError) {
    return (
      <div className="col-span-full flex items-center justify-between rounded-lg border p-4 text-sm">
        <span>
          Error loading images
          {error instanceof Error ? `: ${error.message}` : ""}
        </span>
        <button
          className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!images || images.data === undefined) {
    return (
      <div className="col-span-full rounded-lg border p-6 text-center text-sm text-muted-foreground">
        No images uploaded yet.
      </div>
    );
  }

  return (
    <>
      {images.data.map((image) => (
        <figure
          key={image.publicId}
          className="group relative h-40 w-full overflow-hidden rounded-lg border"
        >
          <img
            src={image.url}
            alt={image.originalName || ""}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/40 p-2 text-[11px] text-white">
            <span className="line-clamp-1">{image.originalName}</span>
          </figcaption>
        </figure>
      ))}
    </>
  );
}
