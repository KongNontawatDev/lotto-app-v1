import { FOOTER_LINKS } from '@/config/app'

export const Footer = () => (
  <footer className="px-4 pt-8 pb-24 lg:pb-28 border-t border-border/60 bg-card text-sm mt-3">
    <div className="mx-auto flex max-w-5xl flex-col gap-4 text-center sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <span className="font-semibold text-primary">เงินตุง-เป๋าตัง</span>
      <ul className="flex flex-1 flex-wrap items-center justify-center gap-3 text-muted-foreground text-xs sm:text-sm">
        {FOOTER_LINKS.map((link) => (
          <li key={link}>
            <button
              type="button"
              className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full px-3 py-1"
            >
              {link}
            </button>
          </li>
        ))}
      </ul>
      <span className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} เงินตุง-เป๋าตัง
      </span>
    </div>
  </footer>
)
