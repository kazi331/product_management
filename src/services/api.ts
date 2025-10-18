import { login } from "@/features/auth/authSlice";
import { RootState } from "@/lib/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.bitechx.com",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // refetchOnFocus: true,
  // refetchOnReconnect: true,
  tagTypes: ["Product", "Products", "Category"],

  endpoints: ({ mutation, query }) => ({
    login: mutation({
      query: (credentials) => ({
        url: "auth",
        method: "Post",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(login(data?.token));
          toast.success("Login successful");
          return data;
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "An error occurred");
        }
      },
    }),
    getProducts: query({
      query: (queryString: string) => `products${queryString}`,
      providesTags: ["Products"],
    }),
    getProduct: query({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getProductCategories: query({
      query: () => `categories`,
      providesTags: ["Category"],
    }),
    deleteProduct: mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        "Products",
      ],
    }),
    updateProduct: mutation({
      query: (data) => ({
        url: `products/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Product", id: data.id },
        "Products",
      ],
    }),
    createProduct: mutation({
      query: (data) => ({
        url: `products`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductCategoriesQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useCreateProductMutation,
} = api;
