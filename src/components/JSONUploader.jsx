import { useState } from 'react'
import { validateScheduleJSON } from '../utils/validateScheduleJSON'

export default function JSONUploader() {
  const [input, setInput] = useState('')
  const [user, setUser] = useState('lilia')
  const [status, setStatus] = useState(null)

  const handleImport = () => {
    alert('Import functionality needs re-implementation.');
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Import Schedule</h2>
      <select value={user} onChange={e => setUser(e.target.value)} className="mb-4 p-2 border rounded capitalize">
        <option value="lilia">Lilia</option>
        <option value="abdellah">Abdellah</option>
      </select>
      <textarea 
        value={input} 
        onChange={e => setInput(e.target.value)}
        className="w-full h-40 p-2 border rounded mb-4 font-mono text-sm"
        placeholder='{ "Monday": [{ "time": "09:00", "activity": "..." }] }'
      />
      <button onClick={handleImport} className="bg-blue-600 text-white px-4 py-2 rounded">Import</button>
      {status && (
        <p className={`mt-4 ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {status.message}
        </p>
      )}
    </div>
  )
}
