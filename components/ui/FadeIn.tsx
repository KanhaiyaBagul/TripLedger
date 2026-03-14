'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInProps {
    children: ReactNode
    delay?: number
    duration?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    className?: string
    once?: boolean
}

const directionOffset = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { x: 24, y: 0 },
    right: { x: -24, y: 0 },
    none: { x: 0, y: 0 },
}

export default function FadeIn({
    children,
    delay = 0,
    duration = 0.5,
    direction = 'up',
    className,
    once = true,
}: FadeInProps) {
    const { x, y } = directionOffset[direction]

    const variants: Variants = {
        hidden: { opacity: 0, x, y },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] },
        },
    }

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once }}
            variants={variants}
        >
            {children}
        </motion.div>
    )
}

// Staggered container for animating children one by one
interface StaggerProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
    delayStart?: number
}

export function StaggerContainer({ children, className, staggerDelay = 0.08, delayStart = 0 }: StaggerProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: delayStart,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
                },
            }}
        >
            {children}
        </motion.div>
    )
}
