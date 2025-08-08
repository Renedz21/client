import {
  AlertCircleIcon,
  ImageIcon,
  UploadIcon,
  XIcon,
  LoaderIcon,
  CheckCircleIcon,
  LockIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UploadFile() {
  const queryClient = useQueryClient();
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
  const maxFiles = 50;

  const [
    { files, isDragging, errors, uploading, uploadedFiles },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      uploadFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple: true,
    maxFiles,
    initialFiles: [],
    onUploadSuccess: (fileId, response) => {
      console.log(`File ${fileId} uploaded successfully:`, response);
      toast.success("Archivo subido correctamente");
      // Refresh images list in the grid immediately after a successful upload
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
    onUploadError: (fileId, error) => {
      console.error(`File ${fileId} upload failed:`, error);
      toast.error("Error al subir archivo");
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ImageIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
          <p className="text-muted-foreground text-xs">
            SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
          </p>
          <Button variant="outline" className="mt-4" onClick={openFileDialog}>
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Select images
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const isUploaded = uploadedFiles.has(file.id);
            return (
              <div
                key={file.id}
                className={`bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3 ${
                  isUploaded ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-accent aspect-square shrink-0 rounded relative">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="size-10 rounded-[inherit] object-cover"
                    />
                    {isUploaded && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                        <CheckCircleIcon className="size-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex items-center gap-1">
                      <p className="truncate text-[13px] font-medium">
                        {file.file.name}
                      </p>
                      {isUploaded && (
                        <LockIcon className="size-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {formatBytes(file.file.size)}
                      {isUploaded && " • Subido"}
                    </p>
                  </div>
                </div>

                {!isUploaded && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                    onClick={() => removeFile(file.id)}
                    aria-label="Remove file"
                  >
                    <XIcon aria-hidden="true" />
                  </Button>
                )}
              </div>
            );
          })}

          {/* Upload and Remove buttons */}
          <div className="flex gap-2">
            {(() => {
              const nonUploadedFiles = files.filter(
                (file) => !uploadedFiles.has(file.id)
              );
              const hasNonUploadedFiles = nonUploadedFiles.length > 0;

              return (
                <>
                  {hasNonUploadedFiles && (
                    <Button
                      size="sm"
                      onClick={uploadFiles}
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <LoaderIcon className="size-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadIcon className="size-4" />
                          Upload {nonUploadedFiles.length} file
                          {nonUploadedFiles.length > 1 ? "s" : ""}
                        </>
                      )}
                    </Button>
                  )}

                  {hasNonUploadedFiles && nonUploadedFiles.length > 1 && (
                    <Button size="sm" variant="outline" onClick={clearFiles}>
                      Remove unuploaded files
                    </Button>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
