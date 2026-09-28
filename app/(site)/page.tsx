import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeSections />
    </>
  );
}
