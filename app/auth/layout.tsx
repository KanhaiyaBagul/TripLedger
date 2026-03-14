import { Banknote, CheckCircle2, RefreshCw } from 'lucide-react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen w-screen relative flex items-center justify-center bg-gradient-to-br from-[#fdfbf7] to-[#f5f1e6] overflow-hidden p-4 sm:p-8">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-[#c9a74a]/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#6b8f71]/15 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]"></div>

            {/* Abstract Geometric Elements */}
            <div className="absolute top-[15%] left-[10%] animate-[spin_120s_linear_infinite]">
                <svg className="opacity-20 text-[#c9a74a]" fill="none" height="150" viewBox="0 0 120 120" width="150" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="58" stroke="currentColor" strokeDasharray="10 10" strokeWidth="4"></circle>
                </svg>
            </div>

            {/* Connections Visualization */}
            <div className="absolute bottom-[10%] right-[10%] w-64 h-64 opacity-20 pointer-events-none animate-[float_12s_ease-in-out_infinite]">
                <svg fill="none" height="250" viewBox="0 0 200 200" width="250" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 190L190 10" stroke="#c9a74a" strokeWidth="2"></path>
                    <circle cx="10" cy="190" fill="#c9a74a" r="5"></circle>
                    <circle cx="190" cy="10" fill="#c9a74a" r="5"></circle>
                    <path d="M10 10C10 10 100 100 190 190" stroke="#6b8f71" strokeDasharray="8 8" strokeWidth="2"></path>
                </svg>
            </div>

            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1A1A1A 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>

            {/* Centered Authentication Card - no scrollbar */}
            <div className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-6 sm:p-10">
                {children}
            </div>
        </div>
    )
}
