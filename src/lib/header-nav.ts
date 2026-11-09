export interface NavLinkItem {
  href: string
  label: string
  highlight?: boolean
}

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { href: '/', label: 'الرئيسية' },
  { href: '/shop', label: 'كل المنتجات' },
  { href: '/category/men', label: 'هدايا رجالية' },
  { href: '/category/women', label: 'هدايا نسائية' },
  { href: '/category/occasions', label: 'مناسبات خاصة' },
  { href: '/category/custom', label: 'هدايا مخصصة' },
  { href: '/category/offers', label: 'عروض وتخفيضات', highlight: true },
]

export function resolveActiveNavLinks(navTabsJson?: string | null): NavLinkItem[] {
  if (navTabsJson) {
    try {
      const parsed = JSON.parse(navTabsJson)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const enabledLinks = parsed
          .filter((t: { enabled?: boolean }) => t && t.enabled !== false)
          .map((t: { href?: string; label?: string; highlight?: boolean }) => ({
            href: t.href || '/',
            label: t.label || '',
            highlight: Boolean(t.highlight),
          }))
          .filter((t) => t.label.trim().length > 0)

        if (enabledLinks.length > 0) {
          return enabledLinks
        }
      }
    } catch {
      // Fallback to default links on malformed JSON
    }
  }
  return DEFAULT_NAV_LINKS
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (!pathname || !href) return false
  if (href === '/') {
    return pathname === '/'
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export interface HeaderSurfaceState {
  isUnifiedHeroTop: boolean
  isStickyScrolled: boolean
  collapseTopAnnouncement: boolean
}

export function getHeaderSurfaceState(params: {
  pathname: string
  isScrolled: boolean
}): HeaderSurfaceState {
  const isHome = params.pathname === '/'
  return {
    isUnifiedHeroTop: isHome && !params.isScrolled,
    isStickyScrolled: params.isScrolled,
    collapseTopAnnouncement: params.isScrolled,
  }
}
