import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useScheduleStore } from "../store/scheduleStore";

export function HistoryTab() {
  const history = useScheduleStore((state) => state.history);

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border-2 border-white/30"
      >
        <TrendingUp className="w-12 sm:w-16 h-12 sm:h-16 text-cyan-300 mx-auto mb-4" />
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          No history yet
        </h3>
        <p className="text-gray-300 text-sm sm:text-base">
          Complete your first week to see your achievements!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 sm:space-y-6"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
        Weekly History
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {history.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/10 to-cyan-500/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-white/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Week {entry.week}
              </h3>
              <span className="text-xs font-medium text-cyan-300 bg-white/10 px-3 py-1 rounded-full border border-cyan-400/30">
                {entry.date}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-cyan-300">
                    Lilia
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {entry.liliaCompletion}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden border border-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${entry.liliaCompletion}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full shadow-lg shadow-pink-500/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-cyan-300">
                    Abdellah
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {entry.abdellahCompletion}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden border border-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${entry.abdellahCompletion}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 h-full rounded-full shadow-lg shadow-cyan-500/50"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
