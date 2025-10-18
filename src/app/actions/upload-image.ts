"use server";

export async function uploadImageAction(formData: FormData): Promise<string> {
  const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

  if (!IMGBB_API_KEY) {
    throw new Error(
      "imgbb API key is not configured. Please add IMGBB_API_KEY to your environment variables."
    );
  }

  try {
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Failed to upload image to imgbb"
      );
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
    throw new Error("Image upload failed: Unknown error");
  }
}
