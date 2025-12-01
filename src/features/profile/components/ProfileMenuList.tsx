import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  ChevronRight,
  Contact,
  Home,
  Mail,
  NotebookPen,
  Send,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'

const menuItems = [
  { id: 'personal', label: 'ข้อมูลส่วนตัว', icon: Users },
  { id: 'bank', label: 'บัญชีธนาคาร', icon: NotebookPen },
  { id: 'address', label: 'ที่อยู่ของฉัน', icon: Home },
  { id: 'points', label: 'แต้มของฉัน', icon: Star, href: '/points' },
  { id: 'news', label: 'ข่าวสาร', icon: Mail },
  { id: 'support', label: 'ติดต่อเจ้าหน้าที่', icon: Contact },
  { id: 'terms', label: 'ข้อตกลงและเงื่อนไข', icon: ShieldCheck },
  { id: 'guide', label: 'ข้อควรรู้ก่อนซื้อลอตเตอรี่', icon: BookOpen },
  { id: 'refer', label: 'แนะนำเพื่อน', icon: Send },
]

export const ProfileMenuList = () => (
  <ul className="rounded-3xl border border-border/40 bg-card shadow-sm">
    {menuItems.map((item) => {
      const Wrapper = item.href ? Link : 'button'
      const wrapperProps = item.href
        ? { to: item.href }
        : { type: 'button' as const }

      return (
        <li key={item.id} className="border-b border-border/40 last:border-none">
          <Wrapper
            {...wrapperProps}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="flex items-center gap-3">
              <item.icon className="text-primary" size={18} />
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Wrapper>
        </li>
      )
    })}
  </ul>
)

