import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { User, Mail, Shield, Phone, Calendar, BookOpen } from 'lucide-react'
import EditProfileModal from '@/components/profile/EditProfileModal'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const meta = user.user_metadata || {};
    const name = meta.name || user.email?.split('@')[0] || 'User'
    const dob = meta.dob || 'Not provided'
    const phone = meta.phone || 'Not provided'
    const bio = meta.bio || 'No bio provided'

    return (
        <div className="animate-fade-in bg-[#0f172a] rounded-3xl p-6 md:p-10 min-h-[calc(100vh-4rem)]">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Profile</h1>
                    <p className="text-slate-400 mt-1">Your account details</p>
                </div>
                <EditProfileModal currentData={{ name: meta.name || '', dob: meta.dob || '', phone: meta.phone || '', bio: meta.bio || '' }} />
            </div>

            <div className="max-w-lg">
                <div className="bg-[#1e293b] border border-white/10 p-6 space-y-5 rounded-2xl shadow-xl">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                        <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-2xl font-bold text-violet-400 uppercase shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                            {name[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white font-semibold text-lg">{name}</p>
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mt-1">Active</span>
                        </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/5">
                                <BookOpen size={16} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5 font-medium uppercase tracking-wider">Bio</p>
                                <p className="text-slate-200 text-sm whitespace-pre-wrap">{bio}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/5">
                                <Mail size={16} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5 font-medium uppercase tracking-wider">Email address</p>
                                <p className="text-slate-200 font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/5">
                                <Phone size={16} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5 font-medium uppercase tracking-wider">Phone Number</p>
                                <p className="text-slate-200 font-medium">{phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/5">
                                <Calendar size={16} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5 font-medium uppercase tracking-wider">Date of Birth</p>
                                <p className="text-slate-200 font-medium">{dob !== 'Not provided' ? new Date(dob).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : dob}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/5">
                                <Shield size={16} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5 font-medium uppercase tracking-wider">User ID</p>
                                <p className="text-slate-400 text-sm font-mono">{user.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/5">
                                <User size={16} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5 font-medium uppercase tracking-wider">Member since</p>
                                <p className="text-slate-200 font-medium">
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
