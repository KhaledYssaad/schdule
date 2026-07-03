import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, Trash2, X, Save, Clock } from "lucide-react";
import {
  useToggleActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} from "../store/apiSlice";

export default function TaskItem({ user, task, isReadOnly }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activity, setActivity] = useState(task.activity);
  const [description, setDescription] = useState(task.description || "");
  const [doing, setDoing] = useState(task.doing || "");
  const [time, setTime] = useState(task.time);

  const [toggleActivity] = useToggleActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();

  const handleToggle = async () => {
    if (isReadOnly) return;
    try {
      await toggleActivity({
        user,
        id: task.id,
        done: !task.completed,
      }).unwrap();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const handleSave = async () => {
    try {
      await updateActivity({
        user,
        id: task.id,
        activity,
        description,
        doing,
        time,
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      alert(`Failed to update task: ${err}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteActivity({ user, id: task.id }).unwrap();
    } catch (err) {
      alert(`Failed to delete task: ${err}`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative mb-3 overflow-hidden rounded-2xl border transition-all duration-300 ${
        task.completed
          ? "border-white/5 bg-white/5"
          : "border-white/10 bg-white/10 backdrop-blur-md hover:border-cyan-500/50 hover:bg-white/15"
      }`}
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-3"
          >
            <div className="flex gap-2">
              <div className="relative grow">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Time (e.g. 09:00 - 10:00)"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
            <textarea
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Activity title"
              rows={2}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={2}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
            />
            <input
              value={doing}
              onChange={(e) => setDoing(e.target.value)}
              placeholder="Doing"
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setActivity(task.activity);
                  setDescription(task.description || "");
                  setDoing(task.doing || "");
                  setTime(task.time);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-4 py-1.5 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg text-xs text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-4 p-4"
          >
            {/* Custom Checkbox */}
            <button
              onClick={handleToggle}
              disabled={isReadOnly}
              className={`mt-1 relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                task.completed
                  ? "border-cyan-500 bg-cyan-500 shadow-lg shadow-cyan-500/50"
                  : "border-white/20 hover:border-cyan-400/50"
              } ${isReadOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <AnimatePresence>
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -45 }}
                  >
                    <Check className="h-4 w-4 text-white stroke-[3px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Task Content */}
            <div className="grow min-w-0 pt-0.5">
              <div className="flex items-center gap-2 mb-1">
                <Clock
                  className={`w-3.5 h-3.5 ${task.completed ? "text-slate-500" : "text-cyan-400/70"}`}
                />
                <span
                  className={`text-xs font-mono font-medium tracking-tight ${
                    task.completed ? "text-slate-500" : "text-cyan-300"
                  }`}
                >
                  {task.time}
                </span>
              </div>
              <p
                className={`text-sm leading-relaxed transition-all duration-500 ${
                  task.completed
                    ? "line-through text-slate-500 decoration-slate-600"
                    : "text-slate-100"
                }`}
              >
                {task.activity}
              </p>
              {task.description && (
                <p
                  className={`mt-1 text-xs leading-relaxed transition-all duration-500 ${
                    task.completed ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {task.description}
                </p>
              )}
              {task.doing && (
                <p
                  className={`mt-1 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-500 ${
                    task.completed ? "text-slate-600" : "text-cyan-300/80"
                  }`}
                >
                  {task.doing}
                </p>
              )}
            </div>

            {/* Actions */}
            {!isReadOnly && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setDescription(task.description || "");
                    setDoing(task.doing || "");
                    setIsEditing(true);
                  }}
                  className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"
                  title="Edit task"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
