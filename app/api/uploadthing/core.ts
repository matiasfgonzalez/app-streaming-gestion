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

export const ourFileRouter = {
  // Portada e imágenes de noticias.
  newsImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(requireEditor)
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
