'use client'

import { useState } from 'react'

interface TripTabsProps {
    expensesTab: React.ReactNode
    membersTab: React.ReactNode
    settlementsTab: React.ReactNode
}

export default function TripTabs({ expensesTab, membersTab, settlementsTab }: TripTabsProps) {
    const [active, setActive] = useState('expenses')

    return (
        <div>
            {/* Tab bar */}
            <div className="flex border-b border-white/[0.08] mb-6">
                <button
                    onClick={() => setActive('expenses')}
                    className={`tab-btn ${active === 'expenses' ? 'active' : ''}`}
                >
                    Expenses
                </button>
                <button
                    onClick={() => setActive('members')}
                    className={`tab-btn ${active === 'members' ? 'active' : ''}`}
                >
                    Members
                </button>
                <button
                    onClick={() => setActive('settlements')}
                    className={`tab-btn ${active === 'settlements' ? 'active' : ''}`}
                >
                    Settlements
                </button>
            </div>
            {/* Tab content */}
            {active === 'expenses' && expensesTab}
            {active === 'members' && membersTab}
            {active === 'settlements' && settlementsTab}
        </div>
    )
}
