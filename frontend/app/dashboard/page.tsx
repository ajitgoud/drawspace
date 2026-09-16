"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, FileEdit, LogOut } from "lucide-react";
import { api, getToken, clearToken } from "@/lib/api";

type CanvasSummary = {
    id: string;
    title: string;
    updatedAt: string;
};

const DashboardPage = () => {
    const router = useRouter();
    const [canvases, setCanvases] = useState<CanvasSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.listCanvases();
            // Client-side safety net — backend should already return newest
            // first (see CanvasRepository.findByOwnerIdOrderByUpdatedAtDesc),
            // but sorting here too means the UI stays correct even if that
            // changes, and costs nothing at this list size.
            const sorted = [...data].sort(
                (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            setCanvases(sorted);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load canvases");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        clearToken();
        router.push("/login");
    };

    useEffect(() => {
        // Route guard: this page requires auth, but we keep it a client-side
        // check rather than middleware for now — every API call is already
        // JWT-protected server-side, so this is a UX convenience, not the
        // security boundary.
        if (!getToken()) {
            router.replace("/login");
            return;
        }
        load();
    }, [load, router]);

    const handleCreate = async () => {
        setCreating(true);
        try {
            const created = await api.createCanvas("Untitled canvas");
            router.push(`/editor/${created.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create canvas");
            setCreating(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this canvas? This cannot be undone.")) return;
        try {
            await api.deleteCanvas(id);
            setCanvases((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete canvas");
        }
    };

    return (
        <main className="min-h-screen bg-canvas-bg px-8 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-800">Your canvases</h1>
                        <p className="text-sm text-zinc-400">Pick one up, or start something new</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCreate}
                            disabled={creating}
                            className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-hover disabled:opacity-60"
                        >
                            <Plus size={15} />
                            {creating ? "Creating…" : "New canvas"}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-md border border-panel-border px-3 py-2 text-sm text-zinc-500 transition hover:border-red-300 hover:text-red-500"
                        >
                            <LogOut size={15} />
                            Log out
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-sm text-zinc-400">Loading…</p>
                ) : canvases.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-panel-border py-16 text-center">
                        <p className="text-sm text-zinc-400">No canvases yet</p>
                        <button onClick={handleCreate} className="text-sm font-medium text-brand hover:text-brand-hover">
                            Create your first one
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {canvases.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => router.push(`/editor/${c.id}`)}
                                className="group flex cursor-pointer flex-col justify-between rounded-lg border border-panel-border bg-white p-4 transition hover:border-brand hover:shadow-md"
                            >
                                <div className="flex items-center gap-2 text-zinc-400 group-hover:text-brand">
                                    <FileEdit size={16} />
                                </div>
                                <div>
                                    <p className="mt-3 truncate text-sm font-medium text-zinc-800">{c.title}</p>
                                    <p className="text-[11px] text-zinc-400">
                                        {new Date(c.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(c.id, e)}
                                    className="mt-3 flex items-center gap-1 self-end text-zinc-300 opacity-0 transition group-hover:opacity-100 hover:text-red-500"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default DashboardPage;