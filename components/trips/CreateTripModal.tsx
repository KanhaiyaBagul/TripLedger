'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function CreateTripModal() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    function handleClose() {
        setOpen(false)
        setName('')
        setDescription('')
    }

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
                <Plus size={18} />
                New Trip
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
                            className="relative glass-modal w-full max-w-md p-6"
                            initial={{ opacity: 0, scale: 0.94, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 16 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Create New Trip</h2>
                                <motion.button
                                    onClick={handleClose}
                                    className="text-slate-400 hover:text-white transition-colors"
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={20} />
                                </motion.button>
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
                                    <button type="button" onClick={handleClose} className="btn-ghost flex-1">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                                        {loading
                                            ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : 'Create Trip'
                                        }
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
