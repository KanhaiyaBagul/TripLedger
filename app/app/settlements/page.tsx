import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeftRight } from 'lucide-react'

export default async function SettlementsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-charcoal-900">Settlements</h1>
                <p className="text-slate-400 mt-1">View settlements across all your trips</p>
            </div>

            <div className="glass-card p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
                    <ArrowLeftRight className="w-8 h-8 text-violet-400" />
                </div>
                <h2 className="text-xl font-semibold text-charcoal-900 mb-2">View trip settlements</h2>
                <p className="text-slate-400 max-w-sm mx-auto">
                    Open any trip from the Dashboard and click the <span className="text-violet-400 font-medium">Settlements</span> tab to see optimized payment breakdowns.
                </p>
            </div>
        </div>
    )
}
