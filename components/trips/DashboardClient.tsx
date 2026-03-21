'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Plane, Receipt, Search } from 'lucide-react'
import TripCard from '@/components/trips/TripCard'
import CreateTripModal from '@/components/trips/CreateTripModal'
import { formatCurrency, cn } from '@/lib/utils'

interface Trip {
    id: string
    name: string
    description?: string
    created_at: string
    created_by: string
    trip_members: { user_id: string; role: string }[]
    expenses?: { amount: number }[]
}

interface DashboardClientProps {
    trips: Trip[]
    totalExpenses: number
    currentUserId: string
}

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, type: 'tween' } },
}
const cardContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
}
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, type: 'tween' } },
}

export default function DashboardClient({ trips, totalExpenses, currentUserId }: DashboardClientProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredTrips = trips.filter(trip =>
        trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div>
            {/* Header */}
            <motion.div
                className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
            >
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white transition-colors duration-300">My Trips</h1>
                    <p className="text-charcoal-500 dark:text-slate-400 mt-1 transition-colors duration-300">Manage your shared group expenses</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search trips..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0f172a] border border-ivory-400 dark:border-white/10 rounded-xl text-sm dark:text-white transition-colors duration-300",
                                "focus:outline-none focus:ring-2 focus:ring-gold-300 dark:focus:ring-violet-500 focus:border-gold-400 dark:focus:border-violet-500 transition-all",
                                "placeholder:text-charcoal-300 dark:placeholder:text-slate-500"
                            )}
                        />
                    </div>
                    <CreateTripModal />
                </div>
            </motion.div>

            {/* Stats — 2 real data cards only */}
            <motion.div className="grid grid-cols-2 gap-4 mb-8" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} className="warm-card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gold-100 dark:bg-violet-500/20 border border-gold-300 dark:border-violet-500/30 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                        <Plane className="w-5 h-5 text-gold-600 dark:text-violet-400 transition-colors duration-300" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-charcoal-900 dark:text-white transition-colors duration-300">{trips.length}</p>
                        <p className="text-sm text-charcoal-500 dark:text-slate-400 transition-colors duration-300">Active Trips</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="warm-card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-sage-100 dark:bg-emerald-500/20 border border-sage-200 dark:border-emerald-500/30 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                        <Receipt className="w-5 h-5 text-sage-400 dark:text-emerald-400 transition-colors duration-300" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-charcoal-900 dark:text-white transition-colors duration-300">{formatCurrency(totalExpenses)}</p>
                        <p className="text-sm text-charcoal-500 dark:text-slate-400 transition-colors duration-300">Total Expenses</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Trip Cards */}
            {trips.length === 0 ? (
                <motion.div
                    className="warm-card p-16 text-center"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <div className="w-16 h-16 rounded-2xl bg-gold-100 dark:bg-violet-500/20 border border-gold-300 dark:border-violet-500/30 flex items-center justify-center mx-auto mb-5 transition-colors duration-300">
                        <Plane className="w-8 h-8 text-gold-600 dark:text-violet-400 transition-colors duration-300" />
                    </div>
                    <h2 className="text-xl font-semibold text-charcoal-900 dark:text-white mb-2 transition-colors duration-300">No trips yet</h2>
                    <p className="text-charcoal-500 dark:text-slate-400 mb-6 max-w-sm mx-auto transition-colors duration-300">
                        Create your first trip and invite friends to start splitting expenses fairly.
                    </p>
                    <CreateTripModal />
                </motion.div>
            ) : filteredTrips.length === 0 ? (
                <motion.div
                    className="warm-card p-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Search className="w-10 h-10 text-charcoal-200 dark:text-slate-600 mx-auto mb-4 transition-colors duration-300" />
                    <p className="text-charcoal-500 dark:text-slate-400 transition-colors duration-300">No trips found matching &quot;{searchQuery}&quot;</p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="mt-4 text-gold-600 dark:text-violet-400 font-medium hover:underline text-sm transition-colors duration-300"
                    >
                        Clear search
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    variants={cardContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredTrips.map((trip) => (
                        <motion.div key={trip.id} variants={cardVariants}>
                            <TripCard trip={trip} currentUserId={currentUserId} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}
