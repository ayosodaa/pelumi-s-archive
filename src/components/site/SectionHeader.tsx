export function SectionHeader({
  kicker,
  title,
  description,
  align = "left",
}: {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-5">
        {kicker}
      </p>
      <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-ink/65 text-pretty max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
