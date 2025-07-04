import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search teas and coffees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="Search"
        />
      </div>
      <Button type="submit" variant="accent" icon="Search">
        Search
      </Button>
    </form>
  )
}

export default SearchBar