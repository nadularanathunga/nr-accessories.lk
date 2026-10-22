import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}

const VARIANTS: Record<string, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900',
  secondary: 'border border-line-strong bg-white text-ink hover:border-brand-600 hover:text-brand-700',
  ghost: 'text-brand-700 hover:bg-brand-50',
  dark: 'bg-ink text-white hover:bg-ink-soft',
}

const SIZES: Record<string, string> = {
  sm: 'min-h-[44px] h-11 px-4 text-[13px]',
  md: 'min-h-[44px] h-11 px-5 text-sm',
  lg: 'min-h-[48px] h-12 px-6 text-sm sm:h-14 sm:px-8 sm:text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  disabled = false,
  form,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-display font-semibold tracking-tight transition-colors duration-150 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
        VARIANTS[variant]
      } ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}