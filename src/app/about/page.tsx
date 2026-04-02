import { AboutPage } from "@/components/pages/about-page";
import { resolveHeroMedia } from "@/lib/media-resolver";

export const runtime = "nodejs";

export default async function AboutRoute() {
  const media = await resolveHeroMedia();

  return <AboutPage media={media} />;
}
