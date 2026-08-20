import api from "./api";

export const submitCase = async (data: any) => {
  const response = await api.post("/cases", data);
  return response.data;
};

export const uploadCaseFile = async (
  caseId: number,
  file: any,
  category: string
) => {
  const formData = new FormData();

  formData.append("category", category);

  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || "application/octet-stream",
  } as any);

  const response = await api.post(
    `/cases/${caseId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const getCase = async (
  caseId: number | string
) => {
  try {
    const response = await api.get(
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
    const response = await api.put(
      `/cases/${caseId}`,
      data
    );

    console.log(
      " Case updated:",
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
    const response = await api.delete(
      `/cases/${caseId}`
    );

    console.log(
      " Case deleted:",
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

export const confirmPreviewFiles = async (
  caseId: number | string
) => {
  try {
    const response = await api.put(
      `/cases/${caseId}/confirm-preview-files`
    );

    console.log(
      " Preview files confirmed:",
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


export const approvePreview = async (
  caseId: number | string
) => {
  try {
    const response = await api.put(
      `/cases/${caseId}/approve-preview`
    );

    console.log(
      " Preview approved:",
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


export const rejectPreview = async (
  caseId: number | string
) => {
  try {
    const response = await api.put(
      `/cases/${caseId}/reject-preview`
    );

    console.log(
      " Preview rejected:",
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

    if (search.trim()) {
      params.search = search.trim();
    }

    if (status) {
      params.status = status;
    }

    if (deadline) {
      params.deadline = deadline;
    }

    console.log("Fetching cases with params:", params);

    const response = await api.get("/cases", {
      params,
    });

    console.log("Cases API response:", response.data);

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

export const uploadPreviewFile = async (
  caseId: number | string,
  file: any
) => {
  try {
    // Step 1: Upload the preview file
    const uploadResponse = await uploadCaseFile(
      Number(caseId),
      file,
      "preview_file"
    );

    console.log(
      "Preview uploaded:",
      uploadResponse
    );

    // Step 2: Confirm preview files
    // This changes preview_status to "Waiting User"
    const confirmResponse =
      await confirmPreviewFiles(caseId);

    console.log(
      "Preview confirmed:",
      confirmResponse
    );

    return confirmResponse;

  } catch (error: any) {
    console.error(
      "Error uploading preview:",
      error?.response?.data ||
      error?.message ||
      error
    );

    throw error;
  }
};