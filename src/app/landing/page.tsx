import { LandingPage } from "@/components/pages/landing-page";
import { resolveHeroMedia } from "@/lib/media-resolver";

export const runtime = "nodejs";

export default async function LandingRoute() {
  const media = await resolveHeroMedia();

  return <LandingPage media={media} />;
}
