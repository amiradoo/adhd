import { HomePage } from "@/components/pages/home-page";
import { resolveHeroMedia } from "@/lib/media-resolver";

export const runtime = "nodejs";

export default async function HomeRoute() {
  const media = await resolveHeroMedia();

  return <HomePage media={media} />;
}
