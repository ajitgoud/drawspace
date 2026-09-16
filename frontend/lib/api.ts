const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("drawspace_token");
}

export function setToken(token: string) {
    localStorage.setItem("drawspace_token", token);
}

export function clearToken() {
    localStorage.removeItem("drawspace_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        ...(options.body && !(options.body instanceof FormData)
            ? { "Content-Type": "application/json" }
            : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string>),
    };

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
        const body = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(body.message || `Request failed: ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
}

export const api = {
    register: (email: string, password: string) =>
        request<{ accessToken: string }>("/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    login: (email: string, password: string) =>
        request<{ accessToken: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    listCanvases: () => request<any[]>("/canvas"),

    createCanvas: (title: string) =>
        request<any>("/canvas", { method: "POST", body: JSON.stringify({ title }) }),

    getCanvas: (id: string) => request<any>(`/canvas/${id}`),

    saveCanvas: (id: string, title: string, canvasJson: string) =>
        request<any>(`/canvas/${id}`, {
            method: "PUT",
            body: JSON.stringify({ title, canvasJson }),
        }),

    deleteCanvas: (id: string) => request<void>(`/canvas/${id}`, { method: "DELETE" }),

    uploadAsset: (file: File) => {
        const form = new FormData();
        form.append("file", file);
        return request<{ id: string; url: string; status: string }>("/assets", {
            method: "POST",
            body: form,
        });
    },

    getAsset: (id: string) => request<any>(`/assets/${id}`),

    shareCanvas: (id: string) =>
        request<{ publicSlug: string }>(`/canvas/${id}/share`, { method: "POST" }),

    // Public endpoint — deliberately does NOT go through the shared `request()`
    // helper's auth header logic in spirit, but request() is harmless here:
    // it still attaches a Bearer token if one exists, which is fine since
    // PublicProjectController doesn't require auth at all — an anonymous
    // visitor with no token in localStorage works identically.
    getPublicCanvas: (slug: string) => request<any>(`/public/${slug}`),

    unshareCanvas: (id: string) => request<void>(`/canvas/${id}/share`, { method: "DELETE" }),
};