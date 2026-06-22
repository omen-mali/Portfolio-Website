import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-[#0e0e10]/40 px-6 py-8 backdrop-blur-[2.5px] md:px-12">
      <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <Logo markSize={40} />
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Momen Ali. All rights reserved.
          </p>
        </div>
        <nav aria-label="Footer links" className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/momen-m-ali/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/omen-mali"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in new tab)"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="mailto:momen.musa.ali@gmail.com"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
