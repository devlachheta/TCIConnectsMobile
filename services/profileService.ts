import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

export const updateProfile = async (
  profileData: {
    full_name: string;
    phone: string;
    business_name: string;
    license_number: string;
    vat_id: string;
    country: string;
    address: string;
  }
) => {
  const response = await api.put(
    "/update-profile",
    profileData
  );

  return response.data;
};

export const uploadProfileImage = async (
  imageUri: string
) => {
  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    name: "profile.jpg",
    type: "image/jpeg",
  } as any);

  const response = await api.post(
    "/upload-profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};