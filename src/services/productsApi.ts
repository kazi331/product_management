import { login } from "@/features/auth/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

export const productsApiapi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.bitechx.com",
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    login: builder.mutation({
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
    getProducts: builder.query({
      query: () => "products",
    }),
  }),
});

export const { useLoginMutation, useGetProductsQuery } = productsApiapi;
