// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../Contexts/AuthContext'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import Footer from '../Components/Footer'

function Admin() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [pratos, setPratos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users')
      if (!response.ok) throw new Error(`Erro ao carregar usuários: ${response.status} ${response.statusText}`)
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      console.error("Erro ao buscar usuários:", err)
      setError("Não foi possível carregar a lista de usuários.")
    }
  }

  const fetchPratos = async () => {
    try {
      const response = await fetch('http://localhost:3000/pratos')
      if (!response.ok) throw new Error(`Erro ao carregar pratos: ${response.status} ${response.statusText}`)
      const data = await response.json()
      const pratosAjustados = data.map(p => ({
        ...p,
        preco: parseFloat(p.preco) || 0,
        category: p.category || 'Não Especificado'
      }))
      setPratos(pratosAjustados)
    } catch (err) {
      console.error("Erro ao buscar pratos:", err)
      setError("Não foi possível carregar a lista de pratos.")
    }
  }

  const deleteUser = async (userId, userName) => {
    Swal.fire({
      title: `Tem certeza que quer deletar ${userName}?`,
      text: "Esta ação não pode ser desfeita!",
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!', cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/users/${userId}`, { method: 'DELETE' })
          if (!response.ok) throw new Error(`Erro ao deletar usuário: ${response.status} ${response.statusText}`)
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
          Swal.fire('Deletado!', `O usuário ${userName} foi deletado com sucesso.`, 'success')
        } catch (err) {
          console.error("Erro ao deletar usuário:", err)
          Swal.fire('Erro!', `Não foi possível deletar o usuário ${userName}. ${err.message}`, 'error')
        }
      }
    })
  }

  const deletePrato = async (pratoId, pratoNome) => {
    Swal.fire({
      title: `Tem certeza que quer deletar ${pratoNome}?`,
      text: "Esta ação não pode ser desfeita!",
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!', cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/pratos/${pratoId}`, { method: 'DELETE' })
          if (!response.ok) throw new Error(`Erro ao deletar prato: ${response.status} ${response.statusText}`)
          setPratos(prevPratos => prevPratos.filter(prato => prato.id !== pratoId))
          Swal.fire('Deletado!', `O prato ${pratoNome} foi deletado com sucesso.`, 'success')
        } catch (err) {
          console.error("Erro ao deletar prato:", err)
          Swal.fire('Erro!', `Não foi possível deletar o prato ${pratoNome}. ${err.message}`, 'error')
        }
      }
    })
  }

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      Promise.all([fetchUsers(), fetchPratos()])
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, isAdmin])

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white text-2xl">Carregando dados de administração...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-2xl">{error}</div>
  }

  if (!isAuthenticated || !isAdmin()) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-2xl">Acesso Negado: Você não tem permissão de administrador.</div>
  }

  return (
    <>
      <div className="pt-10 p-5 flex flex-col items-center min-h-screen bg-transparent text-white">

        {/* Gerenciar Usuários */}
        <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Gerenciar Usuários</h2>
        {users.length === 0 ? (
          <div className="text-xl text-gray-400">Nenhum usuário cadastrado.</div>
        ) : (
          <div className="w-full max-w-3xl  bg-[#A62C2C] rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center bg-[#EB2E2E]  p-4 font-bold text-lg">
              <span className="w-1/4">ID</span>
              <span className="w-1/4">Nome</span>
              <span className="w-1/4">Email</span>
              <span className="w-1/4 text-center">Ações</span>
            </div>
            {users.map(userItem => (
              <div key={userItem.id} className="flex justify-between items-center p-4 last:border-b-0">
                <span className="w-1/4 text-sm break-words pr-2">{userItem.id}</span>
                <span className="w-1/4 text-base break-words pr-2">{userItem.name}</span>
                <span className="w-1/4 text-base break-words pr-2">{userItem.email}</span>
                <div className="w-1/4 flex justify-center">
                  <button
                    onClick={() => deleteUser(userItem.id, userItem.name)}
                    className="bg-[#f16c1d] hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gerenciar Pratos com Botão Criar */}
        <div className="flex justify-between items-center w-full max-w-5xl mt-16 mb-8">
          <h2 className="text-5xl font-bold font-['Montserrat'] uppercase text-white">Gerenciar Pratos</h2>
          <Link
            to="/criarprato"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Criar Novo Prato
          </Link>
        </div>

        {pratos.length === 0 ? (
          <div className="text-xl text-gray-400">Nenhum prato cadastrado.</div>
        ) : (
          <div className="w-full max-w-5xl rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-[#EB2E2E] p-4 font-bold text-lg">
              <span className="w-[10%]"></span>
              <span className="w-1/4">Nome</span>
              <span className="w-1/5">Categoria</span>
              <span className="w-[15%]">Preço</span>
              <span className="w-1/4 text-center">Ações</span>
            </div>
            {pratos.map(prato => (
              <div key={prato.id} className="flex items-center p-4 border-b last:border-b-0">
                <div className="w-[10%] flex justify-center items-center">
                  <img src={prato.imagem} alt={prato.nome} className="w-16 h-16 object-cover rounded-md" />
                </div>
                <span className="w-1/4 text-base break-words pr-2">{prato.nome}</span>
                <span className="w-1/5 text-base break-words pr-2">{prato.category}</span>
                <span className="w-[15%] text-base break-words pr-2">
                  R$ {prato.preco !== undefined && prato.preco !== null ? prato.preco.toFixed(2) : '0.00'}
                </span>
                <div className="w-1/4 flex justify-center space-x-2">
                  <button
                    onClick={() => deletePrato(prato.id, prato.nome)}
                    className="bg-[#f16c1d] hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Admin
