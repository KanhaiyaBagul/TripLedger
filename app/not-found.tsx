export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-navy-900">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-violet-500 mb-4">404</h1>
                <p className="text-slate-400 text-lg mb-6">This page doesn&apos;t exist.</p>
                <a href="/app/dashboard" className="btn-primary inline-block">Go to Dashboard</a>
            </div>
        </div>
    )
}
