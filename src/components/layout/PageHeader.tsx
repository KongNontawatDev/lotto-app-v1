interface PageHeaderProps {
  title: string
  subtitle?: string
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <header className="hidden lg:block lg:sticky lg:top-16 z-40 border-b border-border/40 bg-background/80 backdrop-blur shadow-sm">
    <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-4">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          {subtitle ?? 'เงินตุง-เป๋าตัง'}
        </p>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </div>
  </header>
)
