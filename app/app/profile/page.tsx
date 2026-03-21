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
        <div className="animate-fade-in transition-colors duration-300">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white transition-colors duration-300">Profile</h1>
                    <p className="text-charcoal-500 dark:text-slate-400 mt-1 transition-colors duration-300">Your account details</p>
                </div>
                <EditProfileModal currentData={{ name: meta.name || '', dob: meta.dob || '', phone: meta.phone || '', bio: meta.bio || '' }} />
            </div>

            <div className="max-w-lg">
                <div className="warm-card p-6 space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 pb-5 border-b border-ivory-400 dark:border-white/10 transition-colors duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-gold-100 dark:bg-violet-500/20 border border-gold-300 dark:border-violet-500/30 flex items-center justify-center text-2xl font-bold text-gold-600 dark:text-violet-400 uppercase shadow-sm dark:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-colors duration-300">
                            {name[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-charcoal-900 dark:text-white font-semibold text-lg transition-colors duration-300">{name}</p>
                            <span className="badge-gold">Active</span>
                        </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 dark:bg-slate-800 dark:border dark:border-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300">
                                <BookOpen size={16} className="text-charcoal-400 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 dark:text-slate-500 mb-0.5 transition-colors duration-300">Bio</p>
                                <p className="text-charcoal-900 dark:text-slate-200 text-sm whitespace-pre-wrap transition-colors duration-300">{bio}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 dark:bg-slate-800 dark:border dark:border-white/5 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                                <Mail size={16} className="text-charcoal-400 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 dark:text-slate-500 mb-0.5 transition-colors duration-300">Email address</p>
                                <p className="text-charcoal-900 dark:text-slate-200 font-medium transition-colors duration-300">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 dark:bg-slate-800 dark:border dark:border-white/5 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                                <Phone size={16} className="text-charcoal-400 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 dark:text-slate-500 mb-0.5 transition-colors duration-300">Phone Number</p>
                                <p className="text-charcoal-900 dark:text-slate-200 font-medium transition-colors duration-300">{phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 dark:bg-slate-800 dark:border dark:border-white/5 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                                <Calendar size={16} className="text-charcoal-400 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 dark:text-slate-500 mb-0.5 transition-colors duration-300">Date of Birth</p>
                                <p className="text-charcoal-900 dark:text-slate-200 font-medium transition-colors duration-300">{dob !== 'Not provided' ? new Date(dob).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : dob}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 dark:bg-slate-800 dark:border dark:border-white/5 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                                <Shield size={16} className="text-charcoal-400 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 dark:text-slate-500 mb-0.5 transition-colors duration-300">User ID</p>
                                <p className="text-charcoal-600 dark:text-slate-400 text-sm font-mono transition-colors duration-300">{user.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 dark:bg-slate-800 dark:border dark:border-white/5 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                                <User size={16} className="text-charcoal-400 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 dark:text-slate-500 mb-0.5 transition-colors duration-300">Member since</p>
                                <p className="text-charcoal-900 dark:text-slate-200 font-medium transition-colors duration-300">
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
