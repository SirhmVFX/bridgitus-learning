import type { MetadataRoute } from "next";
import { SEO_PAGES, SUBJECTS } from "@/lib/marketingContent";

const BASE = "https://www.bridgitus.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/pricing",
    "/contact",
    "/classes",
    "/community",
    "/projects",
    "/Training",
    "/register",
    "/guides",
    "/guides/understanding-learning-gaps",
    "/guides/reading-progress-reports",
    "/guides/tutoring-that-proves-results",
    "/terms-and-conditions",
    "/privacy-policy",
    "/privacy-and-data-protection",
    "/code-of-conduct",
    ...SEO_PAGES.map((p) => p.href),
    ...SUBJECTS.map((s) => `/subjects/${s.slug}`),
  ];

  const now = new Date();
  return staticRoutes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/smart-learning-passport" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.includes("passport") || path === "/features" ? 0.9 : 0.7,
  }));
}
