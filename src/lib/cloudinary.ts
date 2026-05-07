import { v2 as cloudinary } from "cloudinary";

export function getCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary mal configuré. Renseignez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans .env.local."
    );
  }
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
  return cloudinary;
}

export type UploadKind = "hero" | "thumbnail";

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  kind: UploadKind,
  filename: string
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  const cld = getCloudinary();
  // Format: linfoia/hero/<timestamp>-<basename>
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
  const folder = `linfoia/${kind}`;
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}-${safe.replace(/\.[^.]+$/, "")}`,
        resource_type: "image",
      },
      (err, result) => {
        if (err || !result) {
          reject(err || new Error("Upload Cloudinary échoué."));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );
    stream.end(buffer);
  });
}
