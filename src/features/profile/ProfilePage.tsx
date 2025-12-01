import { motion } from 'framer-motion'

import { PageHeroBackground } from '@/components/layout/PageHeroBackground'
import { PageTransition } from '@/components/motion/PageTransition'

import { ProfileMenuList } from './components/ProfileMenuList'
import { ProfileOverview } from './components/ProfileOverview'
import { ThemeToggleCard } from './components/ThemeToggleCard'
import { useProfileQuery } from './hooks/useProfileQuery'

export const ProfilePage = () => {
  const { data: profile, isLoading } = useProfileQuery()

  return (
    <PageTransition>
      <div className="flex flex-col">
        <PageHeroBackground title="โปรไฟล์" />
        
        {/* Content Card - overlaps hero background */}
        <div className="mx-auto w-full max-w-4xl px-4">
          <motion.div
            className="relative z-10 -mt-20 rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col gap-6">
              <ProfileOverview profile={profile} isLoading={isLoading} />
              <ThemeToggleCard />
              <ProfileMenuList />
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

