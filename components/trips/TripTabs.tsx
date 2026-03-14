'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TripTabsProps {
    expensesTab: React.ReactNode
    membersTab: React.ReactNode
    settlementsTab: React.ReactNode
}

const TABS = [
    { key: 'expenses', label: 'Expenses' },
    { key: 'members', label: 'Members' },
    { key: 'settlements', label: 'Settlements' },
] as const

type TabKey = typeof TABS[number]['key']

export default function TripTabs({ expensesTab, membersTab, settlementsTab }: TripTabsProps) {
    const [active, setActive] = useState<TabKey>('expenses')

    const contentMap: Record<TabKey, React.ReactNode> = {
        expenses: expensesTab,
        members: membersTab,
        settlements: settlementsTab,
    }

    return (
        <div>
            {/* Tab bar */}
            <div className="flex border-b border-white/[0.08] mb-6 relative">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActive(tab.key)}
                        className={`tab-btn relative ${active === tab.key ? 'active' : ''}`}
                    >
                        {tab.label}
                        {/* Sliding underline indicator */}
                        {active === tab.key && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-t-full"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
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
