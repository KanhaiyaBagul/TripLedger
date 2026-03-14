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
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-slate-400 mt-1">Your account details</p>
            </div>

            <div className="max-w-lg">
                <div className="glass-card p-6 space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 pb-5 border-b border-white/[0.08]">
                        <div className="w-16 h-16 rounded-2xl bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-2xl font-bold text-violet-300 uppercase">
                            {user.email?.[0] ?? 'U'}
                        </div>
                        <div>
                            <p className="text-white font-semibold text-lg">{user.email?.split('@')[0]}</p>
                            <span className="badge-violet">Active</span>
                        </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                                <Mail size={16} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">Email address</p>
                                <p className="text-white font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                                <Shield size={16} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">User ID</p>
                                <p className="text-slate-300 text-sm font-mono">{user.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">Member since</p>
                                <p className="text-white font-medium">
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
