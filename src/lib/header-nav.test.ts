import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_NAV_LINKS,
  resolveActiveNavLinks,
  isNavLinkActive,
  getHeaderSurfaceState,
} from './header-nav'

test('resolveActiveNavLinks returns default links when navTabsJson is empty or invalid', () => {
  assert.deepEqual(resolveActiveNavLinks(null), DEFAULT_NAV_LINKS)
  assert.deepEqual(resolveActiveNavLinks('invalid json'), DEFAULT_NAV_LINKS)
  assert.deepEqual(resolveActiveNavLinks('[]'), DEFAULT_NAV_LINKS)
})

test('resolveActiveNavLinks filters disabled tabs and preserves highlight flag', () => {
  const customJson = JSON.stringify([
    { href: '/', label: 'الرئيسية', enabled: true },
    { href: '/disabled', label: 'مخفي', enabled: false },
    { href: '/category/offers', label: 'عروض خاصة', enabled: true, highlight: true },
  ])
  const resolved = resolveActiveNavLinks(customJson)
  assert.equal(resolved.length, 2)
  assert.equal(resolved[0].href, '/')
  assert.equal(resolved[1].highlight, true)
})

test('isNavLinkActive matches exact root and nested category paths accurately', () => {
  assert.equal(isNavLinkActive('/', '/'), true)
  assert.equal(isNavLinkActive('/shop', '/'), false)
  assert.equal(isNavLinkActive('/category/men', '/category/men'), true)
  assert.equal(isNavLinkActive('/category/men/watches', '/category/men'), true)
  assert.equal(isNavLinkActive('/category/women', '/category/men'), false)
})

test('getHeaderSurfaceState enables unified hero top mode on unscrolled homepage', () => {
  const homeTop = getHeaderSurfaceState({ pathname: '/', isScrolled: false })
  assert.equal(homeTop.isUnifiedHeroTop, true)
  assert.equal(homeTop.isStickyScrolled, false)
  assert.equal(homeTop.collapseTopAnnouncement, false)

  const homeScrolled = getHeaderSurfaceState({ pathname: '/', isScrolled: true })
  assert.equal(homeScrolled.isUnifiedHeroTop, false)
  assert.equal(homeScrolled.isStickyScrolled, true)
  assert.equal(homeScrolled.collapseTopAnnouncement, true)

  const innerPageTop = getHeaderSurfaceState({ pathname: '/shop', isScrolled: false })
  assert.equal(innerPageTop.isUnifiedHeroTop, false)
  assert.equal(innerPageTop.isStickyScrolled, false)
})
