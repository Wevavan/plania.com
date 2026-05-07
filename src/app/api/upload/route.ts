import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadBufferToCloudinary, type UploadKind } from "@/lib/cloudinary";

const MAX_BYTES = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await uploadBufferToCloudinary(buffer, kind, file.name);
    return NextResponse.json({
      url: uploaded.url,
      width: uploaded.width,
      height: uploaded.height,
    });
  } catch (err) {
    console.error("[upload]", err);
    const message =
      err instanceof Error ? err.message : "Erreur d'upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
