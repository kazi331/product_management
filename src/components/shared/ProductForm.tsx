"use client";

import { uploadImageAction } from "@/app/actions/upload-image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductFormData, productSchema } from "@/lib/product_scheme";
import {
  useGetProductCategoriesQuery,
  useUpdateProductMutation,
} from "@/services/api";
import { Category } from "@/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    category: Category;
  };
  isLoading?: boolean;
}

export function ProductForm({
  initialData,
  isLoading = false,
}: ProductFormProps) {
  const isEditMode = !!initialData?.id;
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      categoryId: initialData?.category.id || "",
      images: initialData?.images || [],
      id: initialData?.id || "",
    },
  });

  const [
    updateProduct,
    { isError, isLoading: createLoading, isSuccess, error },
  ] = useUpdateProductMutation();
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorMessage,
  } = useGetProductCategoriesQuery({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      setUploadError("Image size must be less than 32MB");
      return;
    }

    const currentImages = form.getValues("images");
    if (currentImages.length >= 10) {
      setUploadError("Maximum 10 images allowed");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const imageUrl = await uploadImageAction(uploadFormData);
      const updatedImages = [...currentImages, imageUrl];
      form.setValue("images", updatedImages);
      e.currentTarget.value = "";
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = (imageUrl: string) => {
    const currentImages = form.getValues("images");
    if (currentImages.length >= 10) {
      setUploadError("Maximum 10 images allowed");
      return;
    }

    try {
      new URL(imageUrl);
      const updatedImages = [...currentImages, imageUrl];
      form.setValue("images", updatedImages);
      setUploadError(null);
    } catch {
      setUploadError("Invalid URL format");
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images");
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", updatedImages);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setSubmitSuccess(false);
    try {
      const res = await updateProduct(data);
      router.push(`/products/${res?.data?.slug}`); // Push to product page

      setSubmitSuccess(true);
      if (!isEditMode) {
        form.reset();
      }
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Failed to submit form",
      });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Product" : "Create Product"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the product details below"
            : "Fill in the details to create a new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
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
            {form.formState.errors.root && (
              <Alert className="border-red-200 bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Product Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product name"
                      disabled={form.formState.isSubmitting || isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Enter product description"
                      rows={4}
                      disabled={form.formState.isSubmitting || isLoading}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 border-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Price <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter product price"
                      disabled={form.formState.isSubmitting || isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      disabled={form.formState.isSubmitting || isLoading}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 border-input"
                      {...field}
                    >
                      <option value="">Select a category</option>
                      {categories?.map((category: Category) => (
                        <option
                          key={category?.id}
                          value={category?.id}
                          selected={
                            initialData?.category.id === category?.id || false
                          }
                        >
                          {category?.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Product Images <span className="text-red-500">*</span>
                  </FormLabel>

                  <div className="space-y-2">
                    {/* File Upload */}
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={
                          isUploading ||
                          form.formState.isSubmitting ||
                          isLoading ||
                          field.value.length >= 10
                        }
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={(e) => {
                          if (
                            isUploading ||
                            form.formState.isSubmitting ||
                            isLoading ||
                            field.value.length >= 10
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">
                              Click to upload image
                            </span>
                          </>
                        )}
                      </label>
                    </div>

                    {/* Upload error message */}
                    {uploadError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {uploadError}
                      </p>
                    )}

                    {/* Manual URL Input */}
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Or paste image URL manually
                      </p>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                          disabled={
                            form.formState.isSubmitting ||
                            isLoading ||
                            field.value.length >= 10
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const input = e.currentTarget;
                              if (input.value.trim()) {
                                handleAddImageUrl(input.value.trim());
                                input.value = "";
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const input = e.currentTarget
                              .previousElementSibling as HTMLInputElement;
                            if (input.value.trim()) {
                              handleAddImageUrl(input.value.trim());
                              input.value = "";
                            }
                          }}
                          disabled={
                            form.formState.isSubmitting ||
                            isLoading ||
                            field.value.length >= 10
                          }
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Image List */}
                    {field.value.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <p className="text-sm font-medium text-muted-foreground">
                          Added Images ({field.value.length}/10)
                        </p>
                        <div className="space-y-2">
                          {field.value.map((image, index) => (
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
                              </div>
                              <Button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                disabled={
                                  form.formState.isSubmitting || isLoading
                                }
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

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isLoading}
                className="flex-1"
              >
                {form.formState.isSubmitting || isLoading ? (
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
        </Form>
      </CardContent>
    </Card>
  );
}
