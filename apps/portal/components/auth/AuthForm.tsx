"use client";

import { useState, type FormEvent } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "../../lib/firebase";

const formCopy = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to continue to the portal.",
    primaryAction: "Sign in",
    toggleText: "New here?",
    toggleLink: "/signup",
    toggleLabel: "Create an account",
  },
  signup: {
    title: "Create your account",
    subtitle: "Get started with the portal in minutes.",
    primaryAction: "Create account",
    toggleText: "Already have an account?",
    toggleLink: "/login",
    toggleLabel: "Sign in",
  },
};

export type AuthFormMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthFormMode;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const copy = formCopy[mode];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (authError) {
      const message =
        authError instanceof Error
          ? authError.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (authError) {
      const message =
        authError instanceof Error
          ? authError.message
          : "Google sign-in failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">
            Portal Access
          </p>
          <h1 className="text-3xl font-semibold text-white">{copy.title}</h1>
          <p className="text-sm text-slate-300">{copy.subtitle}</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleEmailAuth}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/60"
          >
            {loading ? "Working..." : copy.primaryAction}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-800" />
          or continue with
          <span className="h-px flex-1 bg-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-blue-400/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">
            G
          </span>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-400">
          {copy.toggleText}{" "}
          <a className="font-semibold text-blue-400 hover:text-blue-300" href={copy.toggleLink}>
            {copy.toggleLabel}
          </a>
        </p>
      </div>
    </div>
  );
}
