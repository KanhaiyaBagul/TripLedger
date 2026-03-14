import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/trips/DashboardClient'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: trips } = await supabase
        .from('trips')
        .select('id, name, description, created_by, created_at, trip_members(user_id, role), expenses(amount)')
        .order('created_at', { ascending: false })

    const loaded = trips ?? []

    const totalExpenses = loaded.reduce(
        (sum, t) => sum + (t.expenses ?? []).reduce((s: number, e: { amount: number }) => s + Number(e.amount), 0),
        0
    )

    return (
        <DashboardClient
            trips={loaded as any}
            totalExpenses={totalExpenses}
            currentUserId={user.id}
        />
    )
}
