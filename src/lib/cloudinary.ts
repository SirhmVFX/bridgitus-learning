const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export async function uploadToCloudinary(
  file: File,
  folder = "bridgitus"
): Promise<string> {
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`File exceeds the ${MAX_SIZE_MB}MB limit.`);
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  // Detect if file is a raw document (pdf, doc, etc.)
  const isRaw = !file.type.startsWith("image/") && !file.type.startsWith("video/");
  const endpoint = isRaw
    ? `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`
    : file.type.startsWith("video/")
    ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
    : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const res = await fetch(endpoint, { method: "POST", body: formData });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "File upload failed.");
  }

  const data = await res.json();
  return data.secure_url as string;
}

/** Server-side upload of a base64 image (e.g. AI-generated diagram) to Cloudinary. */
export async function uploadBase64ToCloudinary(
  base64Data: string,
  mimeType = "image/png",
  folder = "bridgitus/question-images"
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  const dataUri = base64Data.startsWith("data:")
    ? base64Data
    : `data:${mimeType};base64,${base64Data}`;

  const formData = new FormData();
  formData.append("file", dataUri);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: { message?: string } }).error?.message ||
        "Cloudinary upload failed."
    );
  }

  const data = await res.json();
  return data.secure_url as string;
}
