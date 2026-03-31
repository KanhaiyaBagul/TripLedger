import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

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
        <div className="flex min-h-screen bg-ivory-100">
            <Sidebar userEmail={user.email} />
            <main className="flex-1 overflow-x-hidden pb-20 lg:pb-0">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                    {children}
                </div>
            </main>
            <MobileNav />
        </div>
    )
}
