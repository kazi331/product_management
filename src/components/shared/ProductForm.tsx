"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    categoryId: string;
  };
  categories: Array<{ id: string; name: string }>;
  onSubmit: (data: {
    name: string;
    description: string;
    images: string[];
    price: number;
    categoryId: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  images?: string;
  price?: string;
  categoryId?: string;
  submit?: string;
}

interface FormData {
  name: string;
  description: string;
  images: string[];
  price: string;
  categoryId: string;
  imageInput: string;
}

interface ImageUploadState {
  isUploading: boolean;
  uploadingIndex: number | null;
  uploadError: string | null;
}

export function ProductForm({
  initialData,
  categories,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    images: initialData?.images || [],
    price: initialData?.price?.toString() || "",
    categoryId: initialData?.categoryId || "",
    imageInput: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadState, setUploadState] = useState<ImageUploadState>({
    isUploading: false,
    uploadingIndex: null,
    uploadError: null,
  });

  const isEditMode = !!initialData?.id;

  const validateName = (value: string): string | undefined => {
    if (!value.trim()) return "Product name is required";
    if (value.trim().length < 3)
      return "Product name must be at least 3 characters";
    if (value.trim().length > 100)
      return "Product name must not exceed 100 characters";
    return undefined;
  };

  const validateDescription = (value: string): string | undefined => {
    if (!value.trim()) return "Description is required";
    if (value.trim().length < 10)
      return "Description must be at least 10 characters";
    if (value.trim().length > 1000)
      return "Description must not exceed 1000 characters";
    return undefined;
  };

  const validatePrice = (value: string): string | undefined => {
    if (!value) return "Price is required";
    const numPrice = Number.parseFloat(value);
    if (isNaN(numPrice)) return "Price must be a valid number";
    if (numPrice <= 0) return "Price must be greater than 0";
    if (numPrice > 999999999) return "Price is too large";
    if (!/^\d+(\.\d{1,2})?$/.test(value))
      return "Price can have maximum 2 decimal places";
    return undefined;
  };

  const validateImages = (images: string[]): string | undefined => {
    if (images.length === 0) return "At least one image is required";
    if (images.length > 10) return "Maximum 10 images allowed";

    for (const image of images) {
      if (!image.trim()) return "Image URL cannot be empty";
      try {
        new URL(image);
      } catch {
        return "Invalid image URL format";
      }
    }
    return undefined;
  };

  const validateCategoryId = (value: string): string | undefined => {
    if (!value) return "Category is required";
    if (!categories.find((cat) => cat.id === value))
      return "Selected category is invalid";
    return undefined;
  };

  const validateImageInput = (value: string): string | undefined => {
    if (!value.trim()) return undefined;
    try {
      new URL(value);
    } catch {
      return "Invalid URL format";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const descriptionError = validateDescription(formData.description);
    if (descriptionError) newErrors.description = descriptionError;

    const priceError = validatePrice(formData.price);
    if (priceError) newErrors.price = priceError;

    const imagesError = validateImages(formData.images);
    if (imagesError) newErrors.images = imagesError;

    const categoryError = validateCategoryId(formData.categoryId);
    if (categoryError) newErrors.categoryId = categoryError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ... existing input change and blur handlers ...
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newErrors = { ...errors };
      delete newErrors[name as keyof FormErrors];
      setErrors(newErrors);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let error: string | undefined;
    switch (name) {
      case "name":
        error = validateName(formData.name);
        break;
      case "description":
        error = validateDescription(formData.description);
        break;
      case "price":
        error = validatePrice(formData.price);
        break;
      case "categoryId":
        error = validateCategoryId(formData.categoryId);
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file
    if (!file.type.startsWith("image/")) {
      setUploadState({
        isUploading: false,
        uploadingIndex: null,
        uploadError: "Please select a valid image file",
      });
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      // 32MB limit
      setUploadState({
        isUploading: false,
        uploadingIndex: null,
        uploadError: "Image size must be less than 32MB",
      });
      return;
    }

    if (formData.images.length >= 10) {
      setUploadState({
        isUploading: false,
        uploadingIndex: null,
        uploadError: "Maximum 10 images allowed",
      });
      return;
    }

    setUploadState({
      isUploading: true,
      uploadingIndex: formData.images.length,
      uploadError: null,
    });

    try {
      const { uploadImageAction } = await import("@/app/actions/upload-image");
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const imageUrl = await uploadImageAction(uploadFormData);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      setUploadState({
        isUploading: false,
        uploadingIndex: null,
        uploadError: null,
      });
      // Clear any image-related errors
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
      // Reset file input
      e.currentTarget.value = "";
    } catch (error) {
      setUploadState({
        isUploading: false,
        uploadingIndex: null,
        uploadError:
          error instanceof Error ? error.message : "Failed to upload image",
      });
    }
  };

  // ... existing handle add image function ...
  const handleAddImage = () => {
    const imageError = validateImageInput(formData.imageInput);
    if (imageError) {
      setErrors((prev) => ({ ...prev, images: imageError }));
      return;
    }

    if (formData.imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.imageInput.trim()],
        imageInput: "",
      }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  // ... existing handle remove image ...
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ... existing handle submit ...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        images: formData.images,
        price: Number.parseFloat(formData.price),
        categoryId: formData.categoryId,
      });
      setSubmitSuccess(true);
      if (!isEditMode) {
        setFormData({
          name: "",
          description: "",
          images: [],
          price: "",
          categoryId: "",
          imageInput: "",
        });
        setTouched({});
      }
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit:
          error instanceof Error ? error.message : "Failed to submit form",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Product" : "Create Product"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the product details below"
            : "Fill in the details to create a new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submit Success Alert */}
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Product {isEditMode ? "updated" : "created"} successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Error Alert */}
          {errors.submit && (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          {/* Product Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter product name"
              className={errors.name && touched.name ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.name && touched.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter product description"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${
                errors.description && touched.description
                  ? "border-red-500"
                  : "border-input"
              }`}
              disabled={isSubmitting}
            />
            {errors.description && touched.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium">
              Price <span className="text-red-500">*</span>
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter product price"
              className={errors.price && touched.price ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.price && touched.price && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.price}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${
                errors.categoryId && touched.categoryId
                  ? "border-red-500"
                  : "border-input"
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && touched.categoryId && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Product Images <span className="text-red-500">*</span>
            </label>

            <div className="space-y-2">
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={
                      uploadState.isUploading ||
                      isSubmitting ||
                      formData.images.length >= 10
                    }
                    className="hidden"
                  />
                  <div
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      if (
                        uploadState.isUploading ||
                        isSubmitting ||
                        formData.images.length >= 10
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {uploadState.isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Click to upload image</span>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Upload error message */}
              {uploadState.uploadError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {uploadState.uploadError}
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Or paste image URL manually
              </p>
              <div className="flex gap-2">
                <Input
                  name="imageInput"
                  type="url"
                  value={formData.imageInput}
                  onChange={handleInputChange}
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  disabled={isSubmitting || formData.images.length >= 10}
                />
                <Button
                  type="button"
                  onClick={handleAddImage}
                  disabled={
                    isSubmitting ||
                    !formData.imageInput.trim() ||
                    formData.images.length >= 10
                  }
                  variant="outline"
                >
                  Add
                </Button>
              </div>
            </div>

            {errors.images && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.images}
              </p>
            )}

            {/* Image List */}
            {formData.images.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Added Images ({formData.images.length}/10)
                </p>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="h-12 w-12 object-cover rounded mr-3 inline-block"
                        />
                        <p className="text-sm truncate text-foreground inline-block align-middle">
                          {image}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        disabled={isSubmitting}
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
