import React from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRightIcon, HeartIcon, PhoneIcon, UserIcon, XIcon } from 'lucide-react'
import { categories, navLinks } from '../data/catalog'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 h-full w-full bg-ink/40"
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <Link to="/" onClick={onClose} className="font-display text-base font-extrabold text-ink">
                nr accessories<span className="text-brand-700">.lk</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft"
              >
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ul className="flex flex-wrap gap-2 border-b border-line p-4">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="inline-flex rounded-full bg-canvas px-3 py-1.5 text-xs font-semibold text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="px-4 pt-4 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Categories
              </p>
              <ul className="px-2 pb-4">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/shop?c=${category.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between gap-2 rounded-xl px-2 py-3 text-sm text-ink active:bg-canvas"
                    >
                      <span>{category.name}</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-ink-faint">
                        {category.count}
                        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 border-t border-line px-4 py-4">
              <div className="flex gap-2">
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white"
                >
                  <UserIcon className="h-4 w-4" aria-hidden="true" />
                  Sign in
                </Link>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line-strong py-3 text-sm font-semibold text-ink"
                >
                  <HeartIcon className="h-4 w-4" aria-hidden="true" />
                  Wishlist
                </Link>
              </div>
              <p className="flex items-center gap-2 text-xs text-ink-soft">
                <PhoneIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Hotline 070 388 8085 · 9am–7pm daily
              </p>
            </div>
          </motion.nav>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
