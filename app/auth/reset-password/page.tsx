'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ready, setReady] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Supabase sends the access_token in the URL hash after the redirect.
    // We rely on the onAuthStateChange PASSWORD_RECOVERY event.
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') setReady(true)
        })
        return () => subscription.unsubscribe()
    }, [supabase])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirm) { toast.error('Passwords do not match'); return }
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error
            toast.success('Password updated! Redirecting…')
            router.push('/app/dashboard')
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-ivory-100 flex items-center justify-center px-4" style={{ backgroundImage: 'radial-gradient(ellipse at 70% 10%, rgba(201,168,76,0.12) 0%, transparent 55%)' }}>
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
            >
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-100 border border-gold-300 mb-4">
                        <KeyRound className="w-7 h-7 text-gold-600" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-charcoal-900 mb-1">Set new password</h1>
                    <p className="text-charcoal-500 text-sm">Enter a new secure password for your account.</p>
                </div>

                <div className="warm-card p-8">
                    {!ready ? (
                        <div className="text-center py-8">
                            <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-charcoal-500 text-sm">Verifying reset link…</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-charcoal-700 mb-1.5">
                                    New Password <span className="text-charcoal-400 font-normal">(min. 6 chars)</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        className="form-input pr-12"
                                        placeholder="••••••••"
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

                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-charcoal-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : 'Update Password'}
                            </motion.button>
                        </form>
                    )}

                    <p className="text-center text-xs text-charcoal-400 mt-6">
                        <Link href="/auth/login" className="hover:text-charcoal-700 transition-colors">← Back to Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
