export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t border-foreground/10 text-center text-xs text-foreground/50 font-mono">
      <div className="flex flex-col gap-1 items-center justify-center">
        {/* 1. Calculation Method */}
        <p className="tracking-wide">
          Calculation Method: <span className="font-bold text-foreground/70">Moonsighting Committee</span>
        </p>

        {/* 2. Copyright & Made With Love */}
        <p>
          &copy; {currentYear} SalahTime. Made with <span className="text-red-500 animate-pulse">❤️</span> by <span className="font-bold text-foreground/80">Ashfaque Alam</span>
        </p>
        <div className="flex gap-4 text-xs underline decoration-dotted">
          <a href="mailto:ashfaquealam496@yahoo.com" className="hover:text-foreground">
            Feedback
          </a>
          {/* <a href="#" className="hover:text-foreground">
            About
          </a> */}
        </div>
      </div>
    </footer>
  );
}
