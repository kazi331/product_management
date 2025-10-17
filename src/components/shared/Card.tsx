import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export function Card({ children, className }: { children: ReactNode, className?: string }) {
    return (<div className={cn("bg-white border border-slate-200 rounded-lg shadow-xs transition-all hover:shadow-md overflow-hidden p-4", className)}>{children}</div>)
}

export function CardHeader({ children, className }: { children: ReactNode, className?: string }) {
    return (<div className={cn("border-b border-slate-200 px-4 py-2 font-semibold bg-gray-50", className)}>{children}</div>)
}

export function CardContent({ children, className }: { children: ReactNode, className?: string }) {
    return (<div className="p-4">{children}</div>)
}

export function CardFooter({ children, className }: { children: ReactNode, className?: string }) {
    return (<div className="border-t border-slate-200 px-4 py-2 bg-gray-50">{children}</div>)
}

