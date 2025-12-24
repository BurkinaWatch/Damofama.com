import { useState, useRef } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import type { UppyFile, UploadResult } from "@uppy/core";
import DashboardModal from "@uppy/react/dashboard-modal";
import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: (
    file: UppyFile<Record<string, unknown>, Record<string, unknown>>
  ) => Promise<{
    method: "PUT";
    url: string;
    headers?: Record<string, string>;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>,
    uploadedPaths?: { [fileId: string]: string }
  ) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760,
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const uploadedPathsRef = useRef<{ [fileId: string]: string }>({});
  const uploadErrorRef = useRef<string | null>(null);
  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
      },
      autoProceed: false,
    });

    uppyInstance.use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters: async (file) => {
        try {
          const params = await onGetUploadParameters(file);
          // Extract the fileId from the URL and track it
          const fileId = params.url.split('/').pop();
          if (fileId) {
            uploadedPathsRef.current[file.id] = `/uploads/${fileId}`;
          }
          return params;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Failed to get upload URL";
          uploadErrorRef.current = errorMessage;
          throw err;
        }
      },
    });

    uppyInstance.on("complete", (result) => {
      // Handle errors that occurred during upload
      if (uploadErrorRef.current) {
        toast({
          title: "Upload error",
          description: uploadErrorRef.current,
          variant: "destructive",
        });
        uploadErrorRef.current = null;
      } else if (result.failed && result.failed.length > 0) {
        toast({
          title: "Upload failed",
          description: "Some files failed to upload",
          variant: "destructive",
        });
      }
      
      // Pass the uploaded paths mapping as second parameter
      onComplete?.(result, uploadedPathsRef.current);
      uploadedPathsRef.current = {};
      setShowModal(false);
    });

    uppyInstance.on("upload-error", (file, error) => {
      console.error("Upload error:", error);
      uploadErrorRef.current = error?.message || "Failed to upload file";
    });

    return uppyInstance;
  });

  return (
    <div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className={buttonClassName}
        type="button"
      >
        {children}
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}
