import { useState } from 'react'
import { useGetScheduleQuery, useUpdateScheduleMutation } from '../store/apiSlice'

export default function TaskItem({ user, day, task, isReadOnly }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activity, setActivity] = useState(task.activity)
  const [time, setTime] = useState(task.time)
  
  const { data: schedule } = useGetScheduleQuery(user)
  const [updateSchedule] = useUpdateScheduleMutation()

  const handleUpdate = (updates) => {
    if (!schedule) return
    const updatedSchedule = { ...schedule }
    updatedSchedule[day] = updatedSchedule[day].map(t => 
      t.id === task.id ? { ...t, ...updates } : t
    )
    updateSchedule({ user, data: updatedSchedule })
  }

  const handleSave = () => {
    handleUpdate({ activity, time })
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
    <div className={`flex items-center gap-3 p-3 border-b border-slate-700 last:border-0 hover:bg-slate-700 ${isReadOnly ? 'opacity-50' : ''}`}>
      <input 
        type="checkbox" 
        checked={task.completed}
        onChange={() => handleUpdate({ completed: !task.completed })}
        className="h-5 w-5 cursor-pointer accent-white"
        disabled={isReadOnly}
      />
      <div className={`flex-grow ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
        <span className="text-xs font-mono text-slate-400 mr-2">{task.time}</span>
        <span className="text-sm">{task.activity}</span>
      </div>
      {!isReadOnly && (
        <>
          <button onClick={() => setIsEditing(true)} className="text-xs text-slate-500 hover:text-white">Edit</button>
          <button onClick={() => {
            if (!schedule) return
            const updatedSchedule = { ...schedule }
            updatedSchedule[day] = updatedSchedule[day].filter(t => t.id !== task.id)
            updateSchedule({ user, data: updatedSchedule })
          }} className="text-xs text-red-500 hover:text-red-300">Delete</button>
        </>
      )}
    </div>
  )
}
