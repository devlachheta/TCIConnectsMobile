import {
  File,
} from "expo-file-system";

import DirectDownload from "../modules/direct-download";
import api from "./api";

const CHUNK_SIZE =
  8 * 1024 * 1024;

const MAX_PARALLEL =
  3;

const MAX_FILE_SIZE =
  2 * 1024 * 1024 * 1024;

const MAX_RETRIES =
  3;

const PROGRESS_INTERVAL =
  150;

const uploadControllers =
  new Map<string, Set<AbortController>>();

const uploadCancelled =
  new Set<string>();

const registerController = (
  uploadId: string,
  controller: AbortController
) => {
  let controllers =
    uploadControllers.get(
      uploadId
    );

  if (!controllers) {
    controllers =
      new Set();

    uploadControllers.set(
      uploadId,
      controllers
    );
  }

  controllers.add(
    controller
  );
};

const unregisterController = (
  uploadId: string,
  controller: AbortController
) => {
  const controllers =
    uploadControllers.get(
      uploadId
    );

  if (!controllers) {
    return;
  }

  controllers.delete(
    controller
  );

  if (
    controllers.size === 0
  ) {
    uploadControllers.delete(
      uploadId
    );
  }
};

export const cancelUpload = (
  uploadId: string
) => {
  uploadCancelled.add(
    uploadId
  );

  const controllers =
    uploadControllers.get(
      uploadId
    );

  if (controllers) {
    controllers.forEach(
      controller => {
        controller.abort();
      }
    );
  }

  uploadControllers.delete(
    uploadId
  );
};

const isUploadCancelled = (
  uploadId: string
) => {
  return uploadCancelled.has(
    uploadId
  );
};

const cleanupUploadCancellation =
  (
    uploadId: string
  ) => {
    uploadCancelled.delete(
      uploadId
    );

    uploadControllers.delete(
      uploadId
    );
  };

export const submitCase =
  async (
    data: any
  ) => {
    const response =
      await api.post(
        "/cases",
        data
      );

    return response.data;
  };

export const initUpload =
  async (
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

const uploadChunk =
  async (
    uploadId: string,
    chunkFile: File,
    chunkNumber: number,
    totalChunks: number,
    chunkSize: number,
    onProgress?: (
      uploadedBytes: number
    ) => void
  ) => {

    if (
      isUploadCancelled(
        uploadId
      )
    ) {
      throw new Error(
        "UPLOAD_CANCELLED"
      );
    }

    return new Promise<any>(
      (
        resolve,
        reject
      ) => {

        const xhr =
          new XMLHttpRequest();

        const controller =
          new AbortController();

        registerController(
          uploadId,
          controller
        );

        let finished =
          false;

        const cleanup =
          () => {
            unregisterController(
              uploadId,
              controller
            );
          };

        const fail =
          (
            error: any
          ) => {

            if (
              finished
            ) {
              return;
            }

            finished =
              true;

            cleanup();

            reject(
              error
            );
          };

        controller.signal.addEventListener(
          "abort",
          () => {

            try {
              xhr.abort();
            } catch { }

            fail(
              new Error(
                "UPLOAD_CANCELLED"
              )
            );
          }
        );

        const baseURL =
          api.defaults
            .baseURL ||
          "";

        xhr.open(
          "POST",
          `${baseURL}/upload/chunk`
        );

        const authorization =
          api.defaults
            .headers
            .common?.[
          "Authorization"
          ];

        if (
          authorization
        ) {
          xhr.setRequestHeader(
            "Authorization",
            String(
              authorization
            )
          );
        }

        xhr.setRequestHeader(
          "Accept",
          "application/json"
        );

        let lastReported =
          0;

        xhr.upload.onprogress =
          event => {

            if (
              finished ||
              isUploadCancelled(
                uploadId
              )
            ) {
              return;
            }

            if (
              !event.lengthComputable
            ) {
              return;
            }

            const loaded =
              Math.min(
                chunkSize,
                event.loaded
              );

            if (
              loaded ===
              chunkSize ||
              loaded -
              lastReported >=
              256 *
              1024
            ) {

              lastReported =
                loaded;

              onProgress?.(
                loaded
              );
            }
          };

        xhr.onload =
          () => {

            if (
              finished
            ) {
              return;
            }

            if (
              isUploadCancelled(
                uploadId
              )
            ) {
              fail(
                new Error(
                  "UPLOAD_CANCELLED"
                )
              );

              return;
            }

            if (
              xhr.status >=
              200 &&
              xhr.status <
              300
            ) {

              finished =
                true;

              cleanup();

              let data:
                any =
                xhr.responseText;

              try {
                data =
                  JSON.parse(
                    xhr.responseText
                  );
              } catch { }

              onProgress?.(
                chunkSize
              );

              resolve(
                data
              );

              return;
            }

            fail(
              new Error(
                `Chunk ${chunkNumber +
                1
                }/${totalChunks} failed with status ${xhr.status}`
              )
            );
          };

        xhr.onerror =
          () => {

            fail(
              new Error(
                "NETWORK_ERROR"
              )
            );
          };

        xhr.onabort =
          () => {

            fail(
              new Error(
                "UPLOAD_CANCELLED"
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

        if (
          isUploadCancelled(
            uploadId
          )
        ) {
          try {
            xhr.abort();
          } catch { }

          fail(
            new Error(
              "UPLOAD_CANCELLED"
            )
          );

          return;
        }

        xhr.send(
          formData
        );
      }
    );
  };

const uploadChunkWithRetry =
  async (
    uploadId: string,
    chunkFile: File,
    chunkNumber: number,
    totalChunks: number,
    chunkSize: number,
    onProgress?: (
      uploadedBytes: number
    ) => void
  ) => {

    let lastError:
      any;

    for (
      let attempt = 1;
      attempt <=
      MAX_RETRIES;
      attempt++
    ) {

      if (
        isUploadCancelled(
          uploadId
        )
      ) {
        throw new Error(
          "UPLOAD_CANCELLED"
        );
      }

      try {

        return await uploadChunk(
          uploadId,
          chunkFile,
          chunkNumber,
          totalChunks,
          chunkSize,
          onProgress
        );

      } catch (
      error: any
      ) {

        lastError =
          error;

        if (
          error?.message ===
          "UPLOAD_CANCELLED"
        ) {
          throw error;
        }

        if (
          isUploadCancelled(
            uploadId
          )
        ) {
          throw new Error(
            "UPLOAD_CANCELLED"
          );
        }

        console.log(
          `Chunk ${chunkNumber +
          1
          } retry ${attempt}/${MAX_RETRIES}`
        );

        if (
          attempt <
          MAX_RETRIES
        ) {

          await new Promise(
            (
              resolve,
              reject
            ) => {

              const timer =
                setTimeout(
                  resolve,
                  attempt *
                  1000
                );

              if (
                isUploadCancelled(
                  uploadId
                )
              ) {
                clearTimeout(
                  timer
                );

                reject(
                  new Error(
                    "UPLOAD_CANCELLED"
                  )
                );
              }
            }
          );
        }
      }
    }

    throw lastError;
  };

export const completeUpload =
  async (
    uploadId: string,
    fileName: string,
    totalChunks: number
  ) => {

    if (
      isUploadCancelled(
        uploadId
      )
    ) {
      throw new Error(
        "UPLOAD_CANCELLED"
      );
    }

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

    let uploadId:
      string | null =
      null;

    try {

      if (
        !file?.uri
      ) {
        throw new Error(
          "Selected file does not contain a URI."
        );
      }

      const fileSize =
        Number(
          file.size
        );

      if (
        !fileSize ||
        fileSize <= 0
      ) {
        throw new Error(
          "Unable to determine file size."
        );
      }

      if (
        fileSize >
        MAX_FILE_SIZE
      ) {
        throw new Error(
          "File size cannot exceed 2 GB."
        );
      }

      const totalChunks =
        Math.ceil(
          fileSize /
          CHUNK_SIZE
        );

      console.log(
        "STARTING UPLOAD:",
        file.name
      );

      console.log(
        "FILE SIZE:",
        fileSize
      );

      console.log(
        "TOTAL CHUNKS:",
        totalChunks
      );

      const init =
        await initUpload(
          file
        );

      uploadId =
        init?.upload_id;

      if (
        !uploadId
      ) {
        throw new Error(
          "Upload ID was not returned by the server."
        );
      }

      if (
        isUploadCancelled(
          uploadId
        )
      ) {
        throw new Error(
          "UPLOAD_CANCELLED"
        );
      }

      const uploadedBytes =
        new Array(
          totalChunks
        ).fill(
          0
        );

      let lastProgress =
        -1;

      let lastProgressTime =
        0;

      const updateProgress =
        (
          force = false
        ) => {

          if (
            isUploadCancelled(
              uploadId!
            )
          ) {
            return;
          }

          const now =
            Date.now();

          if (
            !force &&
            now -
            lastProgressTime <
            PROGRESS_INTERVAL
          ) {
            return;
          }

          const uploaded =
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
                  uploaded /
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

            lastProgressTime =
              now;

            onProgress?.(
              progress
            );
          }
        };

      onProgress?.(
        0
      );

      const uploadOneChunk =
        async (
          chunkNumber: number
        ) => {

          if (
            isUploadCancelled(
              uploadId!
            )
          ) {
            throw new Error(
              "UPLOAD_CANCELLED"
            );
          }

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

          const chunkName =
            `tci_upload_${Date.now()}_${chunkNumber}`;

          let chunkPath:
            string |
            null =
            null;

          try {

            console.log(
              `READING CHUNK ${chunkNumber +
              1
              }/${totalChunks}`
            );

            chunkPath =
              await DirectDownload.readChunk(
                file.uri,
                start,
                actualChunkSize,
                chunkName
              );

            if (
              isUploadCancelled(
                uploadId!
              )
            ) {
              throw new Error(
                "UPLOAD_CANCELLED"
              );
            }

            if (
              !chunkPath
            ) {
              throw new Error(
                "Native reader did not return a chunk path."
              );
            }

            const chunkFile =
              new File(
                chunkPath
              );

            if (
              !chunkFile.exists
            ) {
              throw new Error(
                `Chunk file does not exist: ${chunkPath}`
              );
            }

            await uploadChunkWithRetry(
              uploadId!,
              chunkFile,
              chunkNumber,
              totalChunks,
              actualChunkSize,
              currentBytes => {

                if (
                  isUploadCancelled(
                    uploadId!
                  )
                ) {
                  return;
                }

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

            if (
              isUploadCancelled(
                uploadId!
              )
            ) {
              throw new Error(
                "UPLOAD_CANCELLED"
              );
            }

            uploadedBytes[
              chunkNumber
            ] =
              actualChunkSize;

            updateProgress(
              true
            );

            console.log(
              `CHUNK ${chunkNumber +
              1
              }/${totalChunks} COMPLETED`
            );

          } finally {

            if (
              chunkPath
            ) {

              try {

                await DirectDownload.deleteChunk(
                  chunkPath
                );

              } catch { }

            }
          }
        };

      for (
        let startChunk =
          0;
        startChunk <
        totalChunks;
        startChunk +=
        MAX_PARALLEL
      ) {

        if (
          isUploadCancelled(
            uploadId
          )
        ) {
          throw new Error(
            "UPLOAD_CANCELLED"
          );
        }

        const endChunk =
          Math.min(
            startChunk +
            MAX_PARALLEL,
            totalChunks
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

          if (
            isUploadCancelled(
              uploadId
            )
          ) {
            break;
          }

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

      if (
        isUploadCancelled(
          uploadId
        )
      ) {
        throw new Error(
          "UPLOAD_CANCELLED"
        );
      }

      updateProgress(
        true
      );

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

      if (
        !completed?.file_path
      ) {
        throw new Error(
          "Completed upload did not return file_path."
        );
      }

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

      if (
        error?.message ===
        "UPLOAD_CANCELLED"
      ) {
        console.log(
          "UPLOAD CANCELLED:",
          file?.name
        );
      } else {
        console.error(
          "TEMP FILE UPLOAD ERROR:",
          error?.response
            ?.data ||
          error?.message ||
          error
        );
      }

      throw error;

    } finally {

      if (
        uploadId
      ) {
        uploadControllers.delete(
          uploadId
        );
      }
    }
  };
export const uploadCaseFile =
  async (
    caseId:
      number |
      string,
    file: any,
    category: string,
    onProgress?: (
      progress: number
    ) => void
  ) => {
    try {
      const uploaded =
        await uploadTempFile(
          file,
          onProgress
        );

      if (
        !uploaded?.file_path
      ) {
        throw new Error(
          "Temporary upload did not return file_path."
        );
      }

      const response =
        await api.post(
          `/cases/${caseId}/save-temp-file`,
          {
            file_path:
              uploaded.file_path,
            category:
              category,
          }
        );

      onProgress?.(100);

      return response.data;

    } catch (
    error: any
    ) {
      console.error(
        "CASE FILE UPLOAD ERROR:",
        error?.response?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };
export const uploadPreviewFile =
  async (
    caseId:
      number |
      string,
    file: any
  ) => {

    try {

      const formData =
        new FormData();

      formData.append(
        "category",
        "preview_file"
      );

      formData.append(
        "file",
        {
          uri:
            file.uri,
          name:
            file.name ||
            "preview-file",
          type:
            file.mimeType ||
            file.type ||
            "application/octet-stream",
        } as any
      );

      const response =
        await api.post(
          `/cases/${caseId}/upload`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      return response.data;

    } catch (
    error: any
    ) {

      console.error(
        "PREVIEW UPLOAD ERROR:",
        error?.response
          ?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };

export const getCases =
  async ({
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

    const params: any = {
      page,
      limit,
    };

    if (
      search
    ) {
      params.search =
        search;
    }

    if (
      status
    ) {
      params.status =
        status;
    }

    if (
      deadline
    ) {
      params.deadline =
        deadline;
    }

    const response =
      await api.get(
        "/cases",
        {
          params,
        }
      );

    return response.data;
  };

export const getCase =
  async (
    caseId:
      number |
      string
  ) => {

    const response =
      await api.get(
        `/cases/${caseId}`
      );

    return response.data;
  };

export const updateCase =
  async (
    caseId:
      number |
      string,
    data: any
  ) => {

    const response =
      await api.put(
        `/cases/${caseId}`,
        data
      );

    return response.data;
  };

export const deleteCase =
  async (
    caseId:
      number |
      string
  ) => {

    const response =
      await api.delete(
        `/cases/${caseId}`
      );

    return response.data;
  };

export const confirmPreviewFiles =
  async (
    caseId:
      number |
      string
  ) => {

    const response =
      await api.put(
        `/cases/${caseId}/confirm-preview-files`
      );

    return response.data;
  };

export const approvePreview =
  async (
    caseId:
      number |
      string
  ) => {

    const response =
      await api.put(
        `/cases/${caseId}/approve-preview`
      );

    return response.data;
  };

export const updateCaseStatus =
  async (
    caseId:
      number |
      string,
    status: string
  ) => {

    const response =
      await api.put(
        `/cases/${caseId}/status`,
        {
          status,
        }
      );

    return response.data;
  };

export const rejectPreview =
  async (
    caseId:
      number |
      string
  ) => {

    const response =
      await api.put(
        `/cases/${caseId}/reject-preview`
      );

    return response.data;
  };