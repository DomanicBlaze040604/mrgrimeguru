'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitive.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 sm:max-w-[400px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & {
    variant?: 'default' | 'success' | 'error' | 'warning'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-white border-[#D6E8ED]',
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
  }

  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-start gap-3',
        'rounded-xl border p-4 shadow-lg',
        'data-[state=open]:animate-in data-[state=open]:fade-in-80',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-80',
        'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform',
        'data-[swipe=end]:animate-out data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitive.Root.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold text-[#24333A]', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[#75828A] mt-0.5', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'ml-auto shrink-0 rounded-md p-1',
      'text-[#75828A] hover:text-[#24333A]',
      'focus:outline-none focus:ring-2 focus:ring-[#9FD8E8]',
      'transition-colors',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

// Toast hook for programmatic use
interface ToastState {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

let toastListeners: ((toasts: ToastState[]) => void)[] = []
let toastState: ToastState[] = []

export function toast({
  title,
  description,
  variant = 'default',
  duration = 4000,
}: Omit<ToastState, 'id'>) {
  const id = Date.now().toString()
  const newToast = { id, title, description, variant, duration }
  toastState = [...toastState, newToast]
  toastListeners.forEach((listener) => listener(toastState))

  setTimeout(() => {
    toastState = toastState.filter((t) => t.id !== id)
    toastListeners.forEach((listener) => listener(toastState))
  }, duration)
}

// Toaster component that renders toasts
export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastState[]>([])

  React.useEffect(() => {
    toastListeners.push(setToasts)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts)
    }
  }, [])

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, title, description, variant, duration }) => (
        <Toast key={id} variant={variant} duration={duration}>
          <div className="flex-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
