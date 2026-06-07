const VALID_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

export const validateScheduleJSON = (raw) => {
  let parsed
  try {
    parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    return { ok: false, error: 'Invalid JSON — could not parse.' }
  }

  if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null)
    return { ok: false, error: 'JSON must be an object with day keys.' }

  for (const day of Object.keys(parsed)) {
    if (!VALID_DAYS.includes(day))
      return { ok: false, error: `Unknown day: "${day}". Use full English day names.` }
    if (!Array.isArray(parsed[day]))
      return { ok: false, error: `"${day}" must be an array of task objects.` }
    for (const [i, task] of parsed[day].entries()) {
      if (typeof task !== 'object' || task === null)
        return { ok: false, error: `Task at ${day}[${i}] must be an object.` }
      if (typeof task.activity !== 'string' || task.activity.trim() === '')
        return { ok: false, error: `Task at ${day}[${i}] is missing a non-empty "activity" string.` }
      if (typeof task.time !== 'string' || task.time.trim() === '')
        return { ok: false, error: `Task at ${day}[${i}] is missing a non-empty "time" string.` }
    }
  }

  return { ok: true, data: parsed }
}
