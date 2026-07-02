import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

/** Estado mínimo de sesión para la UI pública (link a Administración). */
export async function GET() {
  const user = await getCurrentUser();
  const isStaff = user?.role === "ADMIN" || user?.role === "EDITOR";
  return NextResponse.json({ signedIn: !!user, isStaff });
}
