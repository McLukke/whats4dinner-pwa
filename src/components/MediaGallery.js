"use client";

import AsianPlaceholder from "./AsianPlaceholder";

export default function MediaGallery({ images = [], videoUrl }) {
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  return (
    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
      {videoId && (
        <div className="snap-start shrink-0 w-[85vw] max-w-sm aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Recipe video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}
      {images.map((src, i) => (
        <div
          key={i}
          className="snap-start shrink-0 w-[85vw] max-w-sm aspect-video rounded-xl overflow-hidden bg-neutral-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Recipe photo ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      {!videoId && images.length === 0 && (
        <div className="snap-start shrink-0 w-[85vw] max-w-sm aspect-video rounded-xl overflow-hidden">
          <AsianPlaceholder className="w-full h-full" />
        </div>
      )}
    </div>
  );
}
