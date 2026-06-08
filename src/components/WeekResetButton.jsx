export default function WeekResetButton() {
  const handleReset = () => {
    alert('Reset functionality needs re-implementation.');
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
