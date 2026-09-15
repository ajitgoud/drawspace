"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const { accessToken } = await api.login(email, password);
            setToken(accessToken);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-canvas-bg">
            <form onSubmit={handleSubmit} className="w-80 rounded-lg border border-panel-border bg-white p-6 shadow-sm">
                <h1 className="mb-4 text-lg font-semibold text-zinc-800">Log in</h1>
                {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-3 w-full rounded-md border border-panel-border px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-full rounded-md border border-panel-border px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
                    required
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-md bg-brand py-2 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
                >
                    {submitting ? "Logging in…" : "Log in"}
                </button>
                <p className="mt-3 text-center text-xs text-zinc-400">
                    No account?{" "}
                    <a href="/register" className="text-brand hover:text-brand-hover">
                        Register
                    </a>
                </p>
            </form>
        </main>
    );
};

export default LoginPage;