import TaskItem from './TaskItem'
import ProgressBar from './ProgressBar'

export default function DayColumn({ user, day, tasks, isToday, onAddTask, isReadOnly }) {
  return (
    <div className={`flex flex-col p-4 w-full bg-slate-800 border rounded-xl shadow-sm ${isToday ? 'border-blue-500' : 'border-slate-700'}`}>
      <h3 className={`font-bold text-lg mb-2 ${isToday ? 'text-blue-400' : 'text-slate-300'}`}>
        {day}
      </h3>
      
      <ProgressBar tasks={tasks} />
      
      <div className="flex-grow overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500 italic text-center py-4">No tasks.</p>
        ) : (
          tasks.map(task => (
            <TaskItem key={task.id} user={user} day={day} task={task} isReadOnly={isReadOnly} />
          ))
        )}
      </div>

      {!isReadOnly && (
        <button 
          onClick={() => onAddTask(day)}
          className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition"
        >
          + Add task
        </button>
      )}
    </div>
  )
}
