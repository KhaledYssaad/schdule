import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCurrentUser, setIsUserSelected } from "../store/scheduleSlice";

export default function UserSelect() {
  const dispatch = useDispatch();

  const handleSelect = (user) => {
    dispatch(setCurrentUser(user));
    dispatch(setIsUserSelected(true));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ float: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-20 right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ float: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute bottom-20 left-20 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="text-center relative z-10">
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8 sm:mb-12"
        >
          <Heart
            className="w-14 sm:w-16 h-14 sm:h-16 text-cyan-300 mx-auto"
            fill="currentColor"
          />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2 sm:mb-4">
          Shared Moments
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 sm:mb-12">
          Your collaborative weekly planner
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12 max-w-2xl mx-auto">
          {["Lilia", "Abdellah"].map((user) => (
            <motion.button
              key={user}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(user)}
              className="bg-gradient-to-br from-white/10 to-cyan-500/10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 border-2 border-white/20 hover:border-cyan-300/50 p-6 sm:p-8 transition-all duration-300"
            >
              <motion.div
                className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/50"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {user[0]}
                </span>
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                {user}
              </h2>
              <p className="text-cyan-300 mt-2 text-xs sm:text-sm">
                Click to continue
              </p>
            </motion.button>
          ))}
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-8 sm:mt-12 text-gray-400 text-xs sm:text-sm"
        >
          Your schedules are synced and ready to go ✨
        </motion.p>
      </div>
    </motion.div>
  );
}
