import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./uploads";
const MAX_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES ?? "10485760");

export async function saveFile(file: File): Promise<{
  storagePath: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
}> {
  if (file.size > MAX_SIZE) {
    throw new Error(`Fichier trop volumineux (max ${MAX_SIZE / 1024 / 1024} MB)`);
  }
  if (file.type !== "application/pdf") {
    throw new Error("Seuls les fichiers PDF sont acceptés");
  }

  const uploadDir = path.resolve(process.cwd(), UPLOAD_DIR);
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".pdf";
  const uniqueName = `${uuidv4()}${ext}`;
  const fullPath = path.join(uploadDir, uniqueName);
  const relativePath = path.join(UPLOAD_DIR, uniqueName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(fullPath, buffer);

  return {
    storagePath: relativePath,
    fileName: file.name,
    sizeBytes: file.size,
    mimeType: file.type,
  };
}

export async function deleteFile(storagePath: string): Promise<void> {
  const fullPath = path.resolve(process.cwd(), storagePath);
  await fs.unlink(fullPath).catch(() => {});
}

export function getAbsoluteFilePath(storagePath: string): string {
  return path.resolve(process.cwd(), storagePath);
}
