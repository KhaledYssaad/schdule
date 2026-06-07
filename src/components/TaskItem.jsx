import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Edit2, Save, X, Trash2 } from "lucide-react";
import { useScheduleStore } from "../store/scheduleStore";

export function TaskItem({ user, day, task, isEditable }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(task.activity);
  const [editedTime, setEditedTime] = useState(task.time);

  // Sync with cloud updates when not actively typing
  useEffect(() => {
    if (!isEditing) {
      setEditedActivity(task.activity);
      setEditedTime(task.time);
    }
  }, [task.activity, task.time, isEditing]);

  const toggleTask = useScheduleStore((state) => state.toggleTask);
  const updateTask = useScheduleStore((state) => state.updateTask);
  const removeTask = useScheduleStore((state) => state.removeTask);

  const handleToggle = () => {
    if (isEditable) {
      toggleTask(user, day, task.id);
    }
  };

  const handleRemove = () => {
    if (window.confirm("Are you sure you want to remove this task?")) {
      removeTask(user, day, task.id);
    }
  };

  const handleSave = () => {
    updateTask(user, day, task.id, {
      activity: editedActivity,
      time: editedTime,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedActivity(task.activity);
    setEditedTime(task.time);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300 backdrop-blur-md border-2 ${
        task.completed
          ? "bg-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
          : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <motion.button
          whileHover={isEditable ? { scale: 1.1 } : {}}
          whileTap={isEditable ? { scale: 0.9 } : {}}
          onClick={handleToggle}
          disabled={!isEditable}
          className={`flex-shrink-0 w-6 sm:w-7 h-6 sm:h-7 rounded-full border-2 sm:border-3 flex items-center justify-center transition-all ${
            task.completed
              ? "bg-cyan-500 border-cyan-400"
              : "border-white/50 hover:border-cyan-400"
          } ${!isEditable ? "cursor-default" : "cursor-pointer"}`}
        >
          {task.completed && (
            <Check className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTime}
                onChange={(e) => setEditedTime(e.target.value)}
                className="w-full px-3 py-1 text-xs sm:text-sm bg-white/10 border border-cyan-400/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Time"
              />
              <input
                type="text"
                value={editedActivity}
                onChange={(e) => setEditedActivity(e.target.value)}
                className="w-full px-3 py-1 text-xs sm:text-sm bg-white/10 border border-cyan-400/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Activity"
              />
            </div>
          ) : (
            <>
              <p
                className={`text-xs sm:text-sm font-semibold text-cyan-300 ${task.completed ? "line-through opacity-50" : ""}`}
              >
                {task.time}
              </p>
              <p
                className={`text-sm sm:text-base font-medium text-white ${task.completed ? "line-through opacity-50" : ""}`}
              >
                {task.activity}
              </p>
            </>
          )}
        </div>

        {isEditable && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  className="p-2 bg-emerald-500/30 text-emerald-300 rounded-full hover:bg-emerald-500/50 transition-colors border border-emerald-400/50"
                  title="Save"
                >
                  <Save className="w-3 sm:w-4 h-3 sm:h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCancel}
                  className="p-2 bg-red-500/30 text-red-300 rounded-full hover:bg-red-500/50 transition-colors border border-red-400/50"
                  title="Cancel"
                >
                  <X className="w-3 sm:w-4 h-3 sm:h-4" />
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-blue-500/30 text-blue-300 rounded-full hover:bg-blue-500/50 transition-colors border border-blue-400/50"
                  title="Edit"
                >
                  <Edit2 className="w-3 sm:w-4 h-3 sm:h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRemove}
                  className="p-2 bg-red-500/30 text-red-300 rounded-full hover:bg-red-500/50 transition-colors border border-red-400/50"
                  title="Remove"
                >
                  <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                </motion.button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
