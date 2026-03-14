'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Plane, ArrowRight, Users, Zap, Receipt,
    CheckCircle, Github, Star,
} from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'

const FEATURES = [
    {
        icon: Receipt,
        accent: 'bg-gold-100 border-gold-300 text-gold-600',
        title: 'Track Every Expense',
        desc: 'Log shared costs instantly — hotel, food, transport. Split by any combination of group members.',
    },
    {
        icon: Zap,
        accent: 'bg-sage-100 border-sage-200 text-sage-400',
        title: 'Smart Settlements',
        desc: 'Our greedy algorithm minimises the number of transactions needed so fewer people pay fewer times.',
    },
    {
        icon: Users,
        accent: 'bg-terra-100 border-terra-200 text-terra-400',
        title: 'Invite Your Group',
        desc: 'Add friends by email in seconds. Everyone sees the same expenses and owes in real time.',
    },
]

const STEPS = [
    { n: '01', title: 'Create a Trip', desc: 'Name it, describe it, create it in under 10 seconds.' },
    { n: '02', title: 'Add Expenses', desc: 'Log what was spent, who paid, and who was part of it.' },
    { n: '03', title: 'Settle Up', desc: 'View the optimised payment plan and mark debts as cleared.' },
]

const MOCK_EXPENSES = [
    { desc: 'Hotel — 3 nights', amount: '₹9,000', payer: 'Arjun', split: 3 },
    { desc: 'Beach scooter rental', amount: '₹2,400', payer: 'Priya', split: 2 },
    { desc: "Group dinner", amount: '₹7,000', payer: 'You', split: 3 },
]

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-ivory-100 text-charcoal-900 overflow-x-hidden">

            {/* ── Navbar ─────────────────────────────────────────────────── */}
            <motion.nav
                className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-white/80 backdrop-blur-md border-b border-ivory-400"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center group-hover:bg-gold-200 transition-colors">
                        <Plane className="w-4 h-4 text-gold-600" />
                    </div>
                    <span className="font-bold text-lg text-charcoal-900">TripLedger</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/auth/login" className="text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors px-4 py-2 font-medium">
                        Sign In
                    </Link>
                    <Link href="/auth/signup" className="btn-primary text-sm">
                        Get Started
                    </Link>
                </div>
            </motion.nav>

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section className="relative flex flex-col items-center justify-center text-center pt-40 pb-24 px-4">
                {/* Background warmth */}
                <div className="absolute inset-0 pointer-events-none bg-hero-texture" />

                {/* Badge */}
                <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gold-100 text-gold-600 border border-gold-300">
                        <Star size={11} className="fill-gold-500 text-gold-500" />
                        Smart Group Expense Tracking
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl text-charcoal-900"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
                >
                    Split trips,{' '}
                    <span className="bg-warmgold-gradient bg-clip-text text-transparent">
                        not friendships
                    </span>
                </motion.h1>

                <motion.p
                    className="mt-6 text-lg md:text-xl text-charcoal-500 max-w-2xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }}
                >
                    TripLedger tracks every group expense and automatically computes the{' '}
                    <span className="text-charcoal-700 font-semibold">fewest payments needed</span> to settle everything fairly. No spreadsheets, no drama.
                </motion.p>

                <motion.div
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.4 }}
                >
                    <Link href="/auth/signup" className="btn-primary flex items-center gap-2 text-base px-7 py-3">
                        Start Tracking Free <ArrowRight size={16} />
                    </Link>
                    <Link href="/auth/login" className="btn-ghost flex items-center gap-2 text-base px-7 py-3">
                        Sign In
                    </Link>
                </motion.div>

                <motion.p className="mt-8 text-xs text-charcoal-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    No credit card required · Free to use
                </motion.p>

                {/* Hero mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 48, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.55 }}
                    className="mt-16 w-full max-w-2xl"
                >
                    <div className="warm-card p-6 text-left shadow-warm-xl">
                        {/* Trip header */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="font-bold text-charcoal-900 text-lg">Goa Trip 2026 🌊</p>
                                <p className="text-charcoal-500 text-sm">3 members · ₹18,400 total</p>
                            </div>
                            <span className="badge-gold">Active</span>
                        </div>
                        {/* Expense rows */}
                        <div className="space-y-2 mb-5">
                            {MOCK_EXPENSES.map((row, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
                                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-ivory-200 border border-ivory-400"
                                >
                                    <div>
                                        <p className="text-sm text-charcoal-900 font-medium">{row.desc}</p>
                                        <p className="text-xs text-charcoal-400">Paid by {row.payer} · split {row.split} ways</p>
                                    </div>
                                    <span className="text-gold-600 font-semibold text-sm">{row.amount}</span>
                                </motion.div>
                            ))}
                        </div>
                        {/* Settlement preview */}
                        <div className="border-t border-ivory-400 pt-4">
                            <p className="text-xs text-charcoal-400 mb-2 flex items-center gap-1.5">
                                <Zap size={11} className="text-gold-500" />
                                Optimised — 2 transactions
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="px-3 py-1.5 rounded-full bg-terra-100 text-terra-400 border border-terra-200 text-xs font-semibold">
                                    Priya → Arjun  ₹1,300
                                </div>
                                <div className="px-3 py-1.5 rounded-full bg-sage-100 text-sage-400 border border-sage-200 text-xs font-semibold">
                                    Priya → You  ₹1,500
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── Features ───────────────────────────────────────────────── */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <FadeIn direction="up" className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-charcoal-900">
                            Everything you need, nothing you don&apos;t
                        </h2>
                        <p className="text-charcoal-500 max-w-xl mx-auto">
                            Built for groups of friends, not finance teams. Simple by design.
                        </p>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 0.12} direction="up">
                                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="warm-card p-6 h-full cursor-default">
                                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${f.accent}`}>
                                        <f.icon size={20} />
                                    </div>
                                    <h3 className="font-semibold text-charcoal-900 text-lg mb-2">{f.title}</h3>
                                    <p className="text-charcoal-500 text-sm leading-relaxed">{f.desc}</p>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ───────────────────────────────────────────── */}
            <section className="py-24 px-4 border-t border-ivory-400">
                <div className="max-w-4xl mx-auto">
                    <FadeIn direction="up" className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-charcoal-900">Up and running in 60 seconds</h2>
                        <p className="text-charcoal-500 max-w-lg mx-auto">No onboarding, no config. Just create a trip and start logging.</p>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-8">
                        {STEPS.map((s, i) => (
                            <FadeIn key={s.n} delay={i * 0.15} direction="up">
                                <div className="relative">
                                    {i < STEPS.length - 1 && (
                                        <div className="hidden md:block absolute top-6 left-[calc(100%_-_20px)] w-full h-px bg-gradient-to-r from-gold-300 to-transparent z-10" />
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gold-100 border border-gold-300 flex items-center justify-center flex-shrink-0">
                                            <span className="text-gold-600 font-bold text-sm">{s.n}</span>
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-semibold text-charcoal-900 mb-1.5">{s.title}</h3>
                                            <p className="text-charcoal-500 text-sm leading-relaxed">{s.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ─────────────────────────────────────────────── */}
            <section className="py-24 px-4">
                <FadeIn direction="up">
                    <div className="max-w-2xl mx-auto warm-card p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-100/60 to-transparent pointer-events-none" />
                        <Plane className="w-10 h-10 text-gold-500 mx-auto mb-5" />
                        <h2 className="text-3xl font-bold mb-3 text-charcoal-900">Ready for your next trip?</h2>
                        <p className="text-charcoal-500 mb-8 max-w-sm mx-auto">Join your group on TripLedger and leave the maths to us.</p>
                        <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
                            Create Free Account <ArrowRight size={16} />
                        </Link>
                        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-charcoal-400">
                            <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-sage-400" /> Free forever</span>
                            <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-sage-400" /> No credit card</span>
                            <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-sage-400" /> Instant setup</span>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer className="border-t border-ivory-400 py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-charcoal-400">
                <div className="flex items-center gap-2.5">
                    <Plane size={16} className="text-gold-500" />
                    <span className="font-semibold text-charcoal-700">TripLedger</span>
                    <span>·</span>
                    <span>Smart group expense tracking</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/auth/login" className="hover:text-charcoal-900 transition-colors">Sign In</Link>
                    <Link href="/auth/signup" className="hover:text-charcoal-900 transition-colors">Sign Up</Link>
                    <a href="https://github.com/KanhaiyaBagul/TripLedger" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-charcoal-900 transition-colors">
                        <Github size={14} /> GitHub
                    </a>
                </div>
            </footer>
        </div>
    )
}
