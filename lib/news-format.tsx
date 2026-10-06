import type { ReactNode } from "react";

export function formatNewsMonth(date: string) {
  const [year, month] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, 1)));
}

function renderLinkLabel(label: string) {
  return label.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part
  );
}

export function renderNewsText(text: string) {
  const parts: ReactNode[] = [];
  const tokens = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)|\*\*([^*]+)\*\*/g;
  let cursor = 0;

  for (const match of text.matchAll(tokens)) {
    const start = match.index;
    if (start > cursor) parts.push(text.slice(cursor, start));

    if (match[1] && match[2]) {
      const external = /^https?:\/\//.test(match[2]);
      parts.push(
        <a key={start} className="news-inline-link" href={match[2]} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
          {renderLinkLabel(match[1])}
        </a>
      );
    } else {
      parts.push(<strong key={start}>{match[3]}</strong>);
    }
    cursor = start + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}
