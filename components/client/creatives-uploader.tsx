"use client";

import { ImagePlus, X } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { IMAGE_HINTS } from "@/lib/ads";

const labelCls = "mb-1.5 block text-sm font-medium";

/**
 * Editor de creatividades (logo + imágenes) controlado.
 * Usa UploadButton (permite seleccionar varias imágenes hasta 6).
 */
export function CreativesUploader({
  logoUrl,
  imageUrls,
  onLogoChange,
  onImagesChange,
  onError,
}: {
  logoUrl: string;
  imageUrls: string[];
  onLogoChange: (url: string) => void;
  onImagesChange: (urls: string[]) => void;
  onError?: (msg: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Logo */}
      <div>
        <span className={labelCls}>Logo</span>
        <p className="mb-2 text-xs text-muted-foreground">{IMAGE_HINTS.logo}</p>
        {logoUrl ? (
          <div className="relative w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Logo" className="aspect-square w-40 rounded-lg object-contain" />
            <button
              type="button"
              onClick={() => onLogoChange("")}
              className="glass absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full"
              aria-label="Quitar logo"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-6 text-muted-foreground">
            <ImagePlus className="size-6" />
            <UploadButton
              endpoint="adCreative"
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.ufsUrl;
                if (url) onLogoChange(url);
              }}
              onUploadError={(e) => onError?.(e.message)}
            />
          </div>
        )}
      </div>

      {/* Imágenes */}
      <div>
        <span className={labelCls}>Imágenes de la publicidad</span>
        <p className="mb-2 text-xs text-muted-foreground">{IMAGE_HINTS.image}</p>
        {imageUrls.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {imageUrls.map((url) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Creatividad" className="aspect-square w-full rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => onImagesChange(imageUrls.filter((u) => u !== url))}
                  className="glass absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full"
                  aria-label="Quitar imagen"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {imageUrls.length < 6 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-6 text-muted-foreground">
            <ImagePlus className="size-6" />
            <UploadButton
              endpoint="adCreative"
              onClientUploadComplete={(res) => {
                const urls = (res ?? []).map((f) => f.ufsUrl).filter(Boolean);
                onImagesChange([...imageUrls, ...urls].slice(0, 6));
              }}
              onUploadError={(e) => onError?.(e.message)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
