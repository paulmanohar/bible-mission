export function toSlug(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

export function itemPath(type, id, title) {
  return `/${type}/${id}/${toSlug(title)}`;
}
