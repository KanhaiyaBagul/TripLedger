export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-ivory-100 px-4" style={{ backgroundImage: 'radial-gradient(ellipse at 70% 10%, rgba(201,168,76,0.12) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(107,143,113,0.08) 0%, transparent 50%)' }}>
            {children}
        </div>
    )
}

