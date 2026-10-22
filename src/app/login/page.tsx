'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=/account/reset-password`,
        })
        if (error) throw error
        toast({ title: 'Reset email sent!', description: 'Check your inbox for the password reset link.', variant: 'success' })
        setMode('login')
        return
      }

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) throw error
        toast({
          title: 'Account created!',
          description: 'Check your inbox to verify your email.',
          variant: 'success',
          duration: 6000,
        })
        return
      }

      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      router.push(redirectTo)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      toast({ title: 'Error', description: msg, variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #E6F5F8 0%, #FAF8F2 60%, #F2EBE0 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#9FD8E8' }}>
            <span className="text-[#24333A] font-bold">G</span>
          </div>
          <span className="font-bold text-xl" style={{ color: '#24333A', fontFamily: 'var(--font-playfair)' }}>
            Mr <span style={{ color: '#347F99' }}>GrimeGuru</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#E6F5F8]">
          <h1 className="text-2xl font-bold text-[#24333A] mb-1 text-center">
            {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
          </h1>
          <p className="text-sm text-[#75828A] text-center mb-6">
            {mode === 'login'
              ? 'Sign in to your account'
              : mode === 'signup'
              ? 'Join Mr GrimeGuru'
              : 'Enter your email to reset your password'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#24333A] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#75828A]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D6E8ED] bg-[#FAF8F2] text-[#24333A] placeholder:text-[#75828A] text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8] transition-shadow"
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#24333A] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#75828A]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    minLength={8}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#D6E8ED] bg-[#FAF8F2] text-[#24333A] placeholder:text-[#75828A] text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8] transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75828A] hover:text-[#24333A] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-xs text-[#347F99] hover:text-[#24333A] transition-colors mt-1"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
            </Button>
          </form>

          {/* Mode switch */}
          <div className="mt-6 text-center">
            {mode === 'login' && (
              <p className="text-sm text-[#75828A]">
                Don&apos;t have an account?{' '}
                <button onClick={() => setMode('signup')} className="font-semibold text-[#347F99] hover:text-[#24333A] transition-colors">
                  Sign up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-sm text-[#75828A]">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-semibold text-[#347F99] hover:text-[#24333A] transition-colors">
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <button onClick={() => setMode('login')} className="text-sm text-[#347F99] hover:text-[#24333A] transition-colors">
                Back to sign in
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[#75828A] mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-[#347F99] hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-[#347F99] hover:underline">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #E6F5F8 0%, #FAF8F2 60%, #F2EBE0 100%)' }}>
          <div className="w-8 h-8 border-4 border-[#347F99] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
