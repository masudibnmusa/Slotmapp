import { useState } from 'react'
import { Search, Building2, Clock, CalendarDays, Filter } from 'lucide-react'
import { DAYS, parseAmpm } from '../utils/timeParser.jsx'

export default function SearchForm({ onSearch, loading }) {
  const [department, setDepartment] = useState('')
  const [day, setDay] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [type, setType] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!department.trim()) {
      newErrors.department = 'Department is required'
    }
    
    if (!day) {
      newErrors.day = 'Day is required'
    }
    
    if (!timeInput.trim()) {
      newErrors.time = 'Time is required'
    } else {
      const hour = parseAmpm(timeInput)
      if (hour === null) {
        newErrors.time = 'Invalid time format. Use 9AM, 2 PM, 12AM'
      }
    }
    
    if (!type) {
      newErrors.type = 'Room type is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    
    onSearch({
      department: department.trim().toUpperCase(),
      day,
      hour: parseAmpm(timeInput),
      type: type.toLowerCase(),
    })
  }

  const handleTimeBlur = () => {
    if (timeInput && parseAmpm(timeInput) === null) {
      setErrors(prev => ({ ...prev, time: 'Invalid format. Use 9AM, 2 PM, 12AM' }))
    } else {
      setErrors(prev => { const { time, ...rest } = prev; return rest })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900">Search Classrooms</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-gray-400" />
              Department
            </span>
          </label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="CSE, EEE, ..."
            className={`input-field ${errors.department ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
          />
          {errors.department && (
            <p className="mt-1 text-xs text-danger-600">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              Day
            </span>
          </label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={`input-field ${errors.day ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
          >
            <option value="">Select day</option>
            {DAYS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.day && (
            <p className="mt-1 text-xs text-danger-600">{errors.day}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              Time
            </span>
          </label>
          <input
            type="text"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            onBlur={handleTimeBlur}
            placeholder="9AM, 2 PM, 12AM"
            className={`input-field ${errors.time ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
          />
          {errors.time && (
            <p className="mt-1 text-xs text-danger-600">{errors.time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-gray-400" />
              Room Type
            </span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`input-field ${errors.type ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
          >
            <option value="">Select type</option>
            <option value="lab">Lab</option>
            <option value="general">General</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-xs text-danger-600">{errors.type}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Searching...' : 'Search Rooms'}
        </button>
      </div>
    </form>
  )
}