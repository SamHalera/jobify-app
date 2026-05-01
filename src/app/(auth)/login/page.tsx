"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseIcon, MailIcon, LockIcon, AlertCircleIcon } from "lucide-react";
import { signIn, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) router.replace("/applications");
  }, [session, router]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const { error: authError } = await signIn.email({ email, password, callbackURL: "/applications" });

    if (authError) {
      setError("Email ou mot de passe incorrect");
      setIsPending(false);
    } else {
      router.push("/applications");
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#F72585] to-[#7209B7] shadow-lg shadow-[#F72585]/25 mb-4">
          <BriefcaseIcon className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">Jobify</h1>
        <p className="text-sm text-muted-foreground mt-1">Connectez-vous à votre espace</p>
      </div>

      {/* Card */}
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden card-shadow p-6">
        <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-[#F72585] via-[#7209B7] to-[#3A0CA3]" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="vous@exemple.com"
                className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4361EE]/30 focus:border-[#4361EE] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Mot de passe
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4361EE]/30 focus:border-[#4361EE] transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              <AlertCircleIcon className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-linear-to-r from-[#4361EE] to-[#7209B7] hover:from-[#3A0CA3] hover:to-[#4361EE] text-white font-medium py-2 text-sm transition-all duration-300 shadow-sm shadow-[#4361EE]/30 disabled:opacity-60"
          >
            {isPending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-medium text-[#4361EE] hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
