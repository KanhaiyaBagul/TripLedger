import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { computeSettlements } from '@/lib/settlement'

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: tripId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch members with their emails
    const { data: members, error: membersError } = await supabase
        .from('trip_members')
        .select('user_id, user_profiles(id, email)')
        .eq('trip_id', tripId)

    if (membersError) return NextResponse.json({ error: membersError.message }, { status: 500 })

    // Fetch expenses with participants
    const { data: expenses, error: expError } = await supabase
        .from('expenses')
        .select('id, amount, paid_by, expense_participants(user_id)')
        .eq('trip_id', tripId)

    if (expError) return NextResponse.json({ error: expError.message }, { status: 500 })

    const users = members.map((m: any) => ({
        id: m.user_id,
        email: m.user_profiles?.email ?? m.user_id,
    }))

    const normalizedExpenses = (expenses ?? []).map((e: any) => ({
        id: e.id,
        amount: Number(e.amount),
        paid_by: e.paid_by,
        participants: (e.expense_participants ?? []).map((p: any) => p.user_id),
    }))

    const result = computeSettlements(normalizedExpenses, users)
    return NextResponse.json(result)
}
