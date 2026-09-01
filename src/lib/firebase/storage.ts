import {
  getDownloadURL,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";
import { getFirebaseStorage } from "./config";

export const ALLOWED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export interface UploadTarget {
  kind: "politicians" | "cases" | "sources" | "reports" | "user-uploads";
  entityId: string;
}

export function validateUpload(file: File): string | null {
  if (!ALLOWED_UPLOAD_MIME_TYPES.includes(file.type as (typeof ALLOWED_UPLOAD_MIME_TYPES)[number])) {
    return `File type "${file.type || "unknown"}" is not allowed. Allowed types: PDF, PNG, JPEG, WebP.`;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `File exceeds the ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB upload limit.`;
  }
  return null;
}

export async function sha256Hex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function uploadResearchFile(
  target: UploadTarget,
  file: File,
  uploadedByUid: string,
): Promise<{ filePath: string; downloadUrl: string; sha256: string }> {
  const validationError = validateUpload(file);
  if (validationError) throw new Error(validationError);

  const hash = await sha256Hex(file);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `research/${target.kind}/${target.entityId}/${Date.now()}-${safeName}`;

  const metadata: UploadMetadata = {
    contentType: file.type,
    customMetadata: {
      originalFilename: file.name,
      uploadedBy: uploadedByUid,
      sha256: hash,
    },
  };

  const storageRef = ref(getFirebaseStorage(), filePath);
  await uploadBytes(storageRef, file, metadata);
  const downloadUrl = await getDownloadURL(storageRef);

  return { filePath, downloadUrl, sha256: hash };
}
