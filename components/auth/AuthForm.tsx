'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Plane } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

type Mode = 'login' | 'signup'

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
            } else {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                toast.success('Account created! You can now log in.')
                setMode('login')
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md animate-slide-up">
            {/* Brand */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 mb-4">
                    <Plane className="w-7 h-7 text-violet-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">TripLedger</h1>
                <p className="text-slate-400 mt-1 text-sm">Smart group expense tracking</p>
            </div>

            {/* Card */}
            <div className="glass-card p-8">
                {/* Tabs */}
                <div className="flex mb-8 border-b border-white/[0.08]">
                    <button
                        onClick={() => setMode('login')}
                        className={`tab-btn flex-1 ${mode === 'login' ? 'active' : ''}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode('signup')}
                        className={`tab-btn flex-1 ${mode === 'signup' ? 'active' : ''}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1.5 font-medium">
                            Email address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1.5 font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : null}
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </div>

            <p className="text-center text-xs text-slate-500 mt-6">
                By continuing, you agree to our{' '}
                <span className="text-violet-400 cursor-pointer hover:underline">Terms</span>{' '}
                &amp;{' '}
                <span className="text-violet-400 cursor-pointer hover:underline">Privacy Policy</span>
            </p>
        </div>
    )
}
