export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-navy-900 bg-violet-glow px-4">
            {children}
        </div>
    )
}
