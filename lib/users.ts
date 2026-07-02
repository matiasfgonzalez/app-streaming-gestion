import type { Role } from "@prisma/client";

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  EDITOR: "Editor",
  CLIENTE: "Cliente",
  VISITANTE: "Visitante",
};

export const ROLES: Role[] = ["ADMIN", "EDITOR", "CLIENTE", "VISITANTE"];

export const ROLE_CLS: Record<Role, string> = {
  ADMIN: "bg-primary/15 text-primary",
  EDITOR: "bg-accent/20 text-accent-foreground",
  CLIENTE: "bg-muted text-muted-foreground",
  VISITANTE: "bg-muted text-muted-foreground",
};
