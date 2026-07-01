import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Helpers tipados para el cliente. Importar desde componentes "use client".
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
