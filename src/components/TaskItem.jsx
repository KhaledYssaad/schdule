import { useState } from 'react'
import useScheduleStore from '../store/scheduleStore'
import { DAYS, getCurrentDay } from '../utils/dateHelpers'

export default function TaskItem({ user, day, task, isReadOnly }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activity, setActivity] = useState(task.activity)
  const [time, setTime] = useState(task.time)
  
  const toggleTask = useScheduleStore(s => s.toggleTask)
  const deleteTask = useScheduleStore(s => s.deleteTask)
  const editTask = useScheduleStore(s => s.editTask)

  // Disable past days
  const dayIndex = DAYS.indexOf(day)
  const todayIndex = DAYS.indexOf(getCurrentDay())
  const isPastDay = dayIndex < todayIndex

  const handleSave = () => {
    editTask(user, day, task.id, { activity, time })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-1 p-2 bg-slate-900 rounded border border-slate-600">
        <input 
          value={time} 
          onChange={e => setTime(e.target.value)}
          className="text-xs p-1 border rounded bg-slate-800 text-white border-slate-700"
        />
        <input 
          value={activity} 
          onChange={e => setActivity(e.target.value)}
          className="text-sm p-1 border rounded bg-slate-800 text-white border-slate-700"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={() => setIsEditing(false)} className="text-xs text-slate-400">Cancel</button>
          <button onClick={handleSave} className="text-xs text-white font-bold">Save</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 p-3 border-b border-slate-700 last:border-0 hover:bg-slate-700 ${isPastDay ? 'opacity-50' : ''}`}>
      <input 
        type="checkbox" 
        checked={task.completed}
        onChange={() => toggleTask(user, day, task.id)}
        className="h-5 w-5 cursor-pointer accent-white"
        disabled={isReadOnly || isPastDay}
      />
      <div className={`flex-grow ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
        <span className="text-xs font-mono text-slate-400 mr-2">{task.time}</span>
        <span className="text-sm">{task.activity}</span>
      </div>
      {!isReadOnly && !isPastDay && (
        <>
          <button onClick={() => setIsEditing(true)} className="text-xs text-slate-500 hover:text-white">Edit</button>
          <button onClick={() => deleteTask(user, day, task.id)} className="text-xs text-red-500 hover:text-red-300">Delete</button>
        </>
      )}
    </div>
  )
}
