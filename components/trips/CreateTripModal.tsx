'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateTripModal() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to create trip')
            }
            toast.success('Trip created!')
            setOpen(false)
            setName('')
            setDescription('')
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
                <Plus size={18} />
                New Trip
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
                    <div className="relative glass-modal w-full max-w-md p-6 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Create New Trip</h2>
                            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Trip Name</label>
                                <input
                                    required
                                    className="form-input"
                                    placeholder="e.g. Goa Trip 2026"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Description (optional)</label>
                                <textarea
                                    rows={3}
                                    className="form-input resize-none"
                                    placeholder="What's this trip about?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setOpen(false)} className="btn-ghost flex-1">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="btn-primary flex-1">
                                    {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Trip'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
