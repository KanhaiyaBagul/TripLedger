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

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <Link href="/app/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                <ChevronRight size={14} />
                <span className="text-white">{trip.name}</span>
            </nav>

            {/* Trip header */}
            <div className="glass-card p-6 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold text-white mb-1">{trip.name}</h1>
                        {trip.description && (
                            <p className="text-slate-400 mb-4">{trip.description}</p>
                        )}
                        <div className="flex items-center flex-wrap gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Users size={14} className="text-violet-400" />
                                {members.length} member{members.length !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Receipt size={14} className="text-amber-400" />
                                {formatCurrency(totalExpenses)} total
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-slate-500" />
                                {formatDate(trip.created_at)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
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
            />
        </div>
    )
}
