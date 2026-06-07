import React from "react";
import { motion } from "framer-motion";
import { useScheduleStore } from "../store/scheduleStore";

export function DayProgress({ user, day }) {
  const getCompletionPercentage = useScheduleStore(
    (state) => state.getCompletionPercentage,
  );
  const percentage = getCompletionPercentage(user, day);

  return (
    <div className="mb-6 sm:mb-8">
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
