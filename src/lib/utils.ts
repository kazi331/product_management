import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const currency = (amount: number, locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// check if the image can be loaded or not
export const isValidImage = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.headers.get("content-type")?.startsWith("image/");
  } catch (error) {
    return false;
  }
};

export const isValidUrl = (url: unknown): boolean => {
  if (typeof url !== "string" || !url.trim()) return false;

  const cleanedUrl = url.trim();

  try {
    new URL(cleanedUrl);
    return true;
  } catch {
    return false;
  }
};

export const getImageSrc = (
  image: unknown,
  fallback = "/images/no_image.png"
): string => {
  if (typeof image !== "string" || !image.trim()) return fallback;

  let url = image.trim();

  if (isValidUrl(url)) return url;

  // Normalize and recheck
  url = url.replace(/^\/+/, "");

  if (isValidUrl(url)) return url;

  return fallback;
};

export const dateView = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const serializeError = (error: any) => {
  let msg = "";
  if (error?.data) {
    msg =
      "data" in error && typeof error.data === "object" && error.data !== null
        ? (error.data as { message?: string }).message || "An error occurred"
        : "An error occurred";
    return msg;
  }
};
