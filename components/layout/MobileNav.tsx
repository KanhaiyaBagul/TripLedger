'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, User, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import CreateTripModal from '@/components/trips/CreateTripModal'

const NAV_ITEMS_LEFT = [
    { href: '/app/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/app/settlements', label: 'Bills', icon: ArrowLeftRight },
]

const NAV_ITEMS_RIGHT = [
    { href: '/app/profile', label: 'User', icon: User },
]

export default function MobileNav() {
    const pathname = usePathname()

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-ivory-400 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-around h-16 px-2 relative">
                {NAV_ITEMS_LEFT.map(({ href, label, icon: Icon }) => {
                    const isActive =
                        href === '/app/dashboard'
                            ? pathname === href || pathname.startsWith('/app/trips')
                            : pathname === href
                    
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'relative flex flex-col items-center justify-center gap-1 w-full h-full text-[10px] font-bold transition-all duration-300',
                                isActive ? 'text-gold-600' : 'text-charcoal-400'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-indicator"
                                    className="absolute -top-[1px] w-8 h-1 bg-gold-500 rounded-b-full"
                                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                />
                            )}
                            <Icon size={18} className={cn('transition-transform duration-300', isActive && 'scale-110')} />
                            <span>{label}</span>
                        </Link>
                    )
                })}

                {/* Integrated "New" action */}
                <div className="flex items-center justify-center w-full h-full">
                    <CreateTripModal variant="tab" />
                </div>

                {NAV_ITEMS_RIGHT.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'relative flex flex-col items-center justify-center gap-1 w-full h-full text-[10px] font-bold transition-all duration-300',
                                isActive ? 'text-gold-600' : 'text-charcoal-400'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-indicator"
                                    className="absolute -top-[1px] w-8 h-1 bg-gold-500 rounded-b-full"
                                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                />
                            )}
                            <Icon size={18} className={cn('transition-transform duration-300', isActive && 'scale-110')} />
                            <span>{label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
