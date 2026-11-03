import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "cn"

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
    return (
        <div className="relative w-full">
            <select
                data-slot="select"
                className={cn("field-control h-11 cursor-pointer appearance-none pr-10", className)}
                {...props}
            >
                {children}
            </select>
            <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
        </div>
    )
}

export { Select }
