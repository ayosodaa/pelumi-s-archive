// Turns a normal sharing link into a link that can be shown inside the page.
// Many services only allow embedding through a special URL, so this rewrites
// the common ones. Anything it does not recognise is returned unchanged.

export function toEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname;

  // Google Docs, Sheets, Slides, Forms
  if (host === "docs.google.com") {
    const published = path.match(/^\/(document|spreadsheets|presentation)\/d\/e\/([^/]+)/);
    if (published) {
      const [, kind, id] = published;
      if (kind === "document") return `https://docs.google.com/document/d/e/${id}/pub?embedded=true`;
      if (kind === "spreadsheets") return `https://docs.google.com/spreadsheets/d/e/${id}/pubhtml?widget=true&headers=false`;
      return `https://docs.google.com/presentation/d/e/${id}/embed?start=false&loop=false`;
    }
    const form = path.match(/^\/forms\/d\/e\/([^/]+)/);
    if (form) return `https://docs.google.com/forms/d/e/${form[1]}/viewform?embedded=true`;
    const doc = path.match(/^\/(document|spreadsheets|presentation)\/d\/([^/]+)/);
    if (doc) {
      const [, kind, id] = doc;
      if (kind === "presentation") return `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false`;
      const gid = url.hash.match(/gid=(\d+)/)?.[1] ?? url.searchParams.get("gid");
      return `https://docs.google.com/${kind}/d/${id}/preview${gid ? `?gid=${gid}` : ""}`;
    }
  }

  // Google Drive files and folders
  if (host === "drive.google.com") {
    const file = path.match(/^\/file\/d\/([^/]+)/);
    if (file) return `https://drive.google.com/file/d/${file[1]}/preview`;
    const folder = path.match(/^\/drive\/(?:u\/\d+\/)?folders\/([^/?]+)/);
    if (folder) return `https://drive.google.com/embeddedfolderview?id=${folder[1]}#grid`;
    const id = url.searchParams.get("id");
    if (id) return `https://drive.google.com/file/d/${id}/preview`;
  }

  // Figma files, designs, prototypes and boards
  if (host === "figma.com" && /^\/(file|design|proto|board|slides)\//.test(path)) {
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url.toString())}`;
  }

  // Canva designs shared with "view" access
  if (host === "canva.com" && path.startsWith("/design/")) {
    const base = path.replace(/\/(edit|view|watch)\/?$/, "");
    return `https://www.canva.com${base}/view?embed`;
  }

  // Miro boards
  const miro = host === "miro.com" && path.match(/^\/app\/board\/([^/]+)/);
  if (miro) return `https://miro.com/app/live-embed/${miro[1]}/`;

  // Airtable shared views and forms
  if (host === "airtable.com" && !path.startsWith("/embed/") && /\/shr[A-Za-z0-9]+/.test(path)) {
    return `https://airtable.com/embed${path}`;
  }

  // YouTube and Loom
  if (host === "youtube.com" && url.searchParams.get("v")) return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
  if (host === "youtu.be") return `https://www.youtube.com/embed${path}`;
  const loom = host === "loom.com" && path.match(/^\/share\/([^/]+)/);
  if (loom) return `https://www.loom.com/embed/${loom[1]}`;

  return url.toString();
}
