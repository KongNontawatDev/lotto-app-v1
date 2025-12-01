interface SectionHeadingProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const SectionHeading = ({
  title,
  subtitle,
  action,
}: SectionHeadingProps) => (
  <div className="flex flex-wrap items-end justify-between gap-2">
    <div>
      {subtitle && (
        <p className="text-xs uppercase tracking-wide text-primary/70">
          {subtitle}
        </p>
      )}
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    {action}
  </div>
)
