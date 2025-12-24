import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";

interface FileUploadButtonProps {
  onUploadComplete: (uploadPath: string) => void;
  accept?: string;
  label?: string;
  disabled?: boolean;
  maxSize?: number;
}

export function FileUploadButton({
  onUploadComplete,
  accept = "*",
  label = "Upload",
  disabled = false,
  maxSize = 100 * 1024 * 1024, // 100MB default
}: FileUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize / 1024 / 1024}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Step 1: Request upload URL
      const urlResponse = await fetch("/api/uploads/request-url", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!urlResponse.ok) {
        const errorText = await urlResponse.text();
        console.error("URL request failed:", urlResponse.status, errorText);
        const error = await urlResponse.json().catch(() => ({ error: "Failed to request upload URL" }));
        throw new Error(error.error || `Failed to request upload URL: ${urlResponse.status}`);
      }

      const { uploadURL, objectPath } = await urlResponse.json();
      console.log("Got upload URL:", uploadURL);

      // Step 2: Upload file to the URL
      // Don't include Content-Type header for PUT request - let browser set it automatically
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        credentials: "include",
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload failed:", uploadResponse.status, errorText);
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      console.log("Upload successful:", objectPath);
      toast({
        title: "Upload successful",
        description: `${file.name} uploaded successfully`,
      });

      onUploadComplete(objectPath);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      console.error("Upload error:", error);
      toast({
        title: "Upload error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading || disabled}
      />
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || disabled}
        data-testid="button-file-upload"
      >
        {isUploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Upload size={16} />
        )}
      </Button>
    </>
  );
}
