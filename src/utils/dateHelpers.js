export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const getCurrentDay = () => {
  const map = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  return map[new Date().getDay()]
}

export const getWeekLabel = () => {
  const now = new Date()
  const start = getWeekRange(now).start
  const end = getWeekRange(now).end
  const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${fmt(start)} – ${fmt(end)}`
}

export const getWeekRange = (date) => {
  const start = new Date(date)
  // Adjust to start on Sunday (0)
  const day = start.getDay()
  start.setDate(start.getDate() - day)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export const getDayDate = (dayName) => {
  const range = getWeekRange(new Date())
  const dayIndex = DAYS.indexOf(dayName)
  const date = new Date(range.start)
  date.setDate(date.getDate() + dayIndex)
  return date
}
