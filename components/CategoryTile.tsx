import React from 'react'
import { Link } from 'react-router-dom'
import {
  BatteryChargingIcon,
  CableIcon,
  CarIcon,
  Gamepad2Icon,
  HeadphonesIcon,
  PlugIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  WatchIcon,
  WrenchIcon,
} from 'lucide-react'
import type { Category } from '../data/catalog'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone: SmartphoneIcon,
  ShieldCheck: ShieldCheckIcon,
  Plug: PlugIcon,
  Cable: CableIcon,
  BatteryCharging: BatteryChargingIcon,
  Headphones: HeadphonesIcon,
  Watch: WatchIcon,
  Car: CarIcon,
  Gamepad2: Gamepad2Icon,
  Wrench: WrenchIcon,
}

export function CategoryTile({ category }: { category: Category }) {
  const Icon = ICONS[category.icon] ?? SmartphoneIcon

  return (
    <Link
      to="/shop"
      className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white px-3 py-4 text-center transition-colors duration-150 ease-soft hover:border-brand-600 hover:bg-brand-50 sm:gap-3 sm:py-6"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 sm:h-14 sm:w-14">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
      <span>
        <span className="block font-display text-[12px] font-semibold leading-snug text-ink sm:text-sm">
          {category.name}
        </span>
        <span className="mt-0.5 block text-[11px] text-ink-faint">{category.count} items</span>
      </span>
    </Link>
  )
}
