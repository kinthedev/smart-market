import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn("field-control min-h-28 resize-y py-3 leading-relaxed", className)}
            {...props}
        />
    )
}

export { Textarea }
