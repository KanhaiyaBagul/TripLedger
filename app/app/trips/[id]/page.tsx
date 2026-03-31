import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Users, Receipt, Calendar } from 'lucide-react'
import { formatCurrency, formatDate, getAvatarColor, getInitials } from '@/lib/utils'
import TripTabs from '@/components/trips/TripTabs'
import AddExpenseModal from '@/components/expenses/AddExpenseModal'
import ExpenseList from '@/components/expenses/ExpenseList'
import MembersPanel from '@/components/trips/MembersPanel'
import SettlementView from '@/components/settlements/SettlementView'
import ActivityFeedPanel from '@/components/trips/ActivityFeedPanel'

export default async function TripDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: trip, error } = await supabase
        .from('trips')
        .select(`
      id, name, description, created_by, created_at,
      trip_members(id, user_id, role),
      expenses(id, amount, description, paid_by, created_at,
        expense_participants(user_id)
      )
    `)
        .eq('id', id)
        .single()

    if (error || !trip) notFound()

    // Fetch member emails from user_profiles view
    const memberIds = ((trip.trip_members || []) as any[]).map((m) => m.user_id)
    const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, email')
        .in('id', memberIds)

    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p.email]))

    const members = ((trip.trip_members || []) as any[]).map((m) => ({
        user_id: m.user_id,
        email: profileMap.get(m.user_id) ?? m.user_id,
        role: m.role,
    }))

    const isOwner = trip.created_by === user.id
    const totalExpenses = ((trip.expenses || []) as any[]).reduce(
        (sum: number, e: any) => sum + Number(e.amount),
        0
    )

    // Fetch settlements for the activity feed
    const { data: settlementsList } = await supabase
        .from('settlements')
        .select('*')
        .eq('trip_id', id)
        .eq('settled', true)

    // Build Activity Feed
    const activities: any[] = []

    activities.push({
        id: `trip-created-${trip.id}`,
        type: 'trip_created',
        user_id: trip.created_by,
        created_at: trip.created_at,
    })

    ;(trip.expenses || []).forEach((e: any) => {
        activities.push({
            id: `exp-${e.id}`,
            type: 'expense',
            user_id: e.paid_by,
            amount: Number(e.amount),
            description: e.description,
            created_at: e.created_at,
        })
    })

    ;(settlementsList || []).forEach((s: any) => {
        activities.push({
            id: `set-${s.id}`,
            type: 'settlement',
            user_id: s.from_user,
            to_user_id: s.to_user,
            amount: Number(s.amount),
            created_at: s.settled_at || s.created_at,
        })
    })

    activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-charcoal-500 mb-6">
                <Link href="/app/dashboard" className="hover:text-charcoal-900 transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-charcoal-900 font-medium">{trip.name}</span>
            </nav>

            {/* Trip header */}
            <div className="warm-card p-5 sm:p-8 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Receipt size={120} className="rotate-12" />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">{trip.name}</h1>
                             <span className="badge-gold hidden sm:inline-flex">Trip</span>
                        </div>
                        {trip.description && (
                            <p className="text-charcoal-500 mb-6 text-sm sm:text-base max-w-2xl leading-relaxed">{trip.description}</p>
                        )}
                        <div className="flex items-center flex-wrap gap-x-6 gap-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-ivory-200 flex items-center justify-center text-gold-600 shadow-sm border border-ivory-300">
                                    <Users size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">Members</p>
                                    <p className="text-sm font-bold text-charcoal-900">{members.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-ivory-200 flex items-center justify-center text-gold-600 shadow-sm border border-ivory-300">
                                    <Receipt size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">Total Spent</p>
                                    <p className="text-sm font-bold text-gold-600">{formatCurrency(totalExpenses)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 hidden xs:flex">
                                <div className="w-8 h-8 rounded-lg bg-ivory-200 flex items-center justify-center text-charcoal-400 shadow-sm border border-ivory-300">
                                    <Calendar size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">Created</p>
                                    <p className="text-sm font-bold text-charcoal-900">{formatDate(trip.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-ivory-300 sm:flex-shrink-0">
                        <AddExpenseModal
                            tripId={trip.id}
                            members={members}
                            currentUserId={user.id}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <TripTabs
                expensesTab={
                    <ExpenseList
                        expenses={(trip.expenses || []) as any[]}
                        members={members}
                        tripId={trip.id}
                        currentUserId={user.id}
                    />
                }
                membersTab={
                    <MembersPanel
                        members={members}
                        tripId={trip.id}
                        currentUserId={user.id}
                        isOwner={isOwner}
                    />
                }
                settlementsTab={<SettlementView tripId={trip.id} />}
                activitiesTab={<ActivityFeedPanel activities={activities} members={members} />}
            />
        </div>
    )
}
