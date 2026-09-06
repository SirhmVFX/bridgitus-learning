"use client";

function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v") || u.pathname.split("/embed/")[1];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export default function QuestionVideo({
  url,
  name,
  className = "mb-6",
}: {
  url: string;
  name?: string;
  className?: string;
}) {
  const embed = embedUrl(url);

  return (
    <div className={className}>
      {embed ? (
        <div className="relative w-full overflow-hidden border border-gray-200 bg-black" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={embed}
            title={name || "Question video"}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <video
          src={url}
          controls
          playsInline
          className="w-full max-h-72 border border-gray-200 bg-black"
        />
      )}
      {name && <p className="text-xs text-gray-500 mt-1">{name}</p>}
    </div>
  );
}
