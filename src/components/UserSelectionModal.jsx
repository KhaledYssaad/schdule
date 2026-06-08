import { useDispatch } from 'react-redux'
import { setCurrentUser, setIsUserSelected, USERS } from '../store/scheduleSlice'

export default function UserSelectionModal() {
  const dispatch = useDispatch()

  const handleSelect = (user) => {
    dispatch(setCurrentUser(user))
    dispatch(setIsUserSelected(true))
  }

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome! Who are you?</h2>
        <div className="flex flex-col gap-4">
          {USERS.map(user => (
            <button
              key={user}
              onClick={() => handleSelect(user)}
              className="bg-slate-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 capitalize"
            >
              {user}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
