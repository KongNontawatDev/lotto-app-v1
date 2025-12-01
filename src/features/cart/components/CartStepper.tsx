import { CART_STEPS } from '@/config/app'

interface CartStepperProps {
  currentStep?: number
}

export const CartStepper = ({ currentStep = 0 }: CartStepperProps) => (
  <ol className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
    {CART_STEPS.map((step, index) => {
      const isActive = index === currentStep
      const isCompleted = index < currentStep
      return (
        <li
          key={step.id}
          className="flex items-center gap-3 text-sm font-semibold"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition ${
              isActive
                ? 'border-primary bg-primary text-white'
                : isCompleted
                  ? 'border-secondary bg-secondary text-secondary-foreground'
                  : 'border-border text-muted-foreground'
            }`}
          >
            {index + 1}
          </span>
          <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>
            {step.label}
          </span>
        </li>
      )
    })}
  </ol>
)

