import { useState } from 'react'
import SearchForm from '../components/SearchForm'
import SearchResults from '../components/SearchResults'
import { useBookings } from '../hooks/useBookings'

export default function SearchPage() {
  const { searchRooms, loading } = useBookings()
  const [results, setResults] = useState(null)
  const [searchParams, setSearchParams] = useState(null)

  const handleSearch = async (params) => {
    setSearchParams(params)
    try {
      const data = await searchRooms(params)
      setResults(data)
    } catch {
      setResults([])
    }
  }

  return (
    <div className="space-y-6">
      <SearchForm onSearch={handleSearch} loading={loading} />
      <SearchResults 
        results={results} 
        searchParams={searchParams} 
        loading={loading} 
      />
    </div>
  )
}