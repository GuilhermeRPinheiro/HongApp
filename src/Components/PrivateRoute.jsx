// src/components/PrivateRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext' 

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

 
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-700">
        Carregando...
      </div>
    )
  }

  
  return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute