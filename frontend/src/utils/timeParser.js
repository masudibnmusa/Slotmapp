export function parseAmpm(input) {
  if (!input || typeof input !== 'string') return null
  
  const cleaned = input.replace(/\s+/g, '').toUpperCase().trim()
  const match = cleaned.match(/^(\d{1,2})(AM|PM)$/)
  if (!match) return null
  
  let hour = parseInt(match[1], 10)
  const period = match[2]
  
  if (hour < 1 || hour > 12) return null
  
  if (period === 'AM') {
    return hour === 12 ? 0 : hour
  } else {
    return hour === 12 ? 12 : hour + 12
  }
}

export function hourToAmpm(hour24) {
  if (hour24 === 0) return '12AM'
  if (hour24 < 12) return `${hour24}AM`
  if (hour24 === 12) return '12PM'
  return `${hour24 - 12}PM`
}

export function validateRoomId(id) {
  if (id < 101 || id > 999) return false
  const floor = Math.floor(id / 100)
  const room = id % 100
  return floor >= 1 && floor <= 9 && room >= 1 && room <= 99
}

export function dayNameToIndex(dayName) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const idx = days.findIndex(d => d.toLowerCase() === dayName.toLowerCase())
  return idx
}

export function dayIndexToName(index) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  if (index >= 0 && index < 7) return days[index]
  return null
}

export function validateRoomType(type) {
  const lower = type.toLowerCase().trim()
  return lower === 'lab' || lower === 'general'
}

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function generateTimeOptions() {
  const options = []
  for (let h = 0; h < 24; h++) {
    options.push({
      value: h,
      label: hourToAmpm(h)
    })
  }
  return options
}

export function generateHourLabels() {
  return Array.from({ length: 24 }, (_, i) => hourToAmpm(i))
}