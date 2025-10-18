import { uploadImageAction } from "@/app/actions/upload-image";

export async function uploadImageToImgbb(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", "e7ed64f52420a87d8323875125375a4f");

  return uploadImageAction(formData);
}
