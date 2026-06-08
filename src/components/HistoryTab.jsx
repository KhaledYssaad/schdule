import { useSelector } from 'react-redux';
import { USERS } from '../store/scheduleSlice';

export default function HistoryTab() {
  const history = useSelector(state => state.schedule.history);

  if (history.length === 0) return <p className="p-4 text-gray-500">No history yet.</p>

  return (
    <div className="space-y-4">
      {history.map(entry => (
        <div key={entry.id} className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex justify-between mb-2">
            <h3 className="font-bold">{entry.weekLabel}</h3>
            <span className="text-sm text-gray-500">{new Date(entry.date).toLocaleString()}</span>
          </div>
          <div className="flex gap-4">
            {USERS.map(user => {
              const userSchedule = entry.schedules[user]
              const allTasks = Object.values(userSchedule).flat()
              const completed = allTasks.filter(t => t.completed).length
              return (
                <div key={user} className="text-sm">
                  <span className="capitalize font-bold">{user}</span>: {completed}/{allTasks.length} tasks
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
