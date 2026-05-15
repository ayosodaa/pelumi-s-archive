import { useState } from "react";
import type { GalleryImage } from "@/lib/db";

export function Gallery({ images, title }: { images: GalleryImage[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!images.length) return null;
  return (
    <div>
      {title && (
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">{title}</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setOpen(i)}
            className="group relative overflow-hidden bg-stone aspect-[4/5]"
          >
            <img
              src={img.url}
              alt={img.caption ?? ""}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] bg-ink/95 grid place-items-center p-6"
          onClick={() => setOpen(null)}
        >
          <figure className="max-w-5xl w-full">
            <img src={images[open].url} alt={images[open].caption ?? ""} className="w-full max-h-[80vh] object-contain" />
            {images[open].caption && (
              <figcaption className="mt-4 text-paper/70 text-sm font-mono uppercase tracking-[0.22em] text-center">
                {images[open].caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}
