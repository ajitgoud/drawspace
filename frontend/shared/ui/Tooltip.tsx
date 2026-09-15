"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

export function TooltipProvider({ children }: { children: ReactNode }) {
    return <RadixTooltip.Provider delayDuration={200}>{children}</RadixTooltip.Provider>;
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
    return (
        <RadixTooltip.Root>
            <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
            <RadixTooltip.Portal>
                <RadixTooltip.Content
                    side="right"
                    sideOffset={8}
                    className="rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-md animate-in fade-in-0 zoom-in-95"
                >
                    {label}
                    <RadixTooltip.Arrow className="fill-neutral-900" />
                </RadixTooltip.Content>
            </RadixTooltip.Portal>
        </RadixTooltip.Root>
    );
}