'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Users, ArrowRight, Calendar } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

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
        if (res.ok) {
            toast.success('Trip deleted')
            router.refresh()
        } else {
            toast.error('Failed to delete trip')
        }
    }

    return (
        <Link href={`/app/trips/${trip.id}`}>
            <div className="glass-card p-5 hover:border-violet-500/30 transition-all duration-200 cursor-pointer group relative overflow-hidden">
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white text-lg group-hover:text-violet-300 transition-colors">
                        {trip.name}
                    </h3>
                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            className="ml-2 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>

                {trip.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{trip.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-violet-400" />
                        {trip.trip_members.length} member{trip.trip_members.length !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-500" />
                        {formatDate(trip.created_at)}
                    </span>
                </div>

                {totalExpenses > 0 && (
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        <span className="text-xs text-slate-500">Total expenses</span>
                        <span className="text-sm font-semibold text-amber-400">{formatCurrency(totalExpenses)}</span>
                    </div>
                )}

                <div className="mt-3 flex items-center text-violet-400 text-sm font-medium gap-1 group-hover:gap-2 transition-all duration-200">
                    View Trip <ArrowRight size={14} />
                </div>
            </div>
        </Link>
    )
}
