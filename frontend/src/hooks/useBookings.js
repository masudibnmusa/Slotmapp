import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

export function useBookings() {
  const { api } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchRooms = useCallback(async (filters) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.department) params.append('department', filters.department)
      if (filters.day !== undefined) params.append('day', filters.day)
      if (filters.hour !== undefined) params.append('hour', filters.hour)
      if (filters.type) params.append('type', filters.type)
      
      const response = await api.get(`/rooms?${params.toString()}`)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to search rooms')
      throw err
    } finally {
      setLoading(false)
    }
  }, [api])

  const bookSlot = useCallback(async (bookingData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to book slot'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [api])

  const cancelBooking = useCallback(async (roomId, day, hour) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.delete(`/bookings/${roomId}?day=${day}&hour=${hour}`)
      return response.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to cancel booking'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [api])

  const getMyBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/bookings/me')
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch bookings')
      throw err
    } finally {
      setLoading(false)
    }
  }, [api])

  const getAllBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/bookings')
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch bookings')
      throw err
    } finally {
      setLoading(false)
    }
  }, [api])

  const addClassroom = useCallback(async (roomData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/rooms', roomData)
      return response.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add classroom'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [api])

  return {
    searchRooms,
    bookSlot,
    cancelBooking,
    getMyBookings,
    getAllBookings,
    addClassroom,
    loading,
    error,
    setError,
  }
}