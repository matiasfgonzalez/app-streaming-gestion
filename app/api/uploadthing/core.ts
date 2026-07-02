import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentUser, hasRole } from "@/lib/auth";

const f = createUploadthing();

/** Solo ADMIN/EDITOR pueden subir. Devuelve la URL final al cliente. */
async function requireEditor() {
  const user = await getCurrentUser();
  if (!hasRole(user, "ADMIN", "EDITOR")) {
    throw new UploadThingError("No autorizado");
  }
  return { userId: user!.id };
}

/** Cualquier usuario autenticado (clientes suben creatividades y comprobantes). */
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new UploadThingError("No autorizado");
  return { userId: user.id };
}

export const ourFileRouter = {
  // Portada e imágenes de noticias/eventos (staff).
  newsImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(requireEditor)
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

  // Logo/imágenes de publicidad (cliente).
  adCreative: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .middleware(requireAuth)
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

  // Comprobante de pago (cliente): imagen o PDF.
  paymentProof: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(requireAuth)
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

  // Audio de podcasts / programas anteriores (staff).
  podcastAudio: f({ audio: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(requireEditor)
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
