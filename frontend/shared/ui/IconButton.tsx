"use client";

import type { LucideIcon } from "lucide-react";
import { Tooltip } from "./Tooltip";

interface IconButtonProps {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
}

export function IconButton({ icon: Icon, label, onClick, disabled, active }: IconButtonProps) {
    return (
        <Tooltip label={label}>
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150 ${
                    disabled
                        ? "text-neutral-300 cursor-not-allowed"
                        : active
                            ? "bg-brand text-white"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-brand"
                }`}
            >
                <Icon size={18} strokeWidth={2} />
            </button>
        </Tooltip>
    );
}