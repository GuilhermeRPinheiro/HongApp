import Swal from 'sweetalert2' 
import { useState } from 'react' 
import { Link, useNavigate } from 'react-router-dom' 
import { useAuth } from '../Contexts/AuthContext' 

function RegisterPage() {
  // Estados locais para armazenar os dados do formulário de registro
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false) // Estado para indicar se o cadastro está em andamento (botão de carregamento)

  const { login } = useAuth() // Obtém a função de login do AuthContext para logar o usuário após o cadastro
  const navigate = useNavigate() // Instancia o hook de navegação para redirecionar o usuário

  // Função `handleSubmit` é chamada quando o formulário é submetido
  const handleSubmit = async (e) => {
    e.preventDefault() // Previne o comportamento padrão do formulário (recarregar a página)
    setLoading(true) // Ativa o estado de carregamento do botão

    // Validação inicial: verifica se todos os campos obrigatórios foram preenchidos
    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      // Exibe um alerta de aviso usando SweetAlert2 se algum campo estiver vazio
      Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Por favor, preencha todos os campos.",
      })
      setLoading(false) // Desativa o carregamento
      return // Interrompe a execução da função
    }

    // Validação: verifica se a senha e a confirmação de senha são iguais
    if (password !== confirmPassword) {
      // Exibe um alerta de erro se as senhas não coincidirem
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "As senhas digitadas não coincidem.",
      })
      setLoading(false) // Desativa o carregamento
      return // Interrompe a execução da função
    }

    try {
      // Primeiro, verifica se o e-mail já está cadastrado no servidor
      const checkResponse = await fetch(`http://localhost:3001/users?email=${email}`)
      const existingUsers = await checkResponse.json()

      // Se já existe um usuário com este e-mail, exibe um erro
      if (existingUsers.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Erro no Cadastro!",
          text: "Este e-mail já está cadastrado. Tente outro ou faça login.",
        })
        setLoading(false) // Desativa o carregamento
        return // Interrompe a execução
      }

      // Se o e-mail não estiver cadastrado, procede com o registro
      const response = await fetch('http://localhost:3001/users', { // Requisição POST para criar um novo usuário
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia os dados do novo usuário, definindo o 'role' como 'user' por padrão
        body: JSON.stringify({ name, email, phone, address, password, role: 'user' }),
      })

      // Verifica se a requisição de cadastro foi bem-sucedida (status 2xx)
      if (response.ok) {
        // Se o cadastro foi bem-sucedido, exibe um alerta de sucesso
        Swal.fire({
          title: "Parabéns!",
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          confirmButtonText: "Ok"
        }).then(async () => {
          // Após o sucesso do cadastro, tenta logar o usuário automaticamente
          const loggedIn = await login(email, password)
          if (loggedIn) {
            navigate('/') // Redireciona para a página inicial se o login for bem-sucedido
          } else {
            navigate('/login') // Redireciona para a página de login se o login automático falhar
          }
        })
      } else {
        // Se a requisição não foi bem-sucedida, exibe um erro genérico de cadastro
        Swal.fire({
          icon: "error",
          title: "Erro no Cadastro!",
          text: "Não foi possível realizar o cadastro. Tente novamente.",
        })
      }
    } catch (err) {
      console.error("Erro no registro:", err) // Loga o erro no console para debug
      // Exibe um alerta de erro de conexão se a requisição falhar
      Swal.fire({
        icon: "error",
        title: "Erro de Conexão!",
        text: "Não foi possível conectar ao servidor. Verifique sua conexão.",
        footer: 'Verifique se o JSON Server está rodando na porta 3001.' // Dica para o usuário
      })
    } finally {
      setLoading(false) // Desativa o estado de carregamento do botão, independentemente do resultado
    }
  }

  return(
    <section className="min-h-screen flex flex-col justify-center items-center bg-[#A62C2C]">
      <div className="w-[53.5rem] flex flex-col">
        {/* Cabeçalho da seção de cadastro */}
        <div className="w-full text-center bg-[#D5351D] p-8 rounded-tl-4xl">
          <h1 className="text-5xl font-['Montserrat']">Cadastre-se e Peça Já!</h1>
        </div>
        
        {/* Formulário de cadastro */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col w-[53.5rem] bg-white h-[45.875rem] items-center gap-6 justify-center rounded-br-4xl">
            {/* Campo Nome Completo */}
            <div>
              <input
                required // Campo obrigatório
                type="text"
                placeholder="NOME COMPLETO"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={name} // O valor do input é controlado pelo estado `name`
                onChange={(e) => setName(e.target.value)} // Atualiza o estado `name` em cada mudança
              />
            </div>
            {/* Campo E-mail */}
            <div>
              <input
                required // Campo obrigatório
                type="email"
                placeholder="E-mail"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={email} // O valor do input é controlado pelo estado `email`
                onChange={(e) => setEmail(e.target.value)} // Atualiza o estado `email` em cada mudança
              />
            </div>
            {/* Campo Telefone */}
            <div>
              <input
                required // Campo obrigatório
                type="tel" // Tipo 'tel' para indicar que é um telefone
                placeholder="Telefone"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={phone} // O valor do input é controlado pelo estado `phone`
                onChange={(e) => setPhone(e.target.value)} // Atualiza o estado `phone` em cada mudança
              />
            </div>
            {/* Campo Endereço */}
            <div>
              <input
                required // Campo obrigatório
                type="text"
                placeholder="Endereço"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={address} // O valor do input é controlado pelo estado `address`
                onChange={(e) => setAddress(e.target.value)} // Atualiza o estado `address` em cada mudança
              />
            </div>
            {/* Campo Senha */}
            <div>
              <input
                required // Campo obrigatório
                type="password" // Tipo 'password' para ocultar os caracteres
                placeholder="Senha"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={password} // O valor do input é controlado pelo estado `password`
                onChange={(e) => setPassword(e.target.value)} // Atualiza o estado `password` em cada mudança
              />
            </div>
            {/* Campo Confirmar Senha */}
            <div>
              <input
                required // Campo obrigatório
                type="password"
                placeholder="Confirmar Senha"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={confirmPassword} // O valor do input é controlado pelo estado `confirmPassword`
                onChange={(e) => setConfirmPassword(e.target.value)} // Atualiza o estado `confirmPassword` em cada mudança
              />
            </div>
            
            {/* Botão de submissão do formulário */}
            <button
              type="submit"
              className="cursor-pointer text-white w-[22.875rem] h-[4.136rem] bg-[#D5351D] rounded-4xl"
              disabled={loading} // Desabilita o botão enquanto o cadastro está em andamento
            >
              <span className="font-extrabold font-['Montserrat'] text-4xl">
                {loading ? 'Cadastrando...' : 'Cadastrar-se'} // Altera o texto do botão durante o carregamento
              </span>
            </button>
            {/* Link para a página de login, caso o usuário já possua uma conta */}
            <div className="flex mt-2 ml-3 gap-1">
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