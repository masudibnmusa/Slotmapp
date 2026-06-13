import { useState } from 'react'
import { useBookings } from '../hooks/useBookings.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { PlusCircle, Building2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { validateRoomId, validateRoomType } from '../utils/timeParser.jsx'

export default function AdminRoomsPage() {
  const { addClassroom, loading } = useBookings()
  const { user } = useAuth()
  const [id, setId] = useState('')
  const [department, setDepartment] = useState('')
  const [type, setType] = useState('lab')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const roomId = parseInt(id, 10)
    if (!validateRoomId(roomId)) {
      setError('Invalid Room ID. Must be 3 digits (101-999)')
      return false
    }
    if (!department.trim()) {
      setError('Department is required')
      return false
    }
    if (!validateRoomType(type)) {
      setError('Invalid room type')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!validate()) return

    try {
      await addClassroom({
        id: parseInt(id, 10),
        department: department.trim().toUpperCase(),
        type: type.toLowerCase(),
      })
      setSuccess(true)
      setId('')
      setDepartment('')
      setType('lab')
    } catch (err) {
      setError(err.message || 'Failed to add classroom')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Add New Classroom</h2>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-success-700">Classroom added successfully!</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Room ID
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="input-field pl-10"
                placeholder="e.g., 101, 202, 303"
                min="101"
                max="999"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              3-digit format: floor (1-9) + room number (01-99)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="input-field"
              placeholder="CSE, EEE, ..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Room Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
              required
            >
              <option value="lab">Lab</option>
              <option value="general">General</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Add Classroom
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}