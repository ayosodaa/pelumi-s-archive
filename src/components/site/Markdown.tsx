import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

// Renders article bodies written in Markdown, styled to match the archive's
// serif editorial look. Plain text with blank lines between paragraphs (the
// old format) renders exactly as before.
export function Markdown({ children, className }: { children: string | null | undefined; className?: string }) {
  return (
    <div className={cn("prose-archive", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...rest }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <figure>
              <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" />
              {alt ? <figcaption>{alt}</figcaption> : null}
            </figure>
          ),
        }}
      >
        {children ?? ""}
      </ReactMarkdown>
    </div>
  );
}
