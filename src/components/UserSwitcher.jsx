import { useSelector, useDispatch } from 'react-redux'
import { setCurrentUser, USERS } from '../store/scheduleSlice'

export default function UserSwitcher() {
  const currentUser = useSelector(s => s.schedule.currentUser)
  const dispatch = useDispatch()

  return (
    <div className="flex bg-slate-100 rounded-lg p-1">
      {USERS.map(user => (
        <button 
          key={user}
          onClick={() => dispatch(setCurrentUser(user))}
          className={`px-4 py-1 rounded-md capitalize ${currentUser === user ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          {user}
        </button>
      ))}
    </div>
  )
}
