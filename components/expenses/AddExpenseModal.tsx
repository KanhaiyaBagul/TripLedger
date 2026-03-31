'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

    function handleClose() {
        setOpen(false)
        setDescription('')
        setAmount('')
        setPaidBy(currentUserId)
        setParticipants(members.map((m) => m.user_id))
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
            handleClose()
            router.refresh()
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <motion.button
                onClick={() => setOpen(true)}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                <Plus size={18} /> Add Expense
            </motion.button>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={handleClose}
                        />
                        {/* Modal */}
                        <motion.div
                            className="relative warm-modal w-full max-w-md p-6 sm:p-8 overflow-y-auto max-h-[90vh] m-4"
                            initial={{ opacity: 0, scale: 0.94, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 16 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-charcoal-900">Add New Expense</h2>
                                <motion.button
                                    onClick={handleClose}
                                    aria-label="Close modal"
                                    className="text-charcoal-400 hover:text-charcoal-900 transition-colors p-1 rounded-lg hover:bg-ivory-200"
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-charcoal-500 mb-1.5 font-medium">What was it for?</label>
                                    <input
                                        required
                                        className="form-input"
                                        placeholder="e.g. Hotel booking, Train tickets, Food"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-charcoal-500 mb-1.5 font-medium">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400 font-medium">₹</span>
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
                                    <label className="block text-sm text-charcoal-500 mb-1.5 font-medium">Who paid?</label>
                                    <select
                                        className="form-input"
                                        value={paidBy}
                                        onChange={(e) => setPaidBy(e.target.value)}
                                    >
                                        {members.map((m) => (
                                            <option key={m.user_id} value={m.user_id}>
                                                {m.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm text-charcoal-500 font-medium">Split between</label>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setParticipants(members.map(m => m.user_id))} className="text-xs text-gold-600 font-bold hover:underline">Select All</button>
                                            <span className="text-ivory-500">|</span>
                                            <button type="button" onClick={() => setParticipants([])} className="text-xs text-charcoal-400 font-bold hover:text-charcoal-900 transition-colors">Clear</button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {members.map((m, i) => (
                                            <label key={m.user_id} className="flex items-center gap-3 p-3 rounded-xl bg-ivory-100 border border-ivory-300 cursor-pointer hover:border-gold-400 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={participants.includes(m.user_id)}
                                                    onChange={() => toggleParticipant(m.user_id)}
                                                    className="w-4 h-4 accent-gold-600 rounded border-ivory-400"
                                                />
                                                <div className={`w-8 h-8 rounded-full ${getAvatarColor(i)} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                                    {getInitials(m.email)}
                                                </div>
                                                <span className="text-sm text-charcoal-900 truncate font-semibold">{m.email}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {perPerson > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 rounded-xl border border-sage-300 bg-sage-100 shadow-sm">
                                                <p className="text-xs text-charcoal-500 font-bold uppercase tracking-wider mb-1">Each person owes</p>
                                                <p className="text-2xl font-extrabold text-sage-600">{formatCurrency(perPerson)}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={handleClose} className="btn-ghost flex-1">Cancel</button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                                        {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Expense'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
