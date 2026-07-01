import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7: configuración de CLI (migraciones / introspección).
// `datasource.url` se usa para migrar; apuntamos a la conexión DIRECTA (sin pooler).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
