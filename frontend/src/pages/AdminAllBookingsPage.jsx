import { useEffect, useState } from 'react'
import { useBookings } from '../hooks/useBookings'
import BookingList from '../components/BookingList'
import { Loader2, Shield } from 'lucide-react'

export default function AdminAllBookingsPage() {
  const { getAllBookings } = useBookings()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const data = await getAllBookings()
      setBookings(data)
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="ml-3 text-gray-600">Loading all bookings...</span>
      </div>
    )
  }

  return (
    <BookingList
      bookings={bookings}
      title="All System Bookings"
      isAdminView={true}
      onRefresh={fetchBookings}
    />
  )
}