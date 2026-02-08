import { BASE_URL } from "../../config/api";

/**
 * Upload Event Banner
 * @param file - Image file to upload (JPG, JPEG, PNG, WEBP, max 10MB)
 * @returns Upload result with URL and key
 */
export const uploadEventBanner = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/assets/event-banner`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload event banner");
  }

  const data = await response.json();
  return data.data; // Returns { url, key, bucket }
};

/**
 * Upload Generic Asset
 * @param file - File to upload (any type, max 10MB)
 * @param folder - Optional folder path
 * @returns Upload result with URL and key
 */
export const uploadAsset = async (file: File, folder?: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const url = folder 
    ? `${BASE_URL}/assets/upload?folder=${encodeURIComponent(folder)}`
    : `${BASE_URL}/assets/upload`;

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload asset");
  }

  const data = await response.json();
  return data.data; // Returns { url, key, bucket }
};

/**
 * Delete Asset
 * @param key - File key from upload response
 */
export const deleteAsset = async (key: string) => {
  const response = await fetch(`${BASE_URL}/assets/${encodeURIComponent(key)}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete asset");
  }

  return response.json();
};

/**
 * Get Signed URL for Asset
 * @param key - File key from upload response
 * @param expiresIn - Expiration time in seconds (default: 3600)
 * @returns Signed URL
 */
export const getSignedUrl = async (key: string, expiresIn: number = 3600) => {
  const response = await fetch(
    `${BASE_URL}/assets/signed-url/${encodeURIComponent(key)}?expiresIn=${expiresIn}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get signed URL");
  }

  const data = await response.json();
  return data.data.url;
};

/**
 * Upload Organization Icon
 * @param id - Organization ID
 * @param file - Icon file to upload (JPEG, PNG, max 10MB)
 * @returns Updated organization data
 */
export const uploadOrganizationIcon = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append('icon', file);

  const response = await fetch(`${BASE_URL}/organizations/uploadIcon/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload organization icon");
  }

  const data = await response.json();
  return data.data;
};
