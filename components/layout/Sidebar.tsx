'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
        <aside className="w-60 flex-shrink-0 h-screen sticky top-0 flex flex-col bg-navy-900 border-r border-white/[0.05]">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/[0.05]">
                <Link href="/app/dashboard" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center group-hover:bg-violet-600/30 transition-colors">
                        <Plane className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="font-bold text-lg text-white">TripLedger</span>
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
                                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-violet-600/20 text-white border border-violet-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                            )}
                        >
                            <Icon
                                size={18}
                                className={isActive ? 'text-violet-400' : 'text-current'}
                            />
                            {label}
                        </Link>
                    )
                })}
            </nav>

            {/* User section */}
            <div className="px-3 py-4 border-t border-white/[0.05]">
                {userEmail && (
                    <div className="px-4 py-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-xs font-semibold text-violet-300 uppercase">
                                {userEmail[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </aside>
    )
}
