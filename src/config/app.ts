export const APP_NAME = 'เงินตุง-เป๋าตัง'

export const PRIMARY_COLOR = '#3024AE'
export const SECONDARY_COLOR = '#C86CD7'

export const NAV_ITEMS = [
  { id: 'home', label: 'หน้าหลัก', href: '/', icon: 'Home' },
  { id: 'lottery', label: 'ลอตเตอรี่', href: '/lottery', icon: 'Ticket' },
  { id: 'cart', label: 'ตะกร้า', href: '/cart', icon: 'ShoppingBag' },
  { id: 'safe', label: 'ตู้เซฟ', href: '/safe', icon: 'Shield' },
  { id: 'profile', label: 'โปรไฟล์', href: '/profile', icon: 'User' },
] as const

export const FILTER_OPTIONS = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'หวยเดี่ยว', value: 'single' },
  { label: 'หวยชุด', value: 'set' },
] as const

export const QUICK_MENU = [
  { id: 'pray', label: 'จุดธูปขอเลข', icon: 'Sparkles', href: '/incense' },
  { id: 'dream', label: 'ทำนายฝัน', icon: 'Moon', href: '/dream' },
  { id: 'tree', label: 'ถูต้นไม้ขอเลข', icon: 'Leaf', href: '/tree-scratch' },
  { id: 'checker', label: 'ตรวจรางวัล', icon: 'ShieldCheck', href: '/safe' },
] as const

export const FOOTER_LINKS = [
  'เกี่ยวกับเรา',
  'บทความ/ข่าวสาร',
  'วิธีใช้งานระบบ & FAQ',
  'คุกกี้',
  'นโยบายและเงื่อนไข',
  'ติดต่อเรา',
] as const

export const CART_STEPS = [
  { id: 'cart', label: 'ตะกร้า' },
  { id: 'payment', label: 'เลือกช่องทางชำระ' },
  { id: 'checkout', label: 'ชำระเงิน' },
] as const
