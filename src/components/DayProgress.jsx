import React from "react";
import { motion } from "framer-motion";
import { useGetScheduleQuery } from "../store/apiSlice";
import { getDayDate } from "../utils/dateHelpers";

export function DayProgress({ user, day }) {
  const { data: schedule } = useGetScheduleQuery(user);
  const tasks = (schedule && schedule[day]) || [];
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  const d = getDayDate(day);
  const dateStr = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mb-6 sm:mb-8">
      <div className="text-white text-sm font-medium mb-2">{dateStr}</div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs sm:text-sm font-semibold text-cyan-300">
          Progress
        </span>
        <span className="text-lg sm:text-xl font-bold text-white">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden border border-white/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 h-full rounded-full shadow-lg shadow-cyan-500/50"
        />
      </div>
    </div>
  );
}
