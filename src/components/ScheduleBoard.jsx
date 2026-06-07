import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { DaySchedule } from "./DaySchedule";
import { HistoryTab } from "./HistoryTab";
import { JSONUploader } from "./JSONUploader";
import { useScheduleStore } from "../store/scheduleStore";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function ScheduleBoard() {
  const [activeTab, setActiveTab] = useState("Lilia");
  const [activeDay, setActiveDay] = useState("Monday");
  const [showJSONUploader, setShowJSONUploader] = useState(false);
  const [showEndWeekConfirm, setShowEndWeekConfirm] = useState(false);
  const currentUser = useScheduleStore((state) => state.currentUser);
  const weekNumber = useScheduleStore((state) => state.weekNumber);
  const startDate = useScheduleStore((state) => state.startDate);
  const endWeek = useScheduleStore((state) => state.endWeek);

  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const weekRange = `${formatDate(start)} - ${formatDate(end)}`;

  const setCurrentUser = useScheduleStore((state) => state.setCurrentUser);
  const checkAndAutoReset = useScheduleStore(
    (state) => state.checkAndAutoReset,
  );
  const fetchInitialData = useScheduleStore((state) => state.fetchInitialData);
  const subscribeToChanges = useScheduleStore(
    (state) => state.subscribeToChanges,
  );

  // Check for auto-reset on mount and daily
  useEffect(() => {
    fetchInitialData();
    const unsubscribe = subscribeToChanges();
    // checkAndAutoReset(); // Disabled auto-reset on mount to prevent refresh-skipping bug
    const interval = setInterval(checkAndAutoReset, 3600000); // Check every hour
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [checkAndAutoReset, fetchInitialData, subscribeToChanges]);

  const handleEndWeek = () => {
    endWeek();
    setShowEndWeekConfirm(false);
  };

  const isEditable = currentUser === activeTab;

  const goToPreviousDay = () => {
    const currentIndex = DAYS.indexOf(activeDay);
    if (currentIndex > 0) {
      setActiveDay(DAYS[currentIndex - 1]);
    }
  };

  const goToNextDay = () => {
    const currentIndex = DAYS.indexOf(activeDay);
    if (currentIndex < DAYS.length - 1) {
      setActiveDay(DAYS[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 text-white shadow-2xl sticky top-0 z-50 border-b-4 border-blue-500"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Shared Moments
              </h1>
              <p className="text-blue-200 mt-1 text-sm sm:text-base font-semibold">
                Week {weekNumber} ({weekRange})
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <p className="text-xs sm:text-sm font-semibold text-white">
                👤 <span className="text-cyan-300">{currentUser}</span>
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Tab Navigation - User Selection */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="flex gap-2 mb-6 sm:mb-8 flex-wrap justify-center sm:justify-start">
          {["Lilia", "Abdellah", "History"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveTab(tab);
                setActiveDay("Monday");
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base backdrop-blur-md border-2 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-cyan-300 shadow-lg shadow-cyan-500/50"
                  : "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        {activeTab !== "History" && isEditable && (
          <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 flex-wrap justify-center sm:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowJSONUploader(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl sm:rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all text-sm sm:text-base backdrop-blur-md border border-green-400/50"
            >
              <Upload className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">Import JSON</span>
              <span className="sm:hidden">Import</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEndWeekConfirm(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl sm:rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all text-sm sm:text-base backdrop-blur-md border border-orange-400/50"
            >
              <Check className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">End Week</span>
              <span className="sm:hidden">Save</span>
            </motion.button>
          </div>
        )}

        {/* Day Tabs Navigation */}
        {activeTab !== "History" && (
          <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousDay}
              disabled={activeDay === "Monday"}
              className="p-2 sm:p-3 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-lg sm:rounded-xl hover:bg-white/20 hover:border-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
            </motion.button>

            <div className="flex gap-1 sm:gap-2 overflow-x-auto flex-1 justify-center pb-2">
              {DAYS.map((day) => (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveDay(day)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm whitespace-nowrap backdrop-blur-md border-2 ${
                    activeDay === day
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-cyan-300 shadow-lg shadow-cyan-500/50"
                      : "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                  }`}
                >
                  {day.slice(0, 3)}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNextDay}
              disabled={activeDay === "Sunday"}
              className="p-2 sm:p-3 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-lg sm:rounded-xl hover:bg-white/20 hover:border-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
            </motion.button>
          </div>
        )}

        {/* Content */}
        <motion.div
          key={`${activeTab}-${activeDay}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {activeTab === "History" ? (
            <HistoryTab />
          ) : (
            <>
              <div className="mb-4 text-center sm:text-right">
                <p className="text-cyan-300 text-xs sm:text-sm font-semibold backdrop-blur-md bg-white/5 px-4 py-2 rounded-lg inline-block border border-cyan-300/30">
                  {isEditable
                    ? "✓ You can edit this schedule"
                    : "🔒 Read-only mode"}
                </p>
              </div>
              <DaySchedule
                key={`${activeDay}-${activeTab}`}
                user={activeTab}
                day={activeDay}
                isEditable={isEditable}
              />
            </>
          )}
        </motion.div>
      </div>

      {/* JSON Uploader Modal */}
      <AnimatePresence>
        {showJSONUploader && (
          <JSONUploader
            user={activeTab}
            onClose={() => setShowJSONUploader(false)}
          />
        )}
      </AnimatePresence>

      {/* End Week Confirmation Modal */}
      <AnimatePresence>
        {showEndWeekConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-400/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                End Week?
              </h3>
              <p className="text-gray-200 mb-6 text-sm sm:text-base">
                Save this week's completion stats to history and reset all tasks
                for a new week?
              </p>
              <div className="flex gap-3 flex-col-reverse sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEndWeekConfirm(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all backdrop-blur-md border border-white/30"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEndWeek}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                >
                  Confirm End Week
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
