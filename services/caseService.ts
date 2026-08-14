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