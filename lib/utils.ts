import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = '₹') {
    return `${currency}${amount.toLocaleString('en-IN')}`
}

export function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export const AVATAR_COLORS = [
    'bg-violet-600',
    'bg-blue-600',
    'bg-emerald-600',
    'bg-amber-600',
    'bg-rose-600',
    'bg-cyan-600',
    'bg-pink-600',
    'bg-indigo-600',
]

export function getAvatarColor(index: number) {
    return AVATAR_COLORS[index % AVATAR_COLORS.length]
}
