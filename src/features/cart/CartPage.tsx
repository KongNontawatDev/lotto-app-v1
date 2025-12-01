import { motion } from 'framer-motion'

import { PageHeroBackground } from '@/components/layout/PageHeroBackground'
import { PageTransition } from '@/components/motion/PageTransition'
import { useCartStore } from '@/hooks/useCartStore'

import { CartList } from './components/CartList'
import { CartStepper } from './components/CartStepper'
import { CartSummary } from './components/CartSummary'
import { useCartQuery } from './hooks/useCartQuery'

export const CartPage = () => {
  const { isLoading } = useCartQuery()
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <PageTransition>
      <div className="flex flex-col">
        <PageHeroBackground title="ตะกร้าของฉัน" />
        
        {/* Content Card - overlaps hero background */}
        <div className="mx-auto w-full max-w-5xl px-4">
          <motion.div
            className="relative z-10 -mt-20 rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col gap-6">
              <CartStepper currentStep={0} />
              <CartList items={items} onRemove={removeItem} isLoading={isLoading} />
              {!isLoading && <CartSummary items={items} />}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

