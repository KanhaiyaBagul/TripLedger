'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

type ProfileData = {
    name: string;
    dob: string;
    phone: string;
    bio: string;
}

export default function EditProfileModal({ currentData }: { currentData: ProfileData }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(currentData.name || '')
    const [dob, setDob] = useState(currentData.dob || '')
    const [phone, setPhone] = useState(currentData.phone || '')
    const [bio, setBio] = useState(currentData.bio || '')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    function handleClose() {
        setOpen(false)
        setName(currentData.name || '')
        setDob(currentData.dob || '')
        setPhone(currentData.phone || '')
        setBio(currentData.bio || '')
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    name,
                    dob,
                    phone,
                    bio
                }
            })
            if (error) throw error

            toast.success('Profile updated successfully!')
            setOpen(false)
            router.refresh()
        } catch (err: any) {
            toast.error(err.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <motion.button
                onClick={() => setOpen(true)}
                className="btn-ghost flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                <Edit2 size={16} />
                Edit Profile
            </motion.button>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={handleClose}
                        />
                        <motion.div
                            className="relative warm-card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
                            initial={{ opacity: 0, scale: 0.94, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 16 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-charcoal-900">Edit Profile</h2>
                                <motion.button
                                    onClick={handleClose}
                                    type="button"
                                    className="text-charcoal-400 hover:text-charcoal-900 transition-colors p-1 rounded-lg hover:bg-ivory-200"
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm text-charcoal-600 mb-1.5 font-medium">Full Name</label>
                                    <input
                                        id="name"
                                        className="form-input w-full"
                                        placeholder="e.g. John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dob" className="block text-sm text-charcoal-600 mb-1.5 font-medium">Date of Birth</label>
                                    <input
                                        id="dob"
                                        type="date"
                                        className="form-input w-full"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm text-charcoal-600 mb-1.5 font-medium">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="form-input w-full"
                                        placeholder="+1 234 567 890"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="bio" className="block text-sm text-charcoal-600 mb-1.5 font-medium">Bio</label>
                                    <textarea
                                        id="bio"
                                        rows={3}
                                        className="form-input w-full resize-none"
                                        placeholder="Tell us about yourself..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={handleClose} className="btn-ghost flex-1">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-1 flex justify-center items-center">
                                        {loading
                                            ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : 'Save Changes'
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
