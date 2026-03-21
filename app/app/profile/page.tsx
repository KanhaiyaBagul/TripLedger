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
        <div className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900">Profile</h1>
                    <p className="text-charcoal-500 mt-1">Your account details</p>
                </div>
                <EditProfileModal currentData={{ name: meta.name || '', dob: meta.dob || '', phone: meta.phone || '', bio: meta.bio || '' }} />
            </div>

            <div className="max-w-lg">
                <div className="warm-card p-6 space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 pb-5 border-b border-ivory-400">
                        <div className="w-16 h-16 rounded-2xl bg-gold-100 border border-gold-300 flex items-center justify-center text-2xl font-bold text-gold-600 uppercase">
                            {name[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-charcoal-900 font-semibold text-lg">{name}</p>
                            <span className="badge-gold">Active</span>
                        </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <BookOpen size={16} className="text-charcoal-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 mb-0.5">Bio</p>
                                <p className="text-charcoal-900 text-sm whitespace-pre-wrap">{bio}</p>
                            </div>
                        </div>

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
                                <Phone size={16} className="text-charcoal-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 mb-0.5">Phone Number</p>
                                <p className="text-charcoal-900 font-medium">{phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-ivory-200 flex items-center justify-center flex-shrink-0">
                                <Calendar size={16} className="text-charcoal-400" />
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 mb-0.5">Date of Birth</p>
                                <p className="text-charcoal-900 font-medium">{dob !== 'Not provided' ? new Date(dob).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : dob}</p>
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
