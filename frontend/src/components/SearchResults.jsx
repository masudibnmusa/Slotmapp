import { useState } from 'react'
import { Building2, MapPin, CheckCircle, XCircle, BookOpen, Loader2 } from 'lucide-react'
import { hourToAmpm } from '../utils/timeParser.jsx'
import BookingModal from './BookingModal.jsx'

export default function SearchResults({ results, searchParams, loading }) {
  const [selectedRoom, setSelectedRoom] = useState(null)

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="ml-3 text-gray-600">Searching classrooms...</span>
      </div>
    )
  }

  if (!results) return null

  if (results.length === 0) {
    return (
      <div className="card text-center py-12">
        <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No rooms found</h3>
        <p className="text-gray-500 mt-1">
          Try adjusting your search criteria
        </p>
      </div>
    )
  }

  const { day, hour, type } = searchParams
  const timeDisplay = hourToAmpm(hour)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Search Results
        </h3>
        <span className="text-sm text-gray-500">
          {results.length} room{results.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((room) => {
          const floor = Math.floor(room.id / 100)
          const isBooked = room.is_booked

          return (
            <div
              key={room.id}
              className={`card p-5 transition-all hover:shadow-md ${
                isBooked ? 'border-l-4 border-l-danger-500' : 'border-l-4 border-l-success-500'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-bold text-gray-900">
                      Room {room.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    Floor {floor}
                  </div>
                </div>
                <span className={`badge ${isBooked ? 'badge-danger' : 'badge-success'}`}>
                  {isBooked ? 'Booked' : 'Available'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium text-gray-900">{room.department}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900 capitalize">{room.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium text-gray-900">{day}, {timeDisplay}</span>
                </div>
                {isBooked && room.booked_by && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Booked by</span>
                    <span className="font-medium text-gray-900">{room.booked_by}</span>
                  </div>
                )}
              </div>

              {!isBooked && (
                <button
                  onClick={() => setSelectedRoom(room)}
                  className="w-full btn-success flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Book This Slot
                </button>
              )}

              {isBooked && (
                <div className="w-full py-2 px-4 bg-gray-100 text-gray-500 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Not Available
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          searchParams={searchParams}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  )
}