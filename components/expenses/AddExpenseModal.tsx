'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency, getAvatarColor, getInitials } from '@/lib/utils'

interface Member {
    user_id: string
    email: string
    role: string
}

interface AddExpenseModalProps {
    tripId: string
    members: Member[]
    currentUserId: string
}

export default function AddExpenseModal({ tripId, members, currentUserId }: AddExpenseModalProps) {
    const [open, setOpen] = useState(false)
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [paidBy, setPaidBy] = useState(currentUserId)
    const [participants, setParticipants] = useState<string[]>(members.map((m) => m.user_id))
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const perPerson =
        participants.length > 0 && Number(amount) > 0
            ? Number(amount) / participants.length
            : 0

    function toggleParticipant(uid: string) {
        setParticipants((prev) =>
            prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (participants.length === 0) { toast.error('Select at least one participant'); return }
        setLoading(true)
        try {
            const res = await fetch(`/api/trips/${tripId}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    amount: Number(amount),
                    paid_by: paidBy,
                    participants,
                }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to add expense')
            }
            toast.success('Expense added!')
            setOpen(false)
            setDescription('')
            setAmount('')
            setPaidBy(currentUserId)
            setParticipants(members.map((m) => m.user_id))
            router.refresh()
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
                <Plus size={18} /> Add Expense
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
                    <div className="relative glass-modal w-full max-w-md p-6 animate-slide-up overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Add New Expense</h2>
                            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5 font-medium">What was it for?</label>
                                <input
                                    required
                                    className="form-input"
                                    placeholder="e.g. Hotel booking, Train tickets, Food"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                                    <input
                                        required
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        className="form-input pl-8"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Who paid?</label>
                                <select
                                    className="form-input"
                                    value={paidBy}
                                    onChange={(e) => setPaidBy(e.target.value)}
                                >
                                    {members.map((m, i) => (
                                        <option key={m.user_id} value={m.user_id}>
                                            {m.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm text-slate-400 font-medium">Split between</label>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setParticipants(members.map(m => m.user_id))} className="text-xs text-violet-400 hover:underline">All</button>
                                        <span className="text-slate-600">·</span>
                                        <button type="button" onClick={() => setParticipants([])} className="text-xs text-slate-400 hover:text-white">Clear</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {members.map((m, i) => (
                                        <label key={m.user_id} className="flex items-center gap-3 p-3 rounded-lg bg-navy-900/50 border border-white/[0.06] cursor-pointer hover:border-violet-500/30 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={participants.includes(m.user_id)}
                                                onChange={() => toggleParticipant(m.user_id)}
                                                className="w-4 h-4 accent-violet-600 rounded"
                                            />
                                            <div className={`w-7 h-7 rounded-full ${getAvatarColor(i)} flex items-center justify-center text-xs font-semibold text-white`}>
                                                {getInitials(m.email)}
                                            </div>
                                            <span className="text-sm text-white truncate">{m.email}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {perPerson > 0 && (
                                <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                                    <p className="text-sm text-slate-400">
                                        Each person pays: <span className="text-emerald-400 font-semibold text-base">{formatCurrency(perPerson)}</span>
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setOpen(false)} className="btn-ghost flex-1">Cancel</button>
                                <button type="submit" disabled={loading} className="btn-primary flex-1">
                                    {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
