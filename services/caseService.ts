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