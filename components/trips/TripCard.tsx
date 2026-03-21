'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trash2, Users, ArrowRight, Calendar } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface TripCardProps {
    trip: {
        id: string
        name: string
        description?: string
        created_at: string
        created_by: string
        trip_members: { user_id: string; role: string }[]
        expenses?: { amount: number }[]
    }
    currentUserId: string
}

export default function TripCard({ trip, currentUserId }: TripCardProps) {
    const router = useRouter()
    const isOwner = trip.created_by === currentUserId
    const totalExpenses = (trip.expenses ?? []).reduce((sum, e) => sum + Number(e.amount), 0)

    async function handleDelete(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!confirm(`Delete "${trip.name}"? This cannot be undone.`)) return
        const res = await fetch(`/api/trips/${trip.id}`, { method: 'DELETE' })
        if (res.ok) { toast.success('Trip deleted'); router.refresh() }
        else toast.error('Failed to delete trip')
    }

    return (
        <Link href={`/app/trips/${trip.id}`}>
            <motion.div
                className="warm-card p-5 cursor-pointer group relative overflow-hidden transition-colors duration-300"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
            >
                {/* Accent line on hover */}
                <motion.div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-warmgold-gradient dark:bg-gradient-to-r dark:from-violet-500 dark:to-indigo-500"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                />

                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-charcoal-900 dark:text-white text-lg group-hover:text-gold-600 dark:group-hover:text-violet-300 transition-colors duration-300">
                        {trip.name}
                    </h3>
                    {isOwner && (
                        <motion.button
                            onClick={handleDelete}
                            aria-label={`Delete trip ${trip.name}`}
                            className="ml-2 p-1.5 text-charcoal-300 dark:text-slate-500 hover:text-terra-400 dark:hover:text-rose-400 hover:bg-terra-100 dark:hover:bg-rose-500/20 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Trash2 size={16} />
                        </motion.button>
                    )}
                </div>

                {trip.description && (
                    <p className="text-charcoal-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 transition-colors duration-300">{trip.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-charcoal-400 dark:text-slate-400 mb-4 transition-colors duration-300">
                    <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-gold-500 dark:text-violet-400 transition-colors duration-300" />
                        {trip.trip_members.length} member{trip.trip_members.length !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-charcoal-300 dark:text-slate-500 transition-colors duration-300" />
                        {formatDate(trip.created_at)}
                    </span>
                </div>

                {totalExpenses > 0 && (
                    <div className="flex items-center justify-between pt-3 border-t border-ivory-400 dark:border-white/10 transition-colors duration-300">
                        <span className="text-xs text-charcoal-400 dark:text-slate-400 transition-colors duration-300">Total expenses</span>
                        <span className="text-sm font-semibold text-gold-600 dark:text-violet-400 transition-colors duration-300">{formatCurrency(totalExpenses)}</span>
                    </div>
                )}

                <div className="mt-3 flex items-center text-gold-500 dark:text-violet-400 text-sm font-medium gap-1 group-hover:gap-2 transition-all duration-200">
                    View Trip <ArrowRight size={14} />
                </div>
            </motion.div>
        </Link>
    )
}
