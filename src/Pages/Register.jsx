import React, { useState } from 'react' 
import { Link, useNavigate } from 'react-router-dom' 
import Swal from 'sweetalert2' 
import { useAuth } from '../Contexts/AuthContext' 

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false) 
  const { login } = useAuth() 
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true) 
    
  
    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Por favor, preencha todos os campos.",
      })
      setLoading(false) 
      return
    }


    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "As senhas digitadas não coincidem.",
      })
      setLoading(false) 
      return
    }

    try {
    
      const checkResponse = await fetch(`http://localhost:3001/users?email=${email}`)
      const existingUsers = await checkResponse.json()

      if (existingUsers.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Erro no Cadastro!",
          text: "Este e-mail já está cadastrado. Tente outro ou faça login.",
        })
        setLoading(false)
        return
      }

    
      const response = await fetch('http://localhost:3001/users', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      
        body: JSON.stringify({ name, email, phone, address, password, role: 'user' }), 
      })

      if (response.ok) {
        Swal.fire({
          title: "Parabéns!",
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          confirmButtonText: "Ok"
        }).then(async () => {
          
          const loggedIn = await login(email, password)
          if (loggedIn) {
            navigate('/') 
          } else {
            navigate('/login') 
          }
        })
      } else {
       
        Swal.fire({
          icon: "error",
          title: "Erro no Cadastro!",
          text: "Não foi possível realizar o cadastro. Tente novamente.",
        })
      }
    } catch (err) {
      console.error("Erro no registro:", err)
    
      Swal.fire({
        icon: "error",
        title: "Erro de Conexão!",
        text: "Não foi possível conectar ao servidor. Verifique sua conexão.",
        footer: 'Verifique se o JSON Server está rodando na porta 3001.'
      })
    } finally {
      setLoading(false) 
    }
  }

  return(
    <section className="min-h-screen flex flex-col justify-center items-center bg-[#A62C2C]">
      <div className="w-[53.5rem] flex flex-col">
        <div className="w-full text-center bg-[#D5351D] p-8 rounded-tl-4xl">
          <h1 className="text-5xl font-['Montserrat']">Cadastre-se e Peça Já!</h1>
        </div>
        
     
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col w-[52.5rem] bg-white h-[45.875rem] items-center gap-6 justify-center rounded-br-4xl ">
            <div>
              <input
                required
                type="text"
                placeholder="NOME COMPLETO"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={name}
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div>
              <input
                required
                type="email"
                placeholder="E-mail"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                required
                type="tel" 
                placeholder="Telefone"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
            <div>
              <input
                required
                type="text"
                placeholder="Endereço"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={address}
                onChange={(e) => setAddress(e.target.value)} 
              />
            </div>
            <div>
              <input
                required
                type="password"
                placeholder="Senha"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div>
              <input
                required
                type="password"
                placeholder="Confirmar Senha"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
            
            <button
              type="submit"
              className="cursor-pointer text-white w-[22.875rem] h-[4.136rem] bg-[#D5351D] rounded-4xl"
              disabled={loading}
            >
              <span className="font-extrabold font-['Montserrat'] text-4xl">
                {loading ? 'Cadastrando...' : 'Cadastrar-se'} 
              </span>
            </button>
            <div className="flex mt-2 ml-3 gap-1 ">
              <span className="text-black">Já possui cadastro? </span>
              <Link to="/login" className="font-extrabold text-black">
                Faça login!
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default RegisterPage