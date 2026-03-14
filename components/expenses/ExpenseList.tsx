'use client'

import { useRouter } from 'next/navigation'
import { Trash2, Receipt } from 'lucide-react'
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
            <div className="text-center py-12">
                <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-400">No expenses yet. Add the first one!</p>
            </div>
        )
    }

    return (
        <div>
            <div className="overflow-hidden rounded-xl border border-white/[0.08]">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.08] bg-navy-900/50">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Description</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Paid By</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Split</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Date</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {expenses.map((expense) => {
                            const payer = memberMap.get(expense.paid_by)
                            return (
                                <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-4 py-3.5">
                                        <span className="text-white font-medium">{expense.description}</span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <span className="text-amber-400 font-semibold">{formatCurrency(Number(expense.amount))}</span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        {payer && (
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-full ${getAvatarColor(payer.index)} flex items-center justify-center text-xs font-semibold text-white`}>
                                                    {getInitials(payer.email)}
                                                </div>
                                                <span className="text-slate-300 text-sm truncate max-w-[120px]">{payer.email.split('@')[0]}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className="badge-slate">{expense.expense_participants.length}</span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-400 text-sm">{formatDate(expense.created_at)}</td>
                                    <td className="px-4 py-3.5">
                                        <button
                                            onClick={() => deleteExpense(expense.id)}
                                            className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-white/[0.08] bg-navy-900/50">
                            <td colSpan={4} className="px-4 py-3 text-sm text-slate-400 font-medium">Total</td>
                            <td colSpan={2} className="px-4 py-3 text-right">
                                <span className="text-white font-bold text-lg">{formatCurrency(total)}</span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
