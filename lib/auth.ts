import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Role, User } from "@prisma/client";
import { db } from "@/lib/db";

/**
 * Emails que se promueven a ADMIN al registrarse (bootstrap).
 * Definir en .env: ADMIN_EMAILS="mail1@x.com,mail2@x.com"
 */
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Usuario local (DB) del request actual. Sincroniza on-demand desde Clerk:
 * si está autenticado en Clerk pero no existe en la DB, lo crea (lazy sync).
 * Rol inicial: ADMIN si el email está en ADMIN_EMAILS, si no CLIENTE.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  const cu = await currentUser();
  const email = cu?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  const name =
    [cu?.firstName, cu?.lastName].filter(Boolean).join(" ") || cu?.username || null;
  const role: Role = adminEmails().includes(email) ? "ADMIN" : "CLIENTE";

  return db.user.create({
    data: { clerkId: userId, email, name, role },
  });
}

export function hasRole(user: User | null, ...roles: Role[]): boolean {
  return !!user && roles.includes(user.role);
}

/**
 * Exige sesión y (opcionalmente) uno de los roles dados.
 * Redirige a /sign-in si no hay sesión, o a / si el rol no alcanza.
 * Usar al inicio de páginas protegidas y Server Actions.
 */
export async function requireRole(...roles: Role[]): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (roles.length > 0 && !roles.includes(user.role)) redirect("/");
  return user;
}
