import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const expenseSchema = z.object({
    description: z.string().min(1).max(200),
    amount: z.number().positive(),
    paid_by: z.string().uuid(),
    participants: z.array(z.string().uuid()).min(1),
})

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: tripId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
        .from('expenses')
        .select('*, expense_participants(user_id)')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: tripId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = expenseSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const { description, amount, paid_by, participants } = parsed.data

    const { data: expense, error: expError } = await supabase
        .from('expenses')
        .insert({ trip_id: tripId, description, amount, paid_by })
        .select()
        .single()

    if (expError) return NextResponse.json({ error: expError.message }, { status: 500 })

    const participantRows = participants.map((uid) => ({
        expense_id: expense.id,
        user_id: uid,
    }))

    const { error: partError } = await supabase
        .from('expense_participants')
        .insert(participantRows)

    if (partError) return NextResponse.json({ error: partError.message }, { status: 500 })

    return NextResponse.json(expense, { status: 201 })
}
