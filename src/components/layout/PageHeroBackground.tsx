interface PageHeroBackgroundProps {
  title?: string
  subtitle?: string
}

/**
 * Component สำหรับแสดงพื้นหลังด้านบนเหมือนหน้าแรก
 * ใช้สำหรับหน้าอื่นๆที่ไม่ใช่หน้าแรก
 * แสดงชื่อหน้าใน hero background เหมือนหน้าแรกและหน้าลอตเตอรี่
 */
export const PageHeroBackground = ({
  title,
  subtitle,
}: PageHeroBackgroundProps) => {
  return (
    <div className="relative">
      {/* Background Hero with curved design - extends behind TopNavbar */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-secondary/80 px-4 pb-28 pt-6 lg:-mt-16 lg:pt-24">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -left-8 top-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-12 bottom-20 h-20 w-20 rounded-full bg-secondary/30" />

        {/* Page Title - แสดงทั้งหน้าจอเล็กและใหญ่ */}
        {title && (
          <div className="relative z-10 mx-auto max-w-5xl text-center text-primary-foreground">
            <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm opacity-80">{subtitle}</p>
            )}
          </div>
        )}

        {/* Curved bottom - curve down */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0C240 60 480 80 720 80C960 80 1200 60 1440 0V80H0V0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

