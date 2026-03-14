'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Trash2 } from 'lucide-react'
import { getAvatarColor, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Member {
    user_id: string
    email: string
    role: string
}

interface MembersPanelProps {
    members: Member[]
    tripId: string
    currentUserId: string
    isOwner: boolean
}

export default function MembersPanel({ members, tripId, currentUserId, isOwner }: MembersPanelProps) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function inviteMember(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`/api/trips/${tripId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to invite')
            toast.success('Member invited!')
            setEmail('')
            router.refresh()
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Member list */}
            <div className="glass-card overflow-hidden">
                <div className="divide-y divide-white/[0.05]">
                    {members.map((member, i) => (
                        <div key={member.user_id} className="flex items-center gap-4 px-5 py-4">
                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(i)} flex items-center justify-center text-sm font-semibold text-white flex-shrink-0`}>
                                {getInitials(member.email)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{member.email}</p>
                            </div>
                            <span className={member.role === 'owner' ? 'badge-violet' : 'badge-slate'}>
                                {member.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invite form */}
            {isOwner && (
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <UserPlus size={16} className="text-violet-400" />
                        Invite Member by Email
                    </h3>
                    <form onSubmit={inviteMember} className="flex gap-3">
                        <input
                            type="email"
                            required
                            className="form-input flex-1"
                            placeholder="friend@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
                            {loading
                                ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : 'Send Invite'
                            }
                        </button>
                    </form>
                    <p className="text-xs text-slate-500 mt-2">They must already have a TripLedger account.</p>
                </div>
            )}
        </div>
    )
}
