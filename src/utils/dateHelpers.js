export const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

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
  start.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1))
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}
