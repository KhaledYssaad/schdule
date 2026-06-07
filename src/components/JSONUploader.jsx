import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check } from "lucide-react";
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

export function JSONUploader({ user, onClose }) {
  const [jsonData, setJsonData] = useState(null);
  const [selectedDays, setSelectedDays] = useState(DAYS);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const importScheduleFromJSON = useScheduleStore(
    (state) => state.importScheduleFromJSON,
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setJsonData(data);
        setError("");
      } catch (err) {
        setError("Invalid JSON format. Please check your file.");
        setJsonData(null);
      }
    };
    reader.onerror = () => {
      setError("Error reading file.");
      setJsonData(null);
    };
    reader.readAsText(file);
  };

  const handlePasteJSON = (text) => {
    try {
      const data = JSON.parse(text);
      setJsonData(data);
      setError("");
    } catch (err) {
      setError("Invalid JSON format. Please check your input.");
      setJsonData(null);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleImport = async () => {
    if (!jsonData) {
      setError("Please provide JSON data first.");
      return;
    }
    if (selectedDays.length === 0) {
      setError("Please select at least one day.");
      return;
    }

    setIsLoading(true);
    try {
      await importScheduleFromJSON(user, jsonData, selectedDays);
      setIsLoading(false);
      setJsonData(null);
      setSelectedDays(DAYS);
      setError("");
      onClose();
    } catch (err) {
      console.error("Import failed:", err);
      setError("Failed to import schedule. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border-2 border-white/20"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Import Schedule
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-cyan-300" />
            </motion.button>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* File Upload */}
            <div className="border-2 sm:border-3 border-dashed border-cyan-400/50 rounded-lg sm:rounded-xl p-6 text-center hover:border-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer group backdrop-blur-md">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="json-upload"
              />
              <label htmlFor="json-upload" className="cursor-pointer block">
                <Upload className="w-7 sm:w-8 h-7 sm:h-8 text-cyan-300 mx-auto mb-2 group-hover:text-cyan-200" />
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Upload JSON
                </p>
                <p className="text-xs text-gray-300 mt-1">or drag and drop</p>
              </label>
            </div>

            {/* Paste JSON */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-cyan-300 mb-2">
                Or paste JSON:
              </label>
              <textarea
                onChange={(e) => {
                  if (e.target.value.trim()) {
                    handlePasteJSON(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 border-2 border-white/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs sm:text-sm font-mono bg-white/10 text-white placeholder-gray-400 backdrop-blur-md"
                rows="4"
                placeholder='{"Monday": [{"time": "08:00 - 09:30", "activity": "Exercise"}]}'
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border-2 border-red-400/50 text-red-200 px-4 py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm backdrop-blur-md"
              >
                {error}
              </motion.div>
            )}

            {/* Selected Days */}
            {jsonData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-white/20 backdrop-blur-md"
              >
                <p className="text-xs sm:text-sm font-semibold text-cyan-300 mb-3">
                  Select days to apply:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS.map((day) => (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleDay(day)}
                      className={`p-2 rounded-lg font-semibold text-xs sm:text-sm transition-all border-2 ${
                        selectedDays.includes(day)
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-300 shadow-lg shadow-cyan-500/50"
                          : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                      }`}
                    >
                      {day}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Import Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleImport}
              disabled={!jsonData || isLoading}
              className={`w-full py-3 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base border-2 ${
                jsonData && !isLoading
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/50"
                  : "bg-white/10 text-gray-400 border-white/20 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-4 sm:w-5 h-4 sm:h-5 border-2 sm:border-3 border-white border-t-transparent rounded-full"
                  />
                  Importing...
                </>
              ) : (
                <>
                  <Check className="w-4 sm:w-5 h-4 sm:h-5" />
                  Import Schedule
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
