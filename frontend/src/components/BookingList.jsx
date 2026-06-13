import { useState } from 'react'
import { useBookings } from '../hooks/useBookings'
import { useAuth } from '../hooks/useAuth'
import { 
  Calendar, 
  Clock, 
  Building2, 
  MapPin, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Loader2,
  AlertCircle,
  User,
  Shield
} from 'lucide-react'
import { hourToAmpm, dayIndexToName } from '../utils/timeParser'

export default function BookingList({ bookings, title, isAdminView = false, onRefresh }) {
  const { cancelBooking, loading } = useBookings()
  const { user, isAdmin } = useAuth()
  const [cancellingId, setCancellingId] = useState(null)
  const [error, setError] = useState(null)

  const handleCancel = async (booking) => {
    setError(null)
    setCancellingId(booking.id || `${booking.room_id}-${booking.day}-${booking.hour}`)
    
    try {
      await cancelBooking(booking.room_id, booking.day, booking.hour)
      onRefresh?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setCancellingId(null)
    }
  }

  const canCancel = (booking) => {
    if (isAdmin) return true
    return booking.username === user?.username
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="card text-center py-12">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
        <p className="text-gray-500 mt-1">
          {isAdminView 
            ? 'No active bookings in the system' 
            : 'You haven\'t made any bookings yet'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {isAdminView ? <Shield className="w-5 h-5 text-warning-600" /> : <Calendar className="w-5 h-5 text-primary-600" />}
          {title}
        </h2>
        <span className="text-sm text-gray-500">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking, idx) => {
          const id = booking.id || idx
          const isCancelling = cancellingId === id || cancellingId === `${booking.room_id}-${booking.day}-${booking.hour}`
          const dayName = typeof booking.day === 'number' ? dayIndexToName(booking.day) : booking.day
          const timeDisplay = hourToAmpm(booking.hour)
          const floor = Math.floor(booking.room_id / 100)
          const showCancel = canCancel(booking)

          return (
            <div 
              key={id} 
              className="card p-5 border-l-4 border-l-primary-500 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Room {booking.room_id}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Floor {floor}
                    </p>
                  </div>
                </div>
                <span className="badge badge-success">Active</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Day:</span>
                  <span className="font-medium text-gray-900">{dayName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium text-gray-900">{timeDisplay}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Department:</span>
                  <span className="font-medium text-gray-900">{booking.department || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Booked by:</span>
                  <span className="font-medium text-gray-900">{booking.username || booking.user?.username || 'Unknown'}</span>
                  {booking.username !== user?.username && isAdmin && (
                    <span className="badge badge-warning text-xs">Other user</span>
                  )}
                </div>
              </div>

              {showCancel && (
                <button
                  onClick={() => handleCancel(booking)}
                  disabled={isCancelling}
                  className="w-full btn-danger flex items-center justify-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Cancel Booking
                    </>
                  )}
                </button>
              )}

              {!showCancel && (
                <div className="w-full py-2 px-4 bg-gray-100 text-gray-400 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Cannot cancel (not your booking)
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}