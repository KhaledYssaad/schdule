import useScheduleStore, { USERS } from '../store/scheduleStore'

export default function UserSwitcher() {
  const currentUser = useScheduleStore(s => s.currentUser)
  const setCurrentUser = useScheduleStore(s => s.setCurrentUser)

  return (
    <div className="flex bg-slate-100 rounded-lg p-1">
      {USERS.map(user => (
        <button 
          key={user}
          onClick={() => setCurrentUser(user)}
          className={`px-4 py-1 rounded-md capitalize ${currentUser === user ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          {user}
        </button>
      ))}
    </div>
  )
}
