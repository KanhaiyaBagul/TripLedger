export interface SettlementTransaction {
    from: string
    fromEmail: string
    to: string
    toEmail: string
    amount: number
}

export interface ParticipantBalance {
    userId: string
    email: string
    totalPaid: number
    totalShare: number
    netBalance: number // positive = owed money, negative = owes money
}

interface Expense {
    id: string
    amount: number
    paid_by: string
    participants: string[]
}

interface UserInfo {
    id: string
    email: string
}

/**
 * Greedy settlement algorithm.
 * Minimises the number of transactions needed to settle all debts.
 */
export function computeSettlements(
    expenses: Expense[],
    users: UserInfo[]
): { balances: ParticipantBalance[]; transactions: SettlementTransaction[] } {
    const userMap = new Map(users.map((u) => [u.id, u.email]))
    const paid = new Map<string, number>()
    const share = new Map<string, number>()

    // Initialise maps
    users.forEach((u) => {
        paid.set(u.id, 0)
        share.set(u.id, 0)
    })

    // Tally paid amounts and each person's share per expense
    for (const expense of expenses) {
        const payer = expense.paid_by
        paid.set(payer, (paid.get(payer) ?? 0) + expense.amount)

        const perPerson = expense.amount / expense.participants.length
        for (const uid of expense.participants) {
            share.set(uid, (share.get(uid) ?? 0) + perPerson)
        }
    }

    // Compute net balances
    const balances: ParticipantBalance[] = users.map((u) => {
        const totalPaid = paid.get(u.id) ?? 0
        const totalShare = share.get(u.id) ?? 0
        return {
            userId: u.id,
            email: u.email,
            totalPaid,
            totalShare,
            netBalance: Math.round((totalPaid - totalShare) * 100) / 100,
        }
    })

    // Greedy matching
    const creditors = balances
        .filter((b) => b.netBalance > 0.01)
        .map((b) => ({ ...b }))
        .sort((a, b) => b.netBalance - a.netBalance)

    const debtors = balances
        .filter((b) => b.netBalance < -0.01)
        .map((b) => ({ ...b }))
        .sort((a, b) => a.netBalance - b.netBalance) // most negative first

    const transactions: SettlementTransaction[] = []

    let i = 0
    let j = 0

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i]
        const creditor = creditors[j]

        const amount = Math.min(
            Math.abs(debtor.netBalance),
            creditor.netBalance
        )
        const rounded = Math.round(amount * 100) / 100

        if (rounded > 0.01) {
            transactions.push({
                from: debtor.userId,
                fromEmail: userMap.get(debtor.userId) ?? debtor.userId,
                to: creditor.userId,
                toEmail: userMap.get(creditor.userId) ?? creditor.userId,
                amount: rounded,
            })
        }

        debtor.netBalance += rounded
        creditor.netBalance -= rounded

        if (Math.abs(debtor.netBalance) < 0.01) i++
        if (Math.abs(creditor.netBalance) < 0.01) j++
    }

    return { balances, transactions }
}
