import React, { createContext, useState, useContext, useEffect } from 'react'
import Swal from 'sweetalert2';

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Erro ao carregar usuário do localStorage:", error)
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }
    loadUserFromLocalStorage()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/users')
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários.')
      }
      const users = await response.json()
      const foundUser = users.find(u => u.email === email && u.password === password)

      if (foundUser) {
        setUser(foundUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(foundUser))
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Bem-vindo, ${foundUser.name}!`,
          showConfirmButton: false,
          timer: 1500
        })
        return true
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro de Login',
          text: 'Email ou senha inválidos!'
        })
        return false
      }
    } catch (error) {
      console.error("Erro no login:", error)
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível conectar ao servidor de autenticação.'
      })
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Você foi desconectado.',
      showConfirmButton: false,
      timer: 1500
    })
  }

  const isAdmin = () => {
    return user && user.role === 'admin'
  }

 
  const updateUser = (updatedUserData) => {
    setUser(prevUser => {
      const newUserState = { ...prevUser, ...updatedUserData }
      localStorage.setItem('user', JSON.stringify(newUserState))
      return newUserState
    })
  }

  
  if (loading) {
    return <div></div>
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isAdmin, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}