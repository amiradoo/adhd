import fs from "node:fs/promises";
import path from "node:path";

import type { HeroMedia } from "@/lib/site-types";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

const publicDir = path.join(process.cwd(), "public");

function toPublicPath(relativePath: string): string {
  return `/${relativePath.replaceAll(path.sep, "/")}`;
}

async function fileExists(absolutePath: string): Promise<boolean> {
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(relativeDir: string): Promise<string[]> {
  const dir = path.join(publicDir, relativeDir);

  try {
    const files = await fs.readdir(dir, { withFileTypes: true });

    return files
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

function isImage(filename: string): boolean {
  return imageExtensions.has(path.extname(filename).toLowerCase());
}

async function firstImage(relativeDir: string): Promise<string | null> {
  const files = await listFiles(relativeDir);
  const match = files.find(isImage);

  if (!match) return null;
  return toPublicPath(path.join(relativeDir, match));
}

async function imageList(relativeDir: string, limit = 3): Promise<string[]> {
  const files = await listFiles(relativeDir);

  return files
    .filter(isImage)
    .slice(0, limit)
    .map((file) => toPublicPath(path.join(relativeDir, file)));
}

export async function resolveHeroMedia(): Promise<HeroMedia> {
  const heroVideoRelative = path.join("videos", "hero.mp4");
  const heroVideoAbsolute = path.join(publicDir, heroVideoRelative);
  const videoExists = await fileExists(heroVideoAbsolute);

  const fallbackBackground = await firstImage("backgrounds");
  const fallbackCoverCandidates = [
    fallbackBackground,
    (await fileExists(path.join(publicDir, "images", "ebook-cover.jpg"))) ? "/images/ebook-cover.jpg" : null,
    (await fileExists(path.join(publicDir, "images", "ebook-cover.png"))) ? "/images/ebook-cover.png" : null,
    "/next.svg",
  ].filter(Boolean) as string[];

  const foregroundSrc = await firstImage("foregrounds");
  const uiElementSrcs = await imageList("ui-elements", 4);

  return {
    heroVideoSrc: videoExists ? toPublicPath(heroVideoRelative) : null,
    heroPosterSrc: fallbackCoverCandidates[0] ?? "/next.svg",
    foregroundSrc,
    uiElementSrcs,
  };
}
