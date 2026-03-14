'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Plane,
    ArrowLeftRight,
    LogOut,
    User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
    { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/settlements', label: 'Settlements', icon: ArrowLeftRight },
    { href: '/app/profile', label: 'Profile', icon: User },
]

interface SidebarProps {
    userEmail?: string
}

export default function Sidebar({ userEmail }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    async function handleLogout() {
        await supabase.auth.signOut()
        toast.success('Logged out')
        router.push('/auth/login')
        router.refresh()
    }

    return (
        <aside className="w-60 flex-shrink-0 h-screen sticky top-0 flex flex-col bg-white border-r border-ivory-400">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-ivory-400">
                <Link href="/app/dashboard" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center group-hover:bg-gold-200 transition-colors">
                        <Plane className="w-5 h-5 text-gold-600" />
                    </div>
                    <span className="font-bold text-lg text-charcoal-900">TripLedger</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive =
                        href === '/app/dashboard'
                            ? pathname === href || pathname.startsWith('/app/trips')
                            : pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-gold-100 text-gold-700'
                                    : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-ivory-200'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-indicator"
                                    className="absolute inset-0 bg-gold-100 border border-gold-200 rounded-xl"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <Icon
                                size={18}
                                className={cn('relative z-10', isActive ? 'text-gold-600' : 'text-current')}
                            />
                            <span className="relative z-10">{label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User section */}
            <div className="px-3 py-4 border-t border-ivory-400">
                {userEmail && (
                    <div className="px-4 py-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center text-xs font-bold text-gold-700 uppercase">
                                {userEmail[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-charcoal-500 truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:text-terra-400 hover:bg-terra-100 transition-all duration-200"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </aside>
    )
}
