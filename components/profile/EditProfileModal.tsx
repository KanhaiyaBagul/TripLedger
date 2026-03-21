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

    const inputClasses = "w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all";
    const labelClasses = "block text-sm text-slate-300 mb-1.5 font-medium tracking-wide";

    return (
        <>
            <motion.button
                onClick={() => setOpen(true)}
                className="border border-white/10 text-slate-200 hover:bg-slate-800 hover:text-white font-semibold rounded-full px-5 py-2.5 transition-all flex items-center gap-2 bg-[#1e293b]"
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={handleClose}
                        />
                        <motion.div
                            className="relative bg-[#1e293b] border border-white/10 w-full max-w-md p-8 max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
                            initial={{ opacity: 0, scale: 0.94, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 16 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                                <motion.button
                                    onClick={handleClose}
                                    type="button"
                                    className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-slate-800"
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-5">
                                <div>
                                    <label htmlFor="name" className={labelClasses}>Full Name</label>
                                    <input
                                        id="name"
                                        className={inputClasses}
                                        placeholder="e.g. John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dob" className={labelClasses}>Date of Birth</label>
                                    <input
                                        id="dob"
                                        type="date"
                                        className={inputClasses}
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className={inputClasses}
                                        placeholder="+1 234 567 890"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="bio" className={labelClasses}>Bio</label>
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        className={`${inputClasses} resize-none`}
                                        placeholder="Tell us about yourself..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={handleClose} className="border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold rounded-full flex-1 py-3 transition-all">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-full flex-1 py-3 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] flex justify-center items-center">
                                        {loading
                                            ? <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
