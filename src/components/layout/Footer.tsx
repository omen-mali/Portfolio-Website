export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Momen Ali. All rights reserved.
        </p>
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
