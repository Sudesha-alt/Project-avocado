import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
    reducerPath: "adminApi",
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (id) => `users/${id}`,
            providesTags: ["User"]
        })
    })
});

export const { useGetUserQuery } = api;