"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      setError("Incorrect password");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-[#fafafa]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[#27272a] bg-[#111111] px-4 py-3 text-sm text-[#fafafa] placeholder:text-[#a1a1aa]/50 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          placeholder="Enter password"
          autoFocus
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Enter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-white">
          Site Access
        </h1>
        <p className="mt-2 text-center text-sm text-[#a1a1aa]">
          This site is currently in development.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
