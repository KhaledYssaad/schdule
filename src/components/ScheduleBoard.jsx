import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetScheduleQuery } from '../store/apiSlice'
import { DAYS, getCurrentDay, getDayDate } from '../utils/dateHelpers'
import { USERS } from '../store/scheduleSlice'
import DayColumn from './DayColumn'
import AddTaskModal from './AddTaskModal'

export default function ScheduleBoard() {
  const [modal, setModal] = useState({ isOpen: false, day: null })
  const [activeDay, setActiveDay] = useState(getCurrentDay())
  const [activeUser, setActiveUser] = useState(USERS[0])
  const currentUser = useSelector(s => s.schedule.currentUser)
  
  const { data: schedule, isLoading } = useGetScheduleQuery(activeUser, { skip: !activeUser })
  
  const openModal = (day) => setModal({ isOpen: true, day })
  const closeModal = () => setModal({ isOpen: false, day: null })

  if (isLoading) return <div className="text-white p-4">Loading...</div>
  const displaySchedule = schedule || Object.fromEntries(DAYS.map(d => [d, []]))

  const isPastDay = (dayName) => {
    const dayDate = getDayDate(dayName)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dayDate < today
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex gap-4 mb-6 border-b border-slate-700 pb-2">
        {USERS.map(user => (
          <button 
            key={user}
            onClick={() => setActiveUser(user)}
            className={`px-6 py-2 rounded-t-lg font-bold capitalize ${
              activeUser === user 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {user === currentUser ? 'My Schedule' : `${user}'s Schedule`}
          </button>
        ))}
      </div>
{/* Day Tabs - Always Visible */}
<nav className="flex justify-between gap-1 mb-6 border-b border-slate-700 pb-2 overflow-x-auto">
  {DAYS.map(day => {
    const date = getDayDate(day)
    const isPast = isPastDay(day)
    return (
      <button 
        key={day}
        onClick={() => setActiveDay(day)}
        disabled={isPast}
        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap flex flex-col items-center flex-grow ${
          activeDay === day 
            ? 'bg-white text-slate-900' 
            : isPast ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white'
        }`}
      >
        <span>{day.slice(0, 3)}</span>
        <span className="text-xs">{date.getDate()}</span>
      </button>
    )
  })}
</nav>


      <div className="space-y-6">
        <DayColumn 
          user={activeUser} 
          day={activeDay} 
          tasks={displaySchedule[activeDay] || []} 
          isToday={false} 
          onAddTask={currentUser === activeUser && !isPastDay(activeDay) ? openModal : null}
          isReadOnly={currentUser !== activeUser || isPastDay(activeDay)}
        />
      </div>

      <AddTaskModal 
        isOpen={modal.isOpen} 
        onClose={closeModal} 
        user={currentUser} 
        day={modal.day} 
      />
    </div>
  )
}
