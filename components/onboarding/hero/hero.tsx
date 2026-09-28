"use client";
import { Button } from "@/components/ui/button";
export function HeroSection() {
  return (
    <section className="py-[30px]">
      <h1 className="mb-[18px] max-w-[19ch] text-4xl leading-[1.12] font-medium text-primary min-[521px]:text-[40px]">
        Open your business account with everything in one place.
      </h1>
      <p className="mb-7 max-w-[52ch] text-[16px] text-muted-foreground">
        Tell us how your business is set up and we’ll show you exactly what to
        prepare documents, officer details and signatory information so your
        account can be opened without back-and-forth.
      </p>
      <Button
        type="button"
        className="cursor-pointer text-[15px]"
        onClick={() => document.getElementById("step-type")?.scrollIntoView()}
      >
        Start your application
      </Button>
    </section>
  );
}
