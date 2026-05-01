"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  return session.user;
}
