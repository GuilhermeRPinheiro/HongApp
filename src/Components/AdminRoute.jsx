import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
import Swal from 'sweetalert2'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-700">
        Verificando permissões...
      </div>
    )
  }

 
  if (!isAuthenticated) {
    Swal.fire({
      icon: 'error',
      title: 'Acesso Restrito',
      text: 'Você precisa estar logado para acessar esta página.',
      confirmButtonText: 'Ok'
    }).then(() => {
    
      window.location.href = '/login' 
    })
    return null 
  }


  if (!isAdmin()) {
    Swal.fire({
      icon: 'error',
      title: 'Acesso Negado',
      text: 'Você não tem permissão de administrador para acessar esta página.',
      confirmButtonText: 'Entendi'
    }).then(() => {
     
      window.location.href = '/' 
    })
    return null 
  }

  
  return children
}

export default AdminRoute