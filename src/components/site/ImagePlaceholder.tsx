import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  caption,
  className,
  aspect = "aspect-[4/3]",
  tone = "stone",
}: {
  caption?: string;
  className?: string;
  aspect?: string;
  tone?: "stone" | "earth" | "ink";
}) {
  const tones = {
    stone: "bg-stone text-ink/40",
    earth: "bg-earth/15 text-earth",
    ink: "bg-ink text-paper/50",
  } as const;
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-sm outline-1 -outline-offset-1 outline-ink/10 grid place-items-center",
        aspect,
        tones[tone],
        className,
      )}
    >
      <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(45deg,transparent_0_8px,currentColor_8px_9px)]" />
      <span className="relative text-[9px] font-mono uppercase tracking-[0.25em] px-3 text-center">
        {caption ?? "Archive plate"}
      </span>
    </div>
  );
}
