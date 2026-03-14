import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createTripSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
})

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
        .from('trips')
        .select(`
      id, name, description, created_by, created_at,
      trip_members(user_id, role)
    `)
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = createTripSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const { name, description } = parsed.data

    const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({ name, description, created_by: user.id })
        .select()
        .single()

    if (tripError) return NextResponse.json({ error: tripError.message }, { status: 500 })

    const { error: memberError } = await supabase
        .from('trip_members')
        .insert({ trip_id: trip.id, user_id: user.id, role: 'owner' })

    if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 })

    return NextResponse.json(trip, { status: 201 })
}
