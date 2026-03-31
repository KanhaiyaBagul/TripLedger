'use client'

import { useRouter } from 'next/navigation'
import { Trash2, Receipt } from 'lucide-react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { formatCurrency, formatDate, getAvatarColor, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Expense {
    id: string
    description: string
    amount: number
    paid_by: string
    created_at: string
    expense_participants: { user_id: string }[]
}

interface Member {
    user_id: string
    email: string
}

interface ExpenseListProps {
    expenses: Expense[]
    members: Member[]
    tripId: string
    currentUserId: string
}

function rowMotionProps(i: number): HTMLMotionProps<'tr'> {
    return {
        initial: { opacity: 0, x: -12 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
    }
}

export default function ExpenseList({ expenses, members, tripId, currentUserId }: ExpenseListProps) {
    const router = useRouter()
    const memberMap = new Map(members.map((m, i) => [m.user_id, { email: m.email, index: i }]))

    async function deleteExpense(eid: string) {
        if (!confirm('Delete this expense?')) return
        const res = await fetch(`/api/trips/${tripId}/expenses/${eid}`, { method: 'DELETE' })
        if (res.ok) { toast.success('Expense deleted'); router.refresh() }
        else toast.error('Failed to delete expense')
    }

    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

    if (expenses.length === 0) {
        return (
            <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <div className="w-12 h-12 rounded-xl bg-ivory-200 flex items-center justify-center mx-auto mb-4 border border-ivory-400">
                    <Receipt className="w-6 h-6 text-charcoal-300" />
                </div>
                <p className="text-charcoal-500">No expenses yet. Add the first one!</p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-ivory-400 bg-white shadow-warm-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-ivory-400 bg-ivory-100/50">
                            <th className="text-left px-5 py-4 text-xs font-bold text-charcoal-500 uppercase tracking-wider">Description</th>
                            <th className="text-right px-5 py-4 text-xs font-bold text-charcoal-500 uppercase tracking-wider">Amount</th>
                            <th className="text-left px-5 py-4 text-xs font-bold text-charcoal-500 uppercase tracking-wider">Paid By</th>
                            <th className="text-center px-5 py-4 text-xs font-bold text-charcoal-500 uppercase tracking-wider">Split</th>
                            <th className="text-left px-5 py-4 text-xs font-bold text-charcoal-500 uppercase tracking-wider">Date</th>
                            <th className="px-5 py-4" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-300">
                        {expenses.map((expense, i) => {
                            const payer = memberMap.get(expense.paid_by)
                            return (
                                <motion.tr
                                    key={expense.id}
                                    {...rowMotionProps(i)}
                                    className="hover:bg-ivory-100/30 transition-colors group"
                                >
                                    <td className="px-5 py-4">
                                        <span className="text-charcoal-900 font-semibold">{expense.description}</span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <span className="text-gold-600 font-bold">{formatCurrency(Number(expense.amount))}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {payer && (
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full ${getAvatarColor(payer.index)} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                                    {getInitials(payer.email)}
                                                </div>
                                                <span className="text-charcoal-600 text-sm font-medium truncate max-w-[120px]">{payer.email.split('@')[0]}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="badge-slate font-bold">{expense.expense_participants.length}</span>
                                    </td>
                                    <td className="px-5 py-4 text-charcoal-400 text-sm font-medium">{formatDate(expense.created_at)}</td>
                                    <td className="px-5 py-4">
                                        <motion.button
                                            onClick={() => deleteExpense(expense.id)}
                                            className="p-2 text-charcoal-300 hover:text-terra-500 hover:bg-terra-100 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-ivory-400 bg-ivory-100/50">
                            <td colSpan={4} className="px-5 py-4 text-sm text-charcoal-500 font-bold">Total Trip Expenses</td>
                            <td colSpan={2} className="px-5 py-4 text-right">
                                <span className="text-charcoal-900 font-extrabold text-xl">{formatCurrency(total)}</span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-4">
                {expenses.map((expense, i) => {
                    const payer = memberMap.get(expense.paid_by)
                    return (
                        <motion.div
                            key={expense.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="warm-card p-4 relative"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-bold text-charcoal-900 text-lg leading-tight">{expense.description}</h4>
                                    <p className="text-xs text-charcoal-400 font-medium mt-1 uppercase tracking-wider">{formatDate(expense.created_at)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-extrabold text-gold-600 leading-tight">{formatCurrency(Number(expense.amount))}</p>
                                    <span className="badge-slate mt-1.5 font-bold">{expense.expense_participants.length} split</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-ivory-300">
                                <div className="flex items-center gap-2.5">
                                    {payer && (
                                        <>
                                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(payer.index)} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                                {getInitials(payer.email)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">Paid by</p>
                                                <p className="text-sm font-semibold text-charcoal-900">{payer.email.split('@')[0]}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteExpense(expense.id)}
                                    className="p-2.5 text-terra-400 hover:bg-terra-100 rounded-xl transition-colors active:scale-95"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
                
                {/* Mobile Total */}
                <div className="warm-card p-5 bg-ivory-200/50 border-dashed flex items-center justify-between">
                    <span className="text-charcoal-500 font-bold uppercase tracking-widest text-xs">Total Expenses</span>
                    <span className="text-2xl font-extrabold text-charcoal-900">{formatCurrency(total)}</span>
                </div>
            </div>
        </div>
    )
}
