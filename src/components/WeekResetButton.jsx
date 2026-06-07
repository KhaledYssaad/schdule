import useScheduleStore from '../store/scheduleStore'
import { getWeekLabel } from '../utils/dateHelpers'

export default function WeekResetButton() {
  const resetWeek = useScheduleStore(s => s.resetWeek)

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the week? This will save the current state to history and clear both schedules.')) {
      resetWeek(getWeekLabel())
    }
  }

  return (
    <button 
      onClick={handleReset}
      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
    >
      Reset Week
    </button>
  )
}
