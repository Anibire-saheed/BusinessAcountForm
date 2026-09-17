import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto w-full max-w-[760px] px-4 min-[521px]:px-[30px] flex items-center justify-between py-4">
        {/* Offset the logo’s internal 19px transparent left margin. */}
        <a className="-ml-[19px] inline-flex shrink-0" href="#">
          <Image
            src="/EhicaLogo.svg"
            alt="Ethica MFB"
            width={100}
            height={32}
            className="h-8 w-[100px]"
            priority
          />
        </a>
        <div className="text-[11px] text-muted-foreground min-[521px]:text-[13px]">
          Business account opening
        </div>
      </div>
    </header>
  );
}
