import type { ImgBbUploadResponse } from "../types";

const apiKey = import.meta.env.VITE_IMGBB_API_KEY?.trim();

if (!apiKey) {
    throw new Error("Missing VITE_IMGBB_API_KEY in .env");
}

const uploadUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Image upload failed. Please try a different image.");
    }

    const data = (await response.json()) as ImgBbUploadResponse;
    if (!data.success || !data.data?.url) {
        throw new Error(data.error?.message || "Image upload failed.");
    }

    return data.data.url;
};
