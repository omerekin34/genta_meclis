const maxSizeMB = 1.5;
export const optimizedImageMaxBytes = maxSizeMB * 1024 * 1024;
export const uploadReadyMaxBytes = 4 * 1024 * 1024;

const compressible = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

export async function optimizeImageForUpload(file: File): Promise<File> {
  if (!compressible.has(file.type.toLowerCase())) return file;

  const imageCompression = (await import("browser-image-compression")).default;
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920,
    initialQuality: 0.82,
    maxIteration: 10,
  };

  try {
    return await imageCompression(file, { ...options, useWebWorker: true });
  } catch {
    try {
      return await imageCompression(file, { ...options, useWebWorker: false });
    } catch {
      return file;
    }
  }
}
