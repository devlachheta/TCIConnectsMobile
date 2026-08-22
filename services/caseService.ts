import {
  File,
  Paths,
} from "expo-file-system";

import api from "./api";

const CHUNK_SIZE =
  8 * 1024 * 1024;

const MAX_PARALLEL = 8;

export const submitCase = async (
  data: any
) => {
  const response =
    await api.post(
      "/cases",
      data
    );

  return response.data;
};

export const initUpload = async (
  file: any
) => {
  const formData =
    new FormData();

  formData.append(
    "file_name",
    file.name ||
    "uploaded-file"
  );

  formData.append(
    "total_size",
    String(
      file.size || 0
    )
  );

  const response =
    await api.post(
      "/upload/init",
      formData
    );

  return response.data;
};

const createChunkFile = async (
  fileBytes: Uint8Array,
  start: number,
  end: number,
  chunkNumber: number
) => {
  const chunkBytes =
    fileBytes.slice(
      start,
      end
    );

  const chunkFile =
    new File(
      Paths.cache,
      `upload_chunk_${Date.now()}_${chunkNumber}`
    );

  chunkFile.create({
    overwrite: true,
  });

  await chunkFile.write(
    chunkBytes
  );

  return chunkFile;
};

export const uploadChunk = async (
  uploadId: string,
  chunkFile: File,
  chunkNumber: number,
  totalChunks: number,
  chunkSize: number,
  onProgress?: (
    uploadedBytes: number
  ) => void
) => {
  return new Promise<any>(
    (
      resolve,
      reject
    ) => {
      try {
        const xhr =
          new XMLHttpRequest();

        const baseURL =
          api.defaults
            .baseURL || "";

        const url =
          `${baseURL}/upload/chunk`;

        xhr.open(
          "POST",
          url
        );

        const token =
          api.defaults
            .headers
            .common?.[
          "Authorization"
          ];

        if (token) {
          xhr.setRequestHeader(
            "Authorization",
            String(token)
          );
        }

        xhr.setRequestHeader(
          "Accept",
          "application/json"
        );

        xhr.upload.onprogress =
          (event) => {
            if (
              !event.lengthComputable ||
              event.total <= 0
            ) {
              return;
            }

            const uploaded =
              Math.min(
                chunkSize,
                event.loaded
              );

            onProgress?.(
              uploaded
            );
          };

        xhr.onload = () => {
          if (
            xhr.status >= 200 &&
            xhr.status < 300
          ) {
            let responseData: any =
              xhr.responseText;

            try {
              responseData =
                JSON.parse(
                  xhr.responseText
                );
            } catch { }

            onProgress?.(
              chunkSize
            );

            resolve(
              responseData
            );

            return;
          }

          reject(
            new Error(
              `Chunk ${chunkNumber + 1
              }/${totalChunks} failed with status ${xhr.status
              }: ${xhr.responseText
              }`
            )
          );
        };

        xhr.onerror = () => {
          reject(
            new Error(
              `Network error while uploading chunk ${chunkNumber + 1
              }/${totalChunks}`
            )
          );
        };

        xhr.onabort = () => {
          reject(
            new Error(
              `Chunk ${chunkNumber + 1
              }/${totalChunks} was cancelled`
            )
          );
        };

        const formData =
          new FormData();

        formData.append(
          "upload_id",
          uploadId
        );

        formData.append(
          "chunk_number",
          String(
            chunkNumber
          )
        );

        formData.append(
          "file",
          {
            uri:
              chunkFile.uri,
            name:
              `chunk_${chunkNumber}`,
            type:
              "application/octet-stream",
          } as any
        );

        console.log(
          `SENDING CHUNK ${chunkNumber + 1
          } OF ${totalChunks
          }`
        );

        xhr.send(
          formData
        );
      } catch (
      error
      ) {
        reject(
          error
        );
      }
    }
  );
};

export const completeUpload =
  async (
    uploadId: string,
    fileName: string,
    totalChunks: number
  ) => {
    const formData =
      new FormData();

    formData.append(
      "upload_id",
      uploadId
    );

    formData.append(
      "file_name",
      fileName
    );

    formData.append(
      "total_chunks",
      String(
        totalChunks
      )
    );

    const response =
      await api.post(
        "/upload/complete",
        formData
      );

    return response.data;
  };

export const uploadTempFile =
  async (
    file: any,
    onProgress?: (
      progress: number
    ) => void
  ) => {
    try {
      if (!file?.uri) {
        throw new Error(
          "Selected file does not contain a URI."
        );
      }

      const fileSize =
        Number(
          file.size
        ) || 0;

      if (fileSize <= 0) {
        throw new Error(
          "Selected file size could not be determined."
        );
      }

      const totalChunks =
        Math.ceil(
          fileSize /
          CHUNK_SIZE
        );

      console.log(
        "STARTING CHUNKED UPLOAD:",
        file.name
      );

      console.log(
        "FILE SIZE:",
        fileSize
      );

      console.log(
        "CHUNK SIZE:",
        CHUNK_SIZE
      );

      console.log(
        "TOTAL CHUNKS:",
        totalChunks
      );

      const sourceFile =
        new File(
          file.uri
        );

      console.log(
        "READING SOURCE FILE ONCE..."
      );

      const fileBytes =
        await sourceFile.bytes();

      console.log(
        "SOURCE FILE READ COMPLETE"
      );

      if (
        fileBytes.length <
        fileSize
      ) {
        console.warn(
          "FILE BYTE LENGTH IS SMALLER THAN REPORTED FILE SIZE:",
          fileBytes.length,
          fileSize
        );
      }

      const init =
        await initUpload(
          file
        );

      console.log(
        "UPLOAD INIT RESPONSE:",
        init
      );

      const uploadId =
        init?.upload_id;

      if (!uploadId) {
        throw new Error(
          "Upload ID was not returned by the server."
        );
      }

      onProgress?.(
        0
      );

      const uploadedBytes =
        new Array(
          totalChunks
        ).fill(0);

      let lastProgress =
        -1;

      const updateProgress =
        () => {
          const totalUploaded =
            uploadedBytes.reduce(
              (
                total,
                value
              ) =>
                total +
                value,
              0
            );

          const progress =
            Math.min(
              100,
              Math.round(
                (
                  totalUploaded /
                  fileSize
                ) *
                100
              )
            );

          if (
            progress !==
            lastProgress
          ) {
            lastProgress =
              progress;

            onProgress?.(
              progress
            );
          }
        };

      const uploadOneChunk =
        async (
          chunkNumber: number
        ) => {
          const start =
            chunkNumber *
            CHUNK_SIZE;

          const end =
            Math.min(
              start +
              CHUNK_SIZE,
              fileSize
            );

          const actualChunkSize =
            end -
            start;

          console.log(
            `PREPARING CHUNK ${chunkNumber + 1
            }/${totalChunks}`
          );

          const chunkFile =
            await createChunkFile(
              fileBytes,
              start,
              end,
              chunkNumber
            );

          try {
            await uploadChunk(
              uploadId,
              chunkFile,
              chunkNumber,
              totalChunks,
              actualChunkSize,
              (
                currentBytes
              ) => {
                uploadedBytes[
                  chunkNumber
                ] =
                  Math.min(
                    actualChunkSize,
                    currentBytes
                  );

                updateProgress();
              }
            );

            uploadedBytes[
              chunkNumber
            ] =
              actualChunkSize;

            updateProgress();

            console.log(
              `CHUNK ${chunkNumber + 1
              }/${totalChunks
              } COMPLETED`
            );
          } finally {
            try {
              if (
                chunkFile.exists
              ) {
                chunkFile.delete();
              }
            } catch { }
          }
        };

      for (
        let startChunk = 0;
        startChunk <
        totalChunks;
        startChunk +=
        MAX_PARALLEL
      ) {
        const endChunk =
          Math.min(
            startChunk +
            MAX_PARALLEL,
            totalChunks
          );

        console.log(
          "STARTING CHUNK BATCH:",
          startChunk + 1,
          "TO",
          endChunk
        );

        const batch:
          Promise<any>[] =
          [];

        for (
          let chunkNumber =
            startChunk;
          chunkNumber <
          endChunk;
          chunkNumber++
        ) {
          batch.push(
            uploadOneChunk(
              chunkNumber
            )
          );
        }

        await Promise.all(
          batch
        );
      }

      onProgress?.(
        100
      );

      console.log(
        "ALL CHUNKS UPLOADED"
      );

      const completed =
        await completeUpload(
          uploadId,
          file.name ||
          "uploaded-file",
          totalChunks
        );

      console.log(
        "UPLOAD COMPLETE RESPONSE:",
        completed
      );

      if (
        !completed?.file_path
      ) {
        throw new Error(
          "Completed upload did not return file_path."
        );
      }

      onProgress?.(
        100
      );

      return {
        ...completed,

        file_name:
          completed.file_name ||
          file.name ||
          "uploaded-file",

        file_path:
          completed.file_path,

        file_type:
          file.mimeType ||
          file.type ||
          "application/octet-stream",
      };
    } catch (
    error: any
    ) {
      console.error(
        "TEMP FILE UPLOAD ERROR:",
        error?.response?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };


export const uploadPreviewFile = async (
  caseId: number | string,
  file: any
) => {
  try {
    const formData = new FormData();

    formData.append(
      "category",
      "preview_file"
    );

    formData.append(
      "file",
      {
        uri: file.uri,
        name: file.name || "preview-file",
        type:
          file.mimeType ||
          file.type ||
          "application/octet-stream",
      } as any
    );

    console.log(
      "UPLOADING PREVIEW:",
      {
        caseId,
        fileName: file.name,
      }
    );

    const response = await api.post(
      `/cases/${caseId}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(
      "PREVIEW UPLOAD RESPONSE:",
      response.data
    );

    return response.data;

  } catch (error: any) {

    console.error(
      "PREVIEW UPLOAD ERROR:",
      error?.response?.data ||
      error?.message ||
      error
    );

    throw error;
  }
};


export const uploadCaseFile =
  async (
    caseId: number,
    file: any,
    category: string,
    onProgress?: (
      progress: number
    ) => void,
    tempFilePath?: string
  ) => {
    try {
      let filePath =
        tempFilePath;

      if (!filePath) {
        console.log(
          "TEMP FILE PATH NOT PROVIDED. UPLOADING FILE..."
        );

        const uploaded =
          await uploadTempFile(
            file,
            onProgress
          );

        filePath =
          uploaded.file_path;
      } else {
        console.log(
          "USING EXISTING TEMP FILE:",
          filePath
        );
      }

      if (!filePath) {
        throw new Error(
          "Temporary file path is missing."
        );
      }

      console.log(
        "SAVING TEMP FILE TO CASE:",
        filePath
      );

      const saved =
        await api.post(
          `/cases/${caseId}/save-temp-file`,
          {
            file_path:
              filePath,
            category:
              category,
          }
        );

      onProgress?.(
        100
      );

      console.log(
        "FILE MOVED TO MAIN STORAGE:",
        saved.data
      );

      return saved.data;
    } catch (
    error: any
    ) {
      console.error(
        "ERROR SAVING CASE FILE:",
        error?.response?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };


export const getCases = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  deadline = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  deadline?: string;
} = {}) => {
  try {
    const params: any = {
      page,
      limit,
    };

    if (search) {
      params.search = search;
    }

    if (status) {
      params.status = status;
    }
    if (deadline) {
      params.deadline = deadline;
    }

    const response = await api.get("/cases", {
      params,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching cases:",
      error?.response?.data ||
      error?.message ||
      error
    );

    throw error;
  }
};

export const getCase =
  async (
    caseId:
      number | string
  ) => {
    try {
      const response =
        await api.get(
          `/cases/${caseId}`
        );

      return response.data;
    } catch (
    error: any
    ) {
      console.error(
        "Error fetching case:",
        error?.response?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };

export const updateCase =
  async (
    caseId:
      number | string,
    data: any
  ) => {
    try {
      const response =
        await api.put(
          `/cases/${caseId}`,
          data
        );

      return response.data;
    } catch (
    error: any
    ) {
      console.error(
        "Error updating case:",
        error?.response?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };

export const deleteCase =
  async (
    caseId:
      number | string
  ) => {
    try {
      const response =
        await api.delete(
          `/cases/${caseId}`
        );

      return response.data;
    } catch (
    error: any
    ) {
      console.error(
        "Error deleting case:",
        error?.response?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };

export const confirmPreviewFiles =
  async (
    caseId:
      number | string
  ) => {
    try {
      const response =
        await api.put(
          `/cases/${caseId}/confirm-preview-files`
        );

      return response.data;
    } catch (
    error: any
    ) {
      console.error(
        "Error confirming preview files:",
        error?.response?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };

export const approvePreview =
  async (
    caseId:
      number | string
  ) => {
    try {
      const response =
        await api.put(
          `/cases/${caseId}/approve-preview`
        );

      return response.data;
    } catch (
    error: any
    ) {
      console.error(
        "Error approving preview:",
        error?.response?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };



export const updateCaseStatus = async (
  caseId: number | string,
  status: string
) => {
  try {
    const response = await api.put(
      `/cases/${caseId}/status`,
      {
        status,
      }
    );

    console.log(
      "Case status updated:",
      response.data
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating case status:",
      error?.response?.data ||
      error?.message ||
      error
    );

    throw error;
  }
};

export const rejectPreview = async (
  caseId: number | string
) => {
  try {
    const response = await api.put(
      `/cases/${caseId}/reject-preview`
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error rejecting preview:",
      error?.response?.data ||
      error?.message ||
      error
    );

    throw error;
  }
};