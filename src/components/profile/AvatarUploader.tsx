"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera } from "lucide-react";

export function AvatarUploader({
  userId,
  currentAvatarUrl,
  fullName,
}: {
  userId: string;
  currentAvatarUrl: string | null;
  fullName: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Upload failed");
        setUploading(false);
        return;
      }

      setPreviewUrl(data.url);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative mx-auto w-fit">
      <Avatar className="h-20 w-20 border-2 border-[#e1e8f0] dark:border-sky-500/20 shadow-md">
        {previewUrl && <AvatarImage src={previewUrl} alt={fullName} />}
        <AvatarFallback className="bg-gradient-to-tr from-[#0F2744] to-[#0284C7] text-white text-2xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Upload overlay button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#0284C7] hover:bg-[#0369A1] flex items-center justify-center text-white shadow-md transition-colors"
        title="Upload profile photo"
        aria-label="Upload profile photo"
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Camera className="h-3.5 w-3.5" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
