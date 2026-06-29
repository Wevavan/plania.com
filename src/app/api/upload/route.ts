import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadBufferToCloudinary, type UploadKind } from "@/lib/cloudinary";
import { compressImage } from "@/lib/image-compress";
import { rateLimit, rateLimitConfigs } from "@/lib/rateLimit";

const MAX_OUTPUT_BYTES = 100 * 1024; // 100 Ko cible après compression

const MAX_BYTES = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limiting: 10 uploads par heure par IP
  const rateLimitResult = await rateLimit(req, rateLimitConfigs.upload, "upload");

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Trop d'uploads. Veuillez réessayer plus tard.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimitConfigs.upload.uniqueTokenPerInterval),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.reset),
        },
      }
    );
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Multipart attendu." }, { status: 400 });
  }

  const file = fd.get("file");
  const kindRaw = String(fd.get("kind") || "hero");
  const kind: UploadKind = kindRaw === "thumbnail" ? "thumbnail" : "hero";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Champ « file » manquant." }, { status: 400 });
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    return NextResponse.json(
      { error: `Format non supporté : ${file.type}. Utilisez JPG, PNG, WebP, AVIF ou GIF.` },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Max 10 Mo.` },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const original = Buffer.from(arrayBuffer);

    // Compression : toute image est ramenée sous ~100 Ko (WebP) avant stockage.
    const { buffer, format } = await compressImage(original, {
      maxBytes: MAX_OUTPUT_BYTES,
    });
    const outName = file.name.replace(/\.[^.]+$/, "") + `.${format}`;

    const uploaded = await uploadBufferToCloudinary(buffer, kind, outName);

    return NextResponse.json({
      url: uploaded.url,
      width: uploaded.width,
      height: uploaded.height,
      bytes: buffer.length,
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    const { ApiErrors } = await import("@/lib/apiErrors");

    logError(err, {
      route: "/api/upload",
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      kind,
    });

    const message = err instanceof Error ? err.message : "Erreur d'upload.";
    return ApiErrors.uploadError(message);
  }
}
