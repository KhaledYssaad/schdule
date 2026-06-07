export default function ProgressBar({ tasks }) {
  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  
  return (
    <div className="mb-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {completed} / {total} tasks completed
      </div>
    </div>
  )
}
