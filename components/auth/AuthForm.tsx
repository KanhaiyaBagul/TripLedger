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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
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
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-100 border border-gold-300 mb-4">
                    <Plane className="w-7 h-7 text-gold-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-charcoal-900 mb-1">TripLedger</h1>
                <p className="text-charcoal-500 text-sm">
                    {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
                </p>
            </div>

            {/* Card */}
            <div className="warm-card p-8">
                {/* Toggle — only show in login/signup mode */}
                {mode !== 'forgot' && (
                    <div className="flex bg-ivory-200 rounded-xl p-1 mb-6">
                        {(['login', 'signup'] as ('login' | 'signup')[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${mode === m
                                        ? 'bg-gold-500 text-white shadow-warm-sm'
                                        : 'text-charcoal-500 hover:text-charcoal-900'
                                    }`}
                            >
                                {m === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>
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
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
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
                    <p className="text-center text-sm text-charcoal-400 mt-5">
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

            <p className="text-center text-xs text-charcoal-400 mt-6">
                <Link href="/" className="hover:text-charcoal-700 transition-colors">
                    ← Back to Home
                </Link>
            </p>
        </motion.div>
    )
}
