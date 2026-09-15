"use client";
import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { api } from "@/lib/api";

const ShareButton = ({ canvasId }: { canvasId: string }) => {
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleShare = async () => {
        setOpen(true);
        if (shareUrl) return; // already fetched this session
        setLoading(true);
        try {
            const { publicSlug } = await api.shareCanvas(canvasId);
            setShareUrl(`${window.location.origin}/public/${publicSlug}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!shareUrl) return;
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-md border border-panel-border px-3 py-1.5 text-sm text-zinc-600 hover:border-brand hover:text-brand"
            >
                <Share2 size={14} />
                Share
            </button>

            {open && (
                <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-md border border-panel-border bg-white p-3 shadow-lg">
                    <p className="mb-2 text-xs font-medium text-zinc-500">Public link</p>
                    {loading ? (
                        <p className="text-xs text-zinc-400">Generating…</p>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                readOnly
                                value={shareUrl ?? ""}
                                className="flex-1 truncate rounded-md border border-panel-border bg-zinc-50 px-2 py-1 text-xs text-zinc-700"
                            />
                            <button
                                onClick={handleCopy}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-panel-border text-zinc-500 hover:border-brand hover:text-brand"
                            >
                                {copied ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => setOpen(false)}
                        className="mt-2 text-[11px] text-zinc-400 hover:text-zinc-600"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShareButton;