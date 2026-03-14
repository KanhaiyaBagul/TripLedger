'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Plane, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import Link from 'next/link'

type Mode = 'login' | 'signup' | 'forgot'

export default function AuthForm() {
    const [mode, setMode] = useState<Mode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function handleGoogleSignIn() {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/app/dashboard`,
                },
            })
            if (error) throw error
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        setLoading(true)
        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                toast.success('Welcome back!')
                router.push('/app/dashboard')
                router.refresh()
            } else if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                toast.success('Account created! You can now log in.')
                setMode('login')
            } else if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                })
                if (error) throw error
                toast.success('Reset link sent — check your email!')
                setMode('login')
            }
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            {/* Brand */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold-100 border border-gold-300 mb-3">
                    <Plane className="w-6 h-6 text-gold-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-charcoal-900 mb-1">TripLedger</h1>
                <p className="text-charcoal-500 text-sm">
                    {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
                </p>
            </div>

            {/* Form Container */}
            <div className="w-full">
                {/* Toggle — only show in login/signup mode */}
                {mode !== 'forgot' && (
                    <>
                        <div className="flex bg-ivory-200 rounded-xl p-1 mb-5">
                            {(['login', 'signup'] as ('login' | 'signup')[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${mode === m
                                        ? 'bg-gold-500 text-white shadow-warm-sm scale-100'
                                        : 'text-charcoal-500 hover:text-charcoal-900 scale-95 hover:scale-100'
                                        }`}
                                >
                                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-charcoal-200 rounded-xl text-charcoal-700 font-semibold hover:bg-neutral-50 hover:border-charcoal-300 transition-all mb-4 shadow-sm disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative flex items-center mb-4">
                            <div className="flex-grow border-t border-charcoal-200/60"></div>
                            <span className="flex-shrink-0 mx-4 text-charcoal-400 text-[10px] font-semibold uppercase tracking-wider">or sign in with email</span>
                            <div className="flex-grow border-t border-charcoal-200/60"></div>
                        </div>
                    </>
                )}

                {/* Forgot password header */}
                {mode === 'forgot' && (
                    <div className="mb-6">
                        <button
                            onClick={() => setMode('login')}
                            className="flex items-center gap-1.5 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors mb-4"
                        >
                            <ArrowLeft size={14} /> Back to Sign In
                        </button>
                        <h2 className="font-bold text-charcoal-900 text-lg">Reset your password</h2>
                        <p className="text-sm text-charcoal-500 mt-1">We&apos;ll send a reset link to your email.</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.form
                        key={mode}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-1.5">Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {mode !== 'forgot' && (
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-sm font-medium text-charcoal-700">
                                        Password {mode === 'signup' && <span className="text-charcoal-400 font-normal">(min. 6 chars)</span>}
                                    </label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot')}
                                            className="text-xs text-gold-600 hover:text-gold-500 font-medium transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                        className="form-input pr-12"
                                        placeholder="••••••••"
                                        minLength={mode === 'signup' ? 6 : undefined}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                        </motion.button>
                    </motion.form>
                </AnimatePresence>

                {mode !== 'forgot' && (
                    <p className="text-center text-[13px] text-charcoal-500 mt-4">
                        {mode === 'login' ? (
                            <>
                                Don&apos;t have an account?{' '}
                                <button onClick={() => setMode('signup')} className="text-gold-600 hover:text-gold-500 font-semibold transition-colors">
                                    Sign up free
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button onClick={() => setMode('login')} className="text-gold-600 hover:text-gold-500 font-semibold transition-colors">
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                )}
            </div>

            <div className="mt-5 pt-4 border-t border-charcoal-200/50">
                <p className="text-center text-xs text-charcoal-400">
                    <Link href="/" className="hover:text-charcoal-600 transition-colors flex items-center justify-center gap-1.5">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                </p>
            </div>
        </motion.div>
    )
}
