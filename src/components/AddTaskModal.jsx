import { useState } from "react";
import { useGetScheduleQuery, useAddActivityMutation } from "../store/apiSlice";
import { DAYS } from "../utils/dateHelpers";

export default function AddTaskModal({ isOpen, onClose, user, day }) {
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [doing, setDoing] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const { data: schedule } = useGetScheduleQuery(user, { skip: !user });
  const [addActivity] = useAddActivityMutation();

  if (!isOpen) return null;

  // Ensure schedule has all days initialized
  const safeSchedule = schedule || Object.fromEntries(DAYS.map((d) => [d, []]));

  // Check if time is occupied
  const isTimeOccupied = (from, to) => {
    const tasks = safeSchedule[day] || [];
    return tasks.some((task) => {
      const [tFrom, tTo] = task.time.split(" - ");
      return from < tTo && to > tFrom;
    });
  };

  const handleSubmit = async () => {
    if (!activity.trim() || !fromTime.trim() || !toTime.trim()) return;
    if (fromTime >= toTime) {
      alert("Start time must be before end time");
      return;
    }
    if (isTimeOccupied(fromTime, toTime)) {
      alert("This time slot is already occupied");
      return;
    }

    try {
      const result = await addActivity({
        user,
        day,
        activity: activity.trim(),
        description: description.trim(),
        doing: doing.trim(),
        time: `${fromTime} - ${toTime}`,
      }).unwrap();

      if (result) {
        onClose();
      }
    } catch (err) {
      alert(`Failed to add task: ${err}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl shadow-xl w-96 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Add Task to {day}</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="w-full p-2 border rounded bg-slate-900 text-white border-slate-700"
          />
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="w-full p-2 border rounded bg-slate-900 text-white border-slate-700"
          />
        </div>
        <textarea
          placeholder="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-slate-900 text-white border-slate-700 min-h-20"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-slate-900 text-white border-slate-700 min-h-17.5"
        />
        <input
          type="text"
          placeholder="Doing"
          value={doing}
          onChange={(e) => setDoing(e.target.value)}
          className="w-full p-2 mb-4 border rounded bg-slate-900 text-white border-slate-700"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-slate-400">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-white text-slate-900 rounded font-bold"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
