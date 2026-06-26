function cleanFilename(value) {
  return value
    .split("/")
    .at(-1)
    .replace(/\.(png|jpe?g|webp|svg|pdf)$/i, "")
    .replace(/\.(png|jpe?g)$/i, "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createImageMeta(src, options = {}) {
  const title = options.title || cleanFilename(src);
  const index = options.index ?? 0;

  return {
    src,
    title,
    date: options.date || "Date available in source proof",
    category: options.category || "Proof asset",
    alt: options.alt || `${title} proof image`,
    caption: options.caption || `${title} proof image ${index + 1}.`,
    featured: Boolean(options.featured),
    priority: Boolean(options.priority ?? options.featured)
  };
}

export function imageSrc(image) {
  return typeof image === "string" ? image : image.src;
}

export function imageAlt(image, fallback) {
  return typeof image === "string" ? fallback : image.alt || fallback;
}

export function imageCaption(image, fallback) {
  return typeof image === "string" ? fallback : image.caption || image.alt || fallback;
}
