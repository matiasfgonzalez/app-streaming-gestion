import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

/**
 * Registra un click y redirige al destino.
 * /api/track/sponsor/[id]  -> website del sponsor
 * /api/track/banner/[id]   -> link del banner
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ kind: string; id: string }> },
) {
  const { kind, id } = await params;
  let target: string | null = null;

  try {
    if (kind === "sponsor") {
      const s = await db.sponsor.update({
        where: { id },
        data: { clicks: { increment: 1 } },
      });
      target = s.website;
    } else if (kind === "banner") {
      const b = await db.banner.update({
        where: { id },
        data: { clicks: { increment: 1 } },
      });
      target = b.link;
    }
  } catch {
    // entidad inexistente: seguimos al home
  }

  const dest =
    target && /^https?:\/\//.test(target)
      ? target
      : new URL(target || "/", req.url).toString();

  return NextResponse.redirect(dest);
}
