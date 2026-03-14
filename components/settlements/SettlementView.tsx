'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Zap } from 'lucide-react'
import { formatCurrency, getAvatarColor, getInitials } from '@/lib/utils'
import type { ParticipantBalance, SettlementTransaction } from '@/lib/settlement'

interface SettlementViewProps {
    tripId: string
}

export default function SettlementView({ tripId }: SettlementViewProps) {
    const [balances, setBalances] = useState<ParticipantBalance[]>([])
    const [transactions, setTransactions] = useState<SettlementTransaction[]>([])
    const [settled, setSettled] = useState<Set<number>>(new Set())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/trips/${tripId}/settlements`)
            .then((r) => r.json())
            .then((d) => {
                setBalances(d.balances ?? [])
                setTransactions(d.transactions ?? [])
            })
            .finally(() => setLoading(false))
    }, [tripId])

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="h-20 glass-card"
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                    />
                ))}
            </div>
        )
    }

    if (transactions.length === 0 && balances.length === 0) {
        return (
            <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
            >
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-white font-semibold text-lg">All settled up!</p>
                <p className="text-slate-400 text-sm">No expenses to settle.</p>
            </motion.div>
        )
    }

    const memberIndex = new Map(balances.map((b, i) => [b.userId, i]))

    return (
        <div className="space-y-6">
            {/* Balance pills */}
            {balances.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <p className="text-sm text-slate-400 mb-3 font-medium">Net Balances</p>
                    <div className="flex flex-wrap gap-2">
                        {balances.map((b, i) => (
                            <motion.span
                                key={b.userId}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.06, duration: 0.3 }}
                                className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${b.netBalance > 0
                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                    : b.netBalance < 0
                                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                                        : 'bg-slate-700/50 text-slate-300 border-slate-600/20'
                                    }`}
                            >
                                {b.email.split('@')[0]}{' '}
                                {b.netBalance >= 0 ? '+' : ''}
                                {formatCurrency(b.netBalance)}
                            </motion.span>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Per person share:{' '}
                        <span className="text-slate-400 font-medium">
                            {formatCurrency(
                                balances.reduce((s, b) => s + b.totalShare, 0) / (balances.length || 1)
                            )}
                        </span>
                    </p>
                </motion.div>
            )}

            {/* Transactions */}
            {transactions.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <p className="text-sm text-slate-400 font-medium">Optimized Settlements</p>
                        <span className="badge-violet flex items-center gap-1">
                            <Zap size={10} />
                            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {transactions.map((t, i) => {
                            const isSettled = settled.has(i)
                            const fromIdx = memberIndex.get(t.from) ?? 0
                            const toIdx = memberIndex.get(t.to) ?? 1
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.35, ease: 'easeOut' }}
                                    className={`glass-card p-4 flex items-center gap-4 transition-all duration-300 ${isSettled ? 'opacity-60' : ''}`}
                                >
                                    {/* From */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-9 h-9 rounded-full ${getAvatarColor(fromIdx)} flex items-center justify-center text-xs font-semibold text-white flex-shrink-0`}>
                                            {getInitials(t.fromEmail)}
                                        </div>
                                        <span className="text-sm text-white truncate">{t.fromEmail.split('@')[0]}</span>
                                    </div>

                                    <ArrowRight className="text-violet-400 flex-shrink-0" size={18} />

                                    {/* To */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-9 h-9 rounded-full ${getAvatarColor(toIdx)} flex items-center justify-center text-xs font-semibold text-white flex-shrink-0`}>
                                            {getInitials(t.toEmail)}
                                        </div>
                                        <span className="text-sm text-white truncate">{t.toEmail.split('@')[0]}</span>
                                    </div>

                                    <div className="ml-auto flex items-center gap-4 flex-shrink-0">
                                        <span className="text-base font-bold text-amber-400">{formatCurrency(t.amount)}</span>
                                        <motion.button
                                            onClick={() => setSettled((prev) => {
                                                const next = new Set(prev)
                                                isSettled ? next.delete(i) : next.add(i)
                                                return next
                                            })}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${isSettled
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                : 'border-slate-600 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400'
                                                }`}
                                        >
                                            {isSettled ? '✓ Settled' : 'Mark Settled'}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )}

            {transactions.length === 0 && balances.length > 0 && (
                <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-emerald-400 font-semibold">Everyone is settled up!</p>
                </motion.div>
            )}
        </div>
    )
}
