'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-semibold text-sm rounded-full',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[#166534] text-white',
          'hover:bg-[#14532D] hover:shadow-md',
          'active:scale-[0.98]',
          'focus-visible:ring-[#166534]',
        ],
        secondary: [
          'bg-[#DCFCE7] text-[#14532D]',
          'hover:bg-[#BBF7D0] hover:shadow-md',
          'active:scale-[0.98]',
          'focus-visible:ring-[#22C55E]',
        ],
        outline: [
          'border-2 border-[#166534] text-[#166534] bg-transparent',
          'hover:bg-[#166534] hover:text-white',
          'active:scale-[0.98]',
          'focus-visible:ring-[#166534]',
        ],
        ghost: [
          'text-[#14532D] bg-transparent',
          'hover:bg-[#F0FDF4]',
          'active:scale-[0.98]',
          'focus-visible:ring-[#166534]',
        ],
        destructive: [
          'bg-red-600 text-white',
          'hover:bg-red-700 hover:shadow-md',
          'active:scale-[0.98]',
          'focus-visible:ring-red-500',
        ],
        beige: [
          'bg-[#FEF3C7] text-[#92400E]',
          'hover:bg-[#FDE68A] hover:shadow-md',
          'active:scale-[0.98]',
          'focus-visible:ring-[#F59E0B]',
        ],
      },
      size: {
        xs: 'px-3 py-1.5 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        xl: 'px-10 py-5 text-base',
        icon: 'p-2',
        'icon-sm': 'p-1.5',
        'icon-lg': 'p-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(buttonVariants({ variant, size, className }), (children.props as any)?.className),
        ...props,
      })
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
