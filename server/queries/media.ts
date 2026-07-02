import "server-only";
import { db } from "@/lib/db";

export function getGalleryImages(take?: number) {
  return db.mediaItem.findMany({
    where: { type: "IMAGE" },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    ...(take ? { take } : {}),
  });
}

export function getVideos(take?: number) {
  return db.mediaItem.findMany({
    where: { type: "VIDEO" },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    ...(take ? { take } : {}),
  });
}

export function getAllMediaAdmin() {
  return db.mediaItem.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

export function getMediaById(id: string) {
  return db.mediaItem.findUnique({ where: { id } });
}
