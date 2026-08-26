import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDownIcon,
  HeartIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserIcon,
  XIcon,
} from 'lucide-react'
import { navLinks } from '../data/catalog'
import { MobileMenu } from './MobileMenu'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-line bg-white">
        <div className="hidden bg-brand-900 text-white md:block">
          <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-between gap-4 px-4 text-[12px] lg:px-6">
            <p className="flex items-center gap-1.5">
              <TruckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Free islandwide delivery on orders over Rs 7,500
            </p>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <PhoneIcon className="h-3.5 w-3.5" aria-hidden="true" />
                011 234 5678
              </span>
              <Link to="/shop" className="hover:underline">
                Track order
              </Link>
              <Link to="/shop" className="hover:underline">
                Help centre
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 sm:gap-4 lg:px-6 lg:py-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-ink lg:hidden"
          >
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 font-display text-sm font-extrabold text-white sm:h-10 sm:w-10"
            >
              nr
            </span>
            <span className="leading-none">
              <span className="block font-display text-[15px] font-extrabold tracking-tight text-ink sm:text-lg">
                nr accessories.lk<span className="text-brand-700">.lk</span>
              </span>
              <span className="mt-0.5 hidden text-[11px] text-ink-faint sm:block">
                Mobile accessories store
              </span>
            </span>
          </Link>

          <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className="ml-4 hidden flex-1 items-center rounded-xl border border-line-strong bg-canvas focus-within:border-brand-600 md:flex"
          >
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              id="site-search"
              type="search"
              placeholder="Search cases, chargers, earbuds…"
              className="h-11 w-full bg-transparent px-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="m-1 flex h-9 w-11 items-center justify-center rounded-lg bg-brand-700 text-white transition-colors duration-150 ease-soft hover:bg-brand-800"
            >
              <SearchIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-ink md:hidden"
            >
              {searchOpen ? (
                <XIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className="hidden items-center gap-2 rounded-xl px-2 py-2 text-[13px] font-medium text-ink-soft transition-colors duration-150 ease-soft hover:text-brand-700 lg:flex"
            >
              <UserIcon className="h-5 w-5" aria-hidden="true" />
              Sign in
            </button>
            <button
              type="button"
              aria-label="Wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-ink-soft transition-colors duration-150 ease-soft hover:text-brand-700 sm:flex"
            >
              <HeartIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-[13px] font-semibold text-brand-800 transition-colors duration-150 ease-soft hover:bg-brand-100"
            >
              <span className="relative">
                <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-2 -top-2 rounded-full bg-sale px-1.5 text-[10px] font-bold text-white">
                  3
                </span>
              </span>
              <span className="hidden lg:inline">Rs 14,301</span>
            </Link>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {searchOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden border-t border-line md:hidden"
            >
              <form
                role="search"
                onSubmit={(event) => event.preventDefault()}
                className="flex items-center gap-2 px-4 py-3"
              >
                <label htmlFor="mobile-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="mobile-search"
                  type="search"
                  autoFocus
                  placeholder="Search products…"
                  className="h-11 w-full rounded-xl border border-line-strong bg-canvas px-4 text-sm focus:border-brand-600 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white"
                >
                  <SearchIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <nav aria-label="Categories" className="hidden border-t border-line lg:block">
          <div className="mx-auto flex max-w-[1280px] items-center gap-1 px-6">
            <button
              type="button"
              className="flex items-center gap-2 border-r border-line py-3 pr-5 text-[13px] font-semibold text-ink"
            >
              <MenuIcon className="h-4 w-4" aria-hidden="true" />
              All categories
              <ChevronDownIcon className="h-4 w-4 text-ink-faint" aria-hidden="true" />
            </button>
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="rounded-lg px-3 py-3 text-[13px] font-medium text-ink-soft transition-colors duration-150 ease-soft hover:text-brand-700"
              >
                {link.label}
              </NavLink>
            ))}
            <span className="ml-auto text-[12px] font-semibold text-sale">
              Flash deals end in 04:12:39
            </span>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
