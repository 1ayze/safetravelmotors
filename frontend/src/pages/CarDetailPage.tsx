import React from 'react'
import { useParams } from 'react-router-dom'

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="container py-8">
      <h1 className="heading-1 mb-8">Car Details</h1>
      <p>Car ID: {id}</p>
      <p className="text-gray-600">This page will show detailed information about the selected car.</p>
    </div>
  )
}

export default CarDetailPage
