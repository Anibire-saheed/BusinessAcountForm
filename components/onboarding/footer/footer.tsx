import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-5 border-t border-border pt-9 pb-[60px]">
      <div className="mx-auto w-full max-w-[760px] px-4 min-[521px]:px-[30px] flex flex-col gap-1.5">
        <Image
          src="/EhicaLogo.svg"
          alt="Ethica MFB"
          width={100}
          height={32}
          className="mb-2 h-8 w-[100px]"
        />
        <div className="text-sm">
          Questions about your application? Write to{" "}
          <a href="mailto:business@ethicamfb.com">business@ethicamfb.com</a>
        </div>
        <div className="mt-2.5 max-w-[60ch] text-[12.5px] text-muted-foreground">
          Ethica Microfinance Bank. All documents are held in confidence and
          used solely for account opening and regulatory compliance purposes.
        </div>
      </div>
    </footer>
  );
}
