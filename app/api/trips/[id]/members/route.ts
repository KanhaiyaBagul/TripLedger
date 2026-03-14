import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const inviteSchema = z.object({
    email: z.string().email(),
})

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: tripId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = inviteSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

    const { email } = parsed.data

    // Look up user by email via user_profiles view
    const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single()

    if (profileError || !profiles) {
        return NextResponse.json({ error: 'User not found. They must sign up first.' }, { status: 404 })
    }

    const { error } = await supabase
        .from('trip_members')
        .insert({ trip_id: tripId, user_id: profiles.id, role: 'member' })

    if (error) {
        if (error.code === '23505') return NextResponse.json({ error: 'User is already a member' }, { status: 409 })
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
}
