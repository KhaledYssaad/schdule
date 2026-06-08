import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Save } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { DayProgress } from "./DayProgress";
import { useGetScheduleQuery, useAddActivityMutation } from "../store/apiSlice";


export function DaySchedule({ user, day, isEditable }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newActivity, setNewActivity] = useState("");
  const [newTime, setNewTime] = useState("");

  const { data: schedule } = useGetScheduleQuery(user);
  const [addActivity] = useAddActivityMutation();
  const tasks = (schedule && schedule[day]) || [];

  const handleAdd = () => {
    if (newActivity && newTime && schedule) {
      addActivity({ 
        user, 
        day, 
        activity: newActivity.trim(), 
        time: newTime.trim() 
      });
      
      setNewActivity("");
      setNewTime("");
      setIsAdding(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-white/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-white/20 shadow-2xl hover:shadow-cyan-500/20 transition-all"
    >
      {/* Day Title */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">
          {day}
        </h2>
        {/* Date display requires startDate. If not available, we can skip or pass it as prop. */}
      </div>

      <DayProgress user={user} day={day} />

      <motion.div
        className="space-y-2 sm:space-y-3 mt-6 sm:mt-8 max-h-[70vh] overflow-y-auto pr-2"
        variants={containerVariants}
      >
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ delay: index * 0.04 }}
          >
            <TaskItem
              user={user}
              task={task}
              isEditable={isEditable}
            />
          </motion.div>
        ))}

        {isEditable && (
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white/10 backdrop-blur-md border-2 border-cyan-400/50 rounded-2xl p-4 space-y-3 mt-4"
              >
                <input
                  type="text"
                  placeholder="Activity time (e.g. 09:00 - 10:00)"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Activity name"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl py-2 font-bold flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2 border border-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAdding(true)}
                className="w-full py-4 border-2 border-dashed border-white/30 rounded-2xl text-white/50 font-semibold hover:border-cyan-400/50 hover:text-cyan-300 hover:bg-white/5 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Plus className="w-5 h-5" /> Add New Activity
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
}
