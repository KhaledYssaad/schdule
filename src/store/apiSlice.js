import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://api.jsonbin.io/v3/b";

// Helper to clean keys
const clean = (val) => (val ? val.replace(/^["']|["']$/g, "") : "");

const ABDALLAH_KEY = clean(import.meta.env.VITE_JSONBIN_ACCESS_KEY_ABDALLAH);

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Schedule"],
  endpoints: (builder) => ({
    getSchedule: builder.query({
      queryFn: async (user) => {
        const binMap = {
          Lilia: clean(import.meta.env.VITE_JSONBIN_BIN_ID_LILIA),
          Abdallah: clean(import.meta.env.VITE_JSONBIN_BIN_ID_ABDALLAH),
        };
        const binId = binMap[user];

        if (!binId || !ABDALLAH_KEY) return { error: "Missing config" };

        try {
          const response = await fetch(`${BASE_URL}/${binId}/latest`, {
            headers: { "X-Access-Key": ABDALLAH_KEY },
          });
          const data = await response.json();
          return { data: data.record };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["Schedule"],
    }),
    updateSchedule: builder.mutation({
      queryFn: async ({ user, data }) => {
        const binMap = {
          Lilia: clean(import.meta.env.VITE_JSONBIN_BIN_ID_LILIA),
          Abdallah: clean(import.meta.env.VITE_JSONBIN_BIN_ID_ABDALLAH),
        };
        const binId = binMap[user];

        if (!binId || !ABDALLAH_KEY) return { error: "Missing config" };

        try {
          const response = await fetch(`${BASE_URL}/${binId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-Access-Key": ABDALLAH_KEY,
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          return { data: result.record };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ["Schedule"],
    }),
  }),
});

export const { useGetScheduleQuery, useUpdateScheduleMutation } = apiSlice;
