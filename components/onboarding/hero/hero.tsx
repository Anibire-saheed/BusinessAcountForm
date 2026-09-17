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
      <div className="mt-7 grid grid-cols-[1.2fr_0.8fr_1.5fr] gap-2 border-t border-border pt-6 min-[521px]:flex min-[521px]:gap-[30px]">
        <div className="min-w-0 whitespace-nowrap text-[clamp(9px,2.5vw,11px)] leading-snug text-muted-foreground min-[521px]:text-[13px]">
          <strong className="mb-0.5 block font-sans text-[18px] font-medium text-primary min-[521px]:text-[22px]">
            3
          </strong>
          business structures
        </div>
        <div className="min-w-0 whitespace-nowrap text-[clamp(9px,2.5vw,11px)] leading-snug text-muted-foreground min-[521px]:text-[13px]">
          <strong className="mb-0.5 block font-sans text-[18px] font-medium text-primary min-[521px]:text-[22px]">
            ~15 min
          </strong>
          to complete
        </div>
        <div className="min-w-0 whitespace-nowrap text-[clamp(9px,2.5vw,11px)] leading-snug text-muted-foreground min-[521px]:text-[13px]">
          <strong className="mb-0.5 block font-sans text-[18px] font-medium text-primary min-[521px]:text-[22px]">
            1
          </strong>
          page, no account needed
        </div>
      </div>
    </section>
  );
}
