export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_TOTAL_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_MESSAGE_LENGTH = 5000;

export const ACCEPTED_FILE_TYPES = {
  "image/jpeg": ".jpg, .jpeg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
} as const;

export const ACCEPTED_FILE_MIME_TYPES = Object.keys(ACCEPTED_FILE_TYPES) as Array<keyof typeof ACCEPTED_FILE_TYPES>;

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".0", "")} MB`;
}

export function acceptedFileLabel() {
  return "JPG, PNG, WebP oder PDF · bis zu 5 Dateien · max. 5 MB je Datei · max. 10 MB gesamt";
}
