'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Plane, Receipt } from 'lucide-react'
import TripCard from '@/components/trips/TripCard'
import CreateTripModal from '@/components/trips/CreateTripModal'
import { formatCurrency } from '@/lib/utils'

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
    return (
        <div>
            {/* Header */}
            <motion.div
                className="flex items-start justify-between mb-8"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
            >
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900">My Trips</h1>
                    <p className="text-charcoal-500 mt-1">Manage your shared group expenses</p>
                </div>
                <CreateTripModal />
            </motion.div>

            {/* Stats — 2 real data cards only */}
            <motion.div className="grid grid-cols-2 gap-4 mb-8" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} className="warm-card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center flex-shrink-0">
                        <Plane className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-charcoal-900">{trips.length}</p>
                        <p className="text-sm text-charcoal-500">Active Trips</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="warm-card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-5 h-5 text-sage-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-charcoal-900">{formatCurrency(totalExpenses)}</p>
                        <p className="text-sm text-charcoal-500">Total Expenses</p>
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
                    <div className="w-16 h-16 rounded-2xl bg-gold-100 border border-gold-300 flex items-center justify-center mx-auto mb-5">
                        <Plane className="w-8 h-8 text-gold-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-charcoal-900 mb-2">No trips yet</h2>
                    <p className="text-charcoal-500 mb-6 max-w-sm mx-auto">
                        Create your first trip and invite friends to start splitting expenses fairly.
                    </p>
                    <CreateTripModal />
                </motion.div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    variants={cardContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {trips.map((trip) => (
                        <motion.div key={trip.id} variants={cardVariants}>
                            <TripCard trip={trip} currentUserId={currentUserId} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}
