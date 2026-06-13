import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useBookings } from '../hooks/useBookings'
import { X, BookOpen, CheckCircle, AlertCircle, Building2, MapPin, Clock, CalendarDays } from 'lucide-react'
import { hourToAmpm } from '../utils/timeParser'

export default function BookingModal({ room, searchParams, onClose }) {
  const { isAuthenticated } = useAuth()
  const { bookSlot, loading } = useBookings()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleBook = async () => {
    setError(null)
    try {
      await bookSlot({
        room_id: room.id,
        day: searchParams.day,
        hour: searchParams.hour,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
  }

  const floor = Math.floor(room.id / 100)
  const timeDisplay = hourToAmpm(searchParams.hour)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Confirm Booking
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">Booking Successful!</h4>
              <p className="text-gray-500 text-sm">
                Room {room.id} has been booked for {searchParams.day} at {timeDisplay}
              </p>
              <button
                onClick={onClose}
                className="mt-6 btn-primary w-full"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {!isAuthenticated && (
                <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning-800">Login Required</p>
                    <p className="text-xs text-warning-600 mt-1">
                      You need to be logged in to book a classroom.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Room</p>
                    <p className="font-semibold text-gray-900">{room.id} (Floor {floor})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-semibold text-gray-900">{room.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Day</p>
                    <p className="font-semibold text-gray-900">{searchParams.day}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-900">{timeDisplay}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBook}
                  disabled={!isAuthenticated || loading}
                  className="flex-1 btn-success flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      Confirm Book
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}