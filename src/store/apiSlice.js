import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../lib/supabase";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Schedule"],
  endpoints: (builder) => ({
    getSchedule: builder.query({
      queryFn: async (user) => {
        if (!user) {
          return {
            data: {
              Monday: [],
              Tuesday: [],
              Wednesday: [],
              Thursday: [],
              Friday: [],
              Saturday: [],
              Sunday: [],
            },
          };
        }
        try {
          const { data, error } = await supabase
            .from("activities")
            .select("*")
            .eq("owner", user)
            .order("time");

          if (error) throw error;

          // Transform flat table data into day-grouped object for the UI
          const transformed = {
            Sunday: [],
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
          };

          if (data) {
            console.log(`Fetched ${data.length} tasks for ${user}`);
            data.forEach((task) => {
              // Normalize case for comparison
              const day =
                task.day.charAt(0).toUpperCase() +
                task.day.slice(1).toLowerCase();
              if (transformed[day]) {
                transformed[day].push({
                  id: task.id,
                  activity: task.activity,
                  description: task.description ?? "",
                  doing: task.doing ?? "",
                  time: task.time,
                  completed: !!task.done,
                  createdAt: task.created_at,
                });
              } else {
                console.warn(`Task ${task.id} has invalid day: ${task.day}`);
              }
            });
          }

          return { data: transformed };
        } catch (error) {
          console.error("Get Schedule Error:", error);
          return { error: error.message };
        }
      },
      providesTags: (result, error, user) => [{ type: "Schedule", id: user }],
    }),

    getWeeklyHistory: builder.query({
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from("weekly_history")
            .select("*")
            .order("week_start", { ascending: false });

          if (error) throw error;
          return { data: data || [] };
        } catch (error) {
          const message = error?.message || "";
          if (
            message.includes("does not exist") ||
            message.includes("relation") ||
            message.includes("column")
          ) {
            return { data: [] };
          }

          console.error("Get Weekly History Error:", error);
          return { error: message || "Unknown error occurred" };
        }
      },
      providesTags: [{ type: "Schedule", id: "history" }],
    }),

    addActivity: builder.mutation({
      queryFn: async ({
        user,
        day,
        activity,
        description = "",
        doing = "",
        time,
      }) => {
        if (!user || !day) return { error: "Missing user or day" };
        try {
          const { data, error } = await supabase
            .from("activities")
            .insert([
              {
                owner: user,
                day,
                activity,
                description,
                doing,
                time,
                done: false,
              },
            ])
            .select();

          if (error) throw error;
          return { data: data ? data[0] : null };
        } catch (error) {
          console.error("Add Activity Error:", error);
          return { error: error.message || "Unknown error occurred" };
        }
      },
      invalidatesTags: (result, error, { user }) => [
        { type: "Schedule", id: user },
      ],
    }),

    toggleActivity: builder.mutation({
      queryFn: async ({ id, done }) => {
        if (!id) return { error: "Missing activity ID" };
        try {
          const { data, error } = await supabase
            .from("activities")
            .update({ done })
            .eq("id", id);

          if (error) throw error;
          return { data };
        } catch (error) {
          console.error("Toggle Activity Error:", error);
          return { error: error.message || "Unknown error occurred" };
        }
      },
      invalidatesTags: (result, error, { user }) => [
        { type: "Schedule", id: user },
      ],
    }),

    updateActivity: builder.mutation({
      queryFn: async ({ id, activity, description = "", doing = "", time }) => {
        if (!id) return { error: "Missing activity ID" };
        try {
          const { data, error } = await supabase
            .from("activities")
            .update({ activity, description, doing, time })
            .eq("id", id);

          if (error) throw error;
          return { data };
        } catch (error) {
          console.error("Update Activity Error:", error);
          return { error: error.message || "Unknown error occurred" };
        }
      },
      invalidatesTags: (result, error, { user }) => [
        { type: "Schedule", id: user },
      ],
    }),

    deleteActivity: builder.mutation({
      queryFn: async ({ id }) => {
        if (!id) return { error: "Missing activity ID" };
        try {
          const { data, error } = await supabase
            .from("activities")
            .delete()
            .eq("id", id);

          if (error) throw error;
          return { data };
        } catch (error) {
          console.error("Delete Activity Error:", error);
          return { error: error.message || "Unknown error occurred" };
        }
      },
      invalidatesTags: (result, error, { user }) => [
        { type: "Schedule", id: user },
      ],
    }),
  }),
});

export const {
  useGetScheduleQuery,
  useGetWeeklyHistoryQuery,
  useAddActivityMutation,
  useToggleActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} = apiSlice;
