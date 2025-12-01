import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import type { UserProfile } from '@/types'

interface ProfileOverviewProps {
  profile?: UserProfile
  isLoading?: boolean
}

export const ProfileOverview = ({
  profile,
  isLoading,
}: ProfileOverviewProps) => {
  if (isLoading) {
    return (
      <section className="flex flex-col items-center gap-3 rounded-3xl border border-border/40 bg-card p-6 text-center shadow-sm">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
      </section>
    )
  }

  if (!profile) return null
  return (
    <section className="flex flex-col items-center gap-3 rounded-3xl border border-border/40 bg-card p-6 text-center shadow-sm">
      <Avatar className="h-20 w-20 border-2 border-primary">
        <AvatarImage src={profile.avatar} alt={profile.name} />
        <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold">{profile.name}</h2>
        <p className="text-sm text-muted-foreground">{profile.loyaltyLevel}</p>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>โทร {profile.phone}</p>
        <p>{profile.email}</p>
      </div>
    </section>
  )
}

