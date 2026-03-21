'use client'

import { motion } from 'framer-motion'
import { PlusCircle, Receipt, CheckCircle2 } from 'lucide-react'
import { formatCurrency, getInitials, getAvatarColor } from '@/lib/utils'

export type ActivityItem = {
    id: string
    type: 'trip_created' | 'expense' | 'settlement'
    user_id: string
    created_at: string
    // details
    amount?: number
    description?: string
    to_user_id?: string
}

interface ActivityFeedProps {
    activities: ActivityItem[]
    members: any[]
}

// More readable relative time formatter since we want a feed-like experience
function formatTimeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
    })
}

export default function ActivityFeedPanel({ activities, members }: ActivityFeedProps) {
    const getMember = (id: string) => members.find((m) => m.user_id === id)

    return (
        <div className="space-y-6 animate-fade-in pl-4 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {activities.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-charcoal-500">No activity to show yet.</p>
                </div>
            ) : (
                <div className="relative py-4 space-y-8">
                    {activities.map((activity, index) => {
                        const user = getMember(activity.user_id)
                        const userName = user?.email?.split('@')[0] || 'Unknown User'
                        const userIndex = members.findIndex(m => m.user_id === activity.user_id)
                        const avatarColor = getAvatarColor(userIndex === -1 ? 0 : userIndex)

                        let icon = null
                        let content = null

                        if (activity.type === 'trip_created') {
                            icon = <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 ring-2 ring-slate-900"><PlusCircle size={16} /></span>
                            content = (
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {userName} <span className="font-normal text-charcoal-400">created the trip</span>
                                    </p>
                                </div>
                            )
                        } else if (activity.type === 'expense') {
                            icon = <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 ring-2 ring-slate-900"><Receipt size={16} /></span>
                            content = (
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {userName} <span className="font-normal text-charcoal-400">added an expense</span>
                                    </p>
                                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                                        <div className="bg-white/10 p-1.5 rounded-md text-charcoal-300">
                                            <Receipt size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-charcoal-300 font-medium">{activity.description}</p>
                                            <p className="text-sm font-bold text-amber-400">{formatCurrency(activity.amount || 0)}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        } else if (activity.type === 'settlement') {
                            const toUser = getMember(activity.to_user_id || '')
                            const toUserName = toUser?.email?.split('@')[0] || 'Unknown User'
                            
                            icon = <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 ring-2 ring-slate-900"><CheckCircle2 size={16} /></span>
                            content = (
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {userName} <span className="font-normal text-charcoal-400">settled up with</span> {toUserName}
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-emerald-400">
                                        {formatCurrency(activity.amount || 0)} paid
                                    </p>
                                </div>
                            )
                        }

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative flex items-start justify-between md:justify-normal group"
                            >
                                {/* Left side - Avatar (hidden on tiny screens if desired, but good for spatial flow) */}
                                <div className="hidden md:flex flex-col items-center w-24 flex-shrink-0 z-10">
                                    <div className="text-xs text-charcoal-500 mt-1 whitespace-nowrap">
                                        {formatTimeAgo(activity.created_at)}
                                    </div>
                                </div>

                                {/* Center - Icon */}
                                <div className="absolute left-0 md:static flex items-center justify-center -translate-x-1/2 md:-translate-x-0 z-10 mb-1">
                                    {icon}
                                </div>

                                {/* Right side - Content */}
                                <div className="pl-6 md:pl-8 flex-1 pb-2">
                                    <div className="md:hidden text-xs text-charcoal-500 mb-1">
                                        {formatTimeAgo(activity.created_at)}
                                    </div>
                                    <div className="warm-card p-4 hover:border-white/15 transition-colors">
                                        {content}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
