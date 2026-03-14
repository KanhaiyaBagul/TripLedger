import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plane, Receipt, TrendingUp } from 'lucide-react'
import TripCard from '@/components/trips/TripCard'
import CreateTripModal from '@/components/trips/CreateTripModal'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: trips } = await supabase
        .from('trips')
        .select('id, name, description, created_by, created_at, trip_members(user_id, role), expenses(amount)')
        .order('created_at', { ascending: false })

    const totalExpenses = (trips ?? []).reduce(
        (sum, t) => sum + (t.expenses ?? []).reduce((s: number, e: { amount: number }) => s + Number(e.amount), 0),
        0
    )

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Trips</h1>
                    <p className="text-slate-400 mt-1">Manage your shared group expenses</p>
                </div>
                <CreateTripModal />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <Plane className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{(trips ?? []).length}</p>
                        <p className="text-sm text-slate-400">Active Trips</p>
                    </div>
                </div>
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
                        <p className="text-sm text-slate-400">Total Expenses</p>
                    </div>
                </div>
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-emerald-400">Active</p>
                        <p className="text-sm text-slate-400">All Settled Up</p>
                    </div>
                </div>
            </div>

            {/* Trips Grid */}
            {(trips ?? []).length === 0 ? (
                <div className="glass-card p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
                        <Plane className="w-8 h-8 text-violet-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">No trips yet</h2>
                    <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                        Create your first trip and invite friends to start splitting expenses fairly.
                    </p>
                    <CreateTripModal />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {(trips ?? []).map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip as any}
                            currentUserId={user.id}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
