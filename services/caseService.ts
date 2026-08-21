import api from "./api";

export const submitCase = async (data: any) => {
  const response = await api.post("/cases", data);
  return response.data;
};

export const uploadCaseFile = async (
  caseId: number,
  file: any,
  category: string,
  onProgress?: (progress: number) => void
) => {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();

      const formData = new FormData();

      formData.append(
        "category",
        category
      );

      formData.append(
        "file",
        {
          uri: file.uri,
          name:
            file.name ||
            "uploaded-file",
          type:
            file.mimeType ||
            file.type ||
            "application/octet-stream",
        } as any
      );

      const baseURL =
        api.defaults.baseURL || "";

      const url =
        `${baseURL}/cases/${caseId}/upload`;

      xhr.open(
        "POST",
        url
      );

      const token =
        api.defaults.headers.common?.[
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

      xhr.upload.onprogress = (
        event
      ) => {
        if (
          event.lengthComputable &&
          event.total > 0
        ) {
          const progress =
            Math.round(
              (event.loaded /
                event.total) *
              100
            );

          onProgress?.(
            Math.min(
              100,
              Math.max(
                0,
                progress
              )
            )
          );
        }
      };

      xhr.onload = () => {
        if (
          xhr.status >= 200 &&
          xhr.status < 300
        ) {
          onProgress?.(100);

          let responseData: any =
            xhr.responseText;

          try {
            responseData =
              JSON.parse(
                xhr.responseText
              );
          } catch { }

          resolve(
            responseData
          );
        } else {
          reject(
            new Error(
              `Upload failed with status ${xhr.status}`
            )
          );
        }
      };

      xhr.onerror = () => {
        reject(
          new Error(
            "Network error while uploading file"
          )
        );
      };

      xhr.onabort = () => {
        reject(
          new Error(
            "File upload was cancelled"
          )
        );
      };

      xhr.send(formData);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCase = async (
  caseId: number | string
) => {
  try {
    const response =
      await api.get(
        `/cases/${caseId}`
      );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching case:",
      error?.response?.data ||
      error?.message ||
      error
    );

    throw error;
  }
};

export const updateCase = async (
  caseId: number | string,
  data: any
) => {
  try {
    const response =
      await api.put(
        `/cases/${caseId}`,
        data
      );

    console.log(
      "Case updated:",
      response.data
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating case:",
      error?.response?.data ||
      error?.message ||
      error
    );

    throw error;
  }
};

export const deleteCase = async (
  caseId: number | string
) => {
  try {
    const response =
      await api.delete(
        `/cases/${caseId}`
      );

    console.log(
      "Case deleted:",
      response.data
    );

    return response.data;
  } catch (error: any) {
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
    caseId: number | string
  ) => {
    try {
      const response =
        await api.put(
          `/cases/${caseId}/confirm-preview-files`
        );

      console.log(
        "Preview files confirmed:",
        response.data
      );

      return response.data;
    } catch (error: any) {
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
    caseId: number | string
  ) => {
    try {
      const response =
        await api.put(
          `/cases/${caseId}/approve-preview`
        );

      console.log(
        "Preview approved:",
        response.data
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Error approving preview:",
        error?.response?.data ||
        error?.message ||
        error
      );

      throw error;
    }
  };

export const rejectPreview =
  async (
    caseId: number | string
  ) => {
    try {
      const response =
        await api.put(
          `/cases/${caseId}/reject-preview`
        );

      console.log(
        "Preview rejected:",
        response.data
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