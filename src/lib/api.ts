const API_BASE_URL = "http://localhost:4000/api";

export interface UploadResponse {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class UploadError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "UploadError";
  }
}

export const uploadFile = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          reject(new UploadError("Invalid response format", xhr.status));
        }
      } else {
        reject(
          new UploadError(
            `Upload failed with status ${xhr.status}`,
            xhr.status,
            xhr.responseText
          )
        );
      }
    });

    xhr.addEventListener("error", () => {
      reject(new UploadError("Network error occurred"));
    });

    xhr.addEventListener("abort", () => {
      reject(new UploadError("Upload was aborted"));
    });

    xhr.open("POST", `${API_BASE_URL}/images/upload`);
    xhr.send(formData);
  });
};

export const uploadMultipleFiles = async (
  files: File[],
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResponse[]> => {
  const uploadPromises = files.map((file, index) =>
    uploadFile(file, (progress) => onProgress?.(index, progress))
  );

  return Promise.all(uploadPromises);
};
