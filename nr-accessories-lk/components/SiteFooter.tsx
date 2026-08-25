import React from 'react'
import { Link } from 'react-router-dom'
import { FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'

const COLUMNS = [
  { title: 'Shop', items: ['Cases & covers', 'Charging', 'Audio', 'Wearables', 'Clearance'] },
  { title: 'Support', items: ['Track my order', 'Delivery & fees', 'Returns & warranty', 'Contact us'] },
  { title: 'Company', items: ['About NR', 'Store locations', 'Dealer enquiries', 'Careers'] },
]

export function SiteFooter() {
  return (
    <footer className="mt-12 w-full border-t border-line bg-white sm:mt-16">
      <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6 lg:py-14">
        <div className="grid gap-8 border-b border-line pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-extrabold text-ink">
              nr accessories.lk<span className="text-brand-700">.lk</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Genuine phone accessories with warranty, shipped islandwide from our Colombo warehouse.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                011 234 5678
              </li>
              <li className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                hello@nraccessories.lk
              </li>
              <li className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                42 Main Street, Maradana, Colombo 10
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              {[FacebookIcon, InstagramIcon].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={index === 0 ? 'Facebook' : 'Instagram'}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-150 ease-soft hover:border-brand-600 hover:text-brand-700"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-display text-sm font-bold text-ink">{column.title}</h2>
              <ul className="mt-3 space-y-2.5">
                {column.items.map((item) => (
                  <li key={item}>
                    <Link
                      to="/shop"
                      className="text-sm text-ink-soft transition-colors duration-150 ease-soft hover:text-brand-700"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-faint">© 2026 nr accessories.lk — All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {['Visa', 'Mastercard', 'Amex', 'KOKO', 'Cash on delivery'].map((method) => (
              <span
                key={method}
                className="rounded-lg border border-line px-2.5 py-1 text-[11px] font-semibold text-ink-soft"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
