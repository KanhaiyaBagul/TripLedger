import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { User, Mail, Shield } from 'lucide-react'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-charcoal-900">Profile</h1>
                <p className="text-charcoal-500 mt-1">Your account details</p>
            </div>

            <div className="max-w-lg">
                <div className="warm-card p-6 space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 pb-5 border-b border-ivory-400">
                        <div className="w-16 h-16 rounded-2xl bg-gold-100 border border-gold-300 flex items-center justify-center text-2xl font-bold text-gold-600 uppercase">
                            {user.email?.[0] ?? 'U'}
                        </div>
                        <div>
                            <p className="text-charcoal-900 font-semibold text-lg">{user.email?.split('@')[0]}</p>
                            <span className="badge-gold">Active</span>
                        </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 flex items-center justify-center flex-shrink-0">
                                <Mail size={16} className="text-charcoal-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 mb-0.5">Email address</p>
                                <p className="text-charcoal-900 font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 flex items-center justify-center flex-shrink-0">
                                <Shield size={16} className="text-charcoal-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 mb-0.5">User ID</p>
                                <p className="text-charcoal-600 text-sm font-mono">{user.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-charcoal-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 mb-0.5">Member since</p>
                                <p className="text-charcoal-900 font-medium">
                                    {new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
