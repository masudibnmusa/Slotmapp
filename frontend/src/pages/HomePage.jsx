import { Link } from 'react-router-dom'
import { Search, Calendar, Shield, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl mb-6">
          <Calendar className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Slot-Map
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
          Classroom Availability Checker and Booking System
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/search" className="btn-primary inline-flex items-center gap-2 text-lg px-6 py-3">
            <Search className="w-5 h-5" />
            Search Classrooms
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/register" className="btn-secondary text-lg px-6 py-3">
            Get Started
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Rooms</h3>
          <p className="text-gray-500 text-sm">
            Find available classrooms by department, day, time, and room type with real-time availability.
          </p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Booking</h3>
          <p className="text-gray-500 text-sm">
            Book classroom slots with one click. View your booking history anytime.
          </p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-warning-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Controls</h3>
          <p className="text-gray-500 text-sm">
            Administrators can manage rooms, view all bookings, and override reservations.
          </p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 pt-8 border-t border-gray-200">
        <p>Developed by Masud</p>
        <p className="mt-1">Originally built in C, now reimagined for the web</p>
      </div>
    </div>
  )
}