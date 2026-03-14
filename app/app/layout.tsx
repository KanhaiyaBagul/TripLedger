import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    return (
        <div className="flex min-h-screen">
            <Sidebar userEmail={user.email} />
            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
            </main>
        </div>
    )
}
