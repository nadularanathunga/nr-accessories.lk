import React from 'react'
import { Link } from 'react-router-dom'
import { FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Shop',
    items: [
      { label: 'Cases & covers', to: '/shop?c=phone-cases' },
      { label: 'Charging', to: '/shop?c=chargers' },
      { label: 'Audio', to: '/shop?c=earbuds' },
      { label: 'Wearables', to: '/shop?c=smart-watches' },
      { label: 'Clearance Deals', to: '/shop' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Track my order', to: '/profile' },
      { label: 'Delivery & fees', to: '/shop' },
      { label: 'Returns & warranty', to: '/shop' },
      { label: 'Contact hotline', to: 'tel:0703888085' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About nr accessories', to: '/' },
      { label: 'Store locations', to: '/' },
      { label: 'Dealer enquiries', to: 'mailto:pamudithanadula@gmail.com' },
      { label: 'Warranty policy', to: '/' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-12 w-full border-t border-line bg-white sm:mt-16">
      <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6 lg:py-14">
        <div className="grid gap-8 border-b border-line pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-extrabold text-ink">
              nr accessories<span className="text-brand-700">.lk</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Genuine phone accessories with warranty, shipped islandwide from our Gampaha warehouse.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                <a href="tel:0703888085" className="hover:text-brand-700">070 388 8085</a>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                <a href="mailto:pamudithanadula@gmail.com" className="hover:text-brand-700">pamudithanadula@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                128/D, Helummahara, Dekatana
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              {[
                { Icon: FacebookIcon, label: 'Facebook', href: 'https://facebook.com' },
                { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-150 ease-soft hover:border-brand-600 hover:text-brand-700"
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
                  <li key={item.label}>
                    {item.to.startsWith('tel:') || item.to.startsWith('mailto:') ? (
                      <a
                        href={item.to}
                        className="text-sm text-ink-soft transition-colors duration-150 ease-soft hover:text-brand-700"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.to}
                        className="text-sm text-ink-soft transition-colors duration-150 ease-soft hover:text-brand-700"
                      >
                        {item.label}
                      </Link>
                    )}
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
