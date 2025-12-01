import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterOption {
  label: string
  value: string
}

interface FilterChipsProps {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export const FilterChips = ({
  options,
  value,
  onChange,
  className,
}: FilterChipsProps) => (
  <div className={cn('flex flex-wrap gap-2', className)}>
    {options.map((option) => (
      <Button
        key={option.value}
        size="sm"
        variant={option.value === value ? 'default' : 'ghost'}
        className={cn(
          'rounded-full border',
          option.value === value
            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
            : 'border-border/40 bg-transparent text-muted-foreground hover:text-primary',
        )}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </Button>
    ))}
  </div>
)
