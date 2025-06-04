import Swal from 'sweetalert2'
import { useState } from 'react' 
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext.jsx'

function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') 
  const { login, loading } = useAuth() 
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault() 
    setError('') 

    if (!email || !password) {
     
      Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Por favor, preencha todos os campos.",
      })
      return
    }
 
    const success = await login(email, password)

    if (success) {
      
      Swal.fire({
        title: "Sucesso!",
        text: "Login efetuado com sucesso!",
        icon: "success",
        confirmButtonText: "Ok"
      }).then(() => {
       
        navigate('/') 
      })
    } else {
    
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "E-mail ou senha inválidos. Tente novamente.",
        footer: '<a href="/register">Não tem uma conta? Cadastre-se!</a>'
      })
    }
  }

  return(
<<<<<<< HEAD
    <section className="min-h-screen flex flex-col justify-center items-center bg-[#A62C2C]">
=======
    <section className="mt-28 flex flex-col justify-center items-center">
>>>>>>> 02754e380422a6ba3e030bb40cb7bf75249522f6
      <div className="w-[52.5rem] flex flex-col">
        <div className="w-full text-center bg-[#D5351D] p-8 rounded-tl-4xl">
          <h1 className="text-5xl font-['Montserrat']">Bem-vindo de volta!</h1>
        </div>
        
       
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col w-[52.5rem] bg-white h-[26.875rem] items-center gap-6 justify-center rounded-br-4xl ">
           

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
                type="password"
                placeholder="Senha"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <div className="flex mt-2 ml-3 gap-1 ">
                <span className="text-black">Não possui cadastro? </span>
                <Link to="/register" className="font-extrabold text-black">
                  Cadastre-se!
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              className="cursor-pointer text-white w-[22.875rem] h-[4.136rem] bg-[#D5351D] rounded-4xl"
              disabled={loading}
            >
              <span className="font-extrabold font-['Montserrat'] text-4xl">
                {loading ? 'Entrando...' : 'Login'} 
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default LoginPage