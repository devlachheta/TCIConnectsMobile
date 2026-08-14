import api from "./api";

export const getProfile = async (token: string) => {
  const response = await api.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProfile = async (
  token: string,
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
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const uploadProfileImage = async (
  token: string,
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
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};