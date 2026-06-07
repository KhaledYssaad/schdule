import { useState } from 'react'
import useScheduleStore, { USERS } from '../store/scheduleStore'
import { DAYS, getCurrentDay } from '../utils/dateHelpers'
import DayColumn from './DayColumn'
import AddTaskModal from './AddTaskModal'

export default function ScheduleBoard() {
  const [modal, setModal] = useState({ isOpen: false, day: null })
  const [activeDay, setActiveDay] = useState(getCurrentDay())
  const [activeUser, setActiveUser] = useState(USERS[0])
  const currentUser = useScheduleStore(s => s.currentUser)
  const schedules = useScheduleStore(s => s.schedules)
  
  const openModal = (day) => setModal({ isOpen: true, day })
  const closeModal = () => setModal({ isOpen: false, day: null })

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
      {/* User Tabs */}
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
            {user}
          </button>
        ))}
      </div>

      {/* Day Tabs */}
      <nav className="flex gap-2 mb-6 border-b border-slate-700 pb-2 overflow-x-auto">
        {DAYS.map(day => (
          <button 
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
              activeDay === day 
                ? 'bg-white text-slate-900' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {day}
          </button>
        ))}
      </nav>

      <div className="space-y-6">
        <DayColumn 
          user={activeUser} 
          day={activeDay} 
          tasks={schedules[activeUser][activeDay]} 
          isToday={false} 
          onAddTask={currentUser === activeUser ? openModal : null}
          isReadOnly={currentUser !== activeUser}
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
