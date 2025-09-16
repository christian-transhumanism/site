module.exports = {
  layout: "associationPage",
  eleventyComputed: {
    // Flag explicit permalinks set in frontmatter
    hasExplicitPermalink: (data) => !!data.permalink,
    permalink: (data) => {
      // Respect explicit permalinks set in a page
      if (data.permalink) return data.permalink;

      const stem = (data.page && data.page.filePathStem) ? String(data.page.filePathStem) : "";
      // Expect stems like "/obsidian/board/…"
      if (!stem.startsWith("/obsidian/board/")) return data.permalink;

      // Build /board/… path preserving nested folders (slugified)
      const afterBoard = stem.replace(/^\/obsidian\/board\//, "");
      const segments = afterBoard.split("/").filter(Boolean);
      const slugifySeg = (s) => s
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/--+/g, "-");

      const slugged = segments.map((seg, i) => {
        // Use Eleventy's computed fileSlug for the leaf if available, but ensure full slugification
        if (i === segments.length - 1 && data.page && data.page.fileSlug) {
          return slugifySeg(String(data.page.fileSlug));
        }
        return slugifySeg(seg);
      });

      return "/board/" + slugged.join("/") + "/";
    },
  },
};
