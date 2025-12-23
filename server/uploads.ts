import path from "path";
import { randomUUID } from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export function generateUploadURL(): { uploadURL: string; objectPath: string } {
  const fileId = randomUUID();
  const objectPath = `/uploads/${fileId}`;
  
  // For local storage, we'll create a fake presigned URL that points to our backend
  // The client will PUT to this endpoint, and our middleware will save to disk
  const uploadURL = `${process.env.VITE_API_URL || "http://localhost:5000"}/api/uploads/${fileId}`;
  
  return {
    uploadURL,
    objectPath,
  };
}

export function getUploadPath(fileId: string): string {
  return path.join(UPLOADS_DIR, fileId);
}

export function getPublicUploadPath(fileId: string): string {
  return `/uploads/${fileId}`;
}
