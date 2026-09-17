import { SiteHeader } from "@/components/onboarding/header/header";
import { HeroSection } from "@/components/onboarding/hero/hero";
import { ApplicationSection } from "@/components/onboarding/application/application";
import { SiteFooter } from "@/components/onboarding/footer/footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[760px] px-4 min-[521px]:px-[30px]">
        <HeroSection />
        <ApplicationSection />
      </main>
      <SiteFooter />
    </>
  );
}
