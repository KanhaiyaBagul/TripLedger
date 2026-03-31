'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TripTabsProps {
    expensesTab: React.ReactNode
    membersTab: React.ReactNode
    settlementsTab: React.ReactNode
    activitiesTab: React.ReactNode
}

const TABS = [
    { key: 'expenses', label: 'Expenses' },
    { key: 'members', label: 'Members' },
    { key: 'settlements', label: 'Settlements' },
    { key: 'activities', label: 'Activity' },
] as const

type TabKey = typeof TABS[number]['key']

export default function TripTabs({ expensesTab, membersTab, settlementsTab, activitiesTab }: TripTabsProps) {
    const [active, setActive] = useState<TabKey>('expenses')

    const contentMap: Record<TabKey, React.ReactNode> = {
        expenses: expensesTab,
        members: membersTab,
        settlements: settlementsTab,
        activities: activitiesTab,
    }

    return (
        <div>
            {/* Tab bar */}
            <div className="flex border-b border-ivory-400 mb-6 relative overflow-x-auto hide-scrollbar whitespace-nowrap">
                <div className="flex min-w-full sm:min-w-0">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActive(tab.key)}
                            className={`tab-btn relative flex-shrink-0 font-bold px-6 py-4 uppercase tracking-widest text-[10px] ${active === tab.key ? 'active' : ''}`}
                        >
                            {tab.label}
                            {/* Sliding underline indicator */}
                            {active === tab.key && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-t-full shadow-[0_-2px_8px_rgba(201,168,76,0.5)]"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Animated tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                    {contentMap[active]}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
