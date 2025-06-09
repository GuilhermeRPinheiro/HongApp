import Swal from 'sweetalert2' 
import { useState } from 'react' 
import { Link, useNavigate } from 'react-router-dom' 
import { useAuth } from '../Contexts/AuthContext.jsx' 

function LoginPage() {
  // Estados locais para armazenar o email e a senha digitados pelo usuário
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Desestrutura o hook useAuth para obter a função de login e o estado de carregamento
  const { login, loading } = useAuth()
  const navigate = useNavigate() // Instancia o hook de navegação para redirecionar o usuário após o login

  // Função `handleSubmit` é chamada quando o formulário é submetido
  const handleSubmit = async (event) => {
    event.preventDefault() // Previne o comportamento padrão do formulário (recarregar a página)

    // Validação inicial: verifica se ambos os campos (email e senha) foram preenchidos
    if (!email || !password) {
      // Exibe um alerta de aviso usando SweetAlert2 se algum campo estiver vazio
      Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Por favor, preencha todos os campos.",
      })
      return // Interrompe a execução da função
    }

    // Tenta realizar o login usando a função `login` do AuthContext
    // `success` será true se o login for bem-sucedido, false caso contrário
    const success = await login(email, password)

    // Verifica o resultado do login
    if (success) {
      // Se o login foi bem-sucedido, exibe um alerta de sucesso
      Swal.fire({
        title: "Sucesso!",
        text: "Login efetuado com sucesso!",
        icon: "success",
        confirmButtonText: "Ok"
      }).then(() => {
        // Após o usuário clicar em "Ok", redireciona para a página inicial
        navigate('/')
      })
    } else {
      // Se o login falhou, exibe um alerta de erro
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "E-mail ou senha inválidos. Tente novamente.",
        // Adiciona um link para a página de cadastro no rodapé do alerta
        footer: '<a href="/register">Não tem uma conta? Cadastre-se!</a>'
      })
    }
  }

  // Renderiza a estrutura da página de login
  return (
    <section className="mt-28 flex flex-col justify-center items-center">
      <div className="w-[52.5rem] flex flex-col">
        {/* Cabeçalho da seção de login */}
        <div className="w-full text-center bg-[#D5351D] p-8 rounded-tl-4xl">
          <h1 className="text-5xl font-['Montserrat']">Bem-vindo de volta!</h1>
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col w-[52.5rem] bg-white h-[26.875rem] items-center gap-6 justify-center rounded-br-4xl">

            {/* Campo de input para o E-mail */}
            <div>
              <input
                required // Campo obrigatório
                type="email" // Tipo de input para email, com validação básica de formato
                placeholder="E-mail"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={email} // O valor do input é controlado pelo estado `email`
                onChange={(e) => setEmail(e.target.value)} // Atualiza o estado `email` em cada mudança
              />
            </div>
            {/* Campo de input para a Senha */}
            <div>
              <input
                required // Campo obrigatório
                type="password" // Tipo de input para senha (oculta os caracteres)
                placeholder="Senha"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={password} // O valor do input é controlado pelo estado `password`
                onChange={(e) => setPassword(e.target.value)} // Atualiza o estado `password` em cada mudança
              />
              {/* Link para a página de cadastro, caso o usuário não possua uma conta */}
              <div className="flex mt-2 ml-3 gap-1">
                <span className="text-black">Não possui cadastro? </span>
                <Link to="/register" className="font-extrabold text-black">
                  Cadastre-se!
                </Link>
              </div>
            </div>

            {/* Botão de submissão do formulário */}
            <button
              type="submit"
              className="cursor-pointer text-white w-[22.875rem] h-[4.136rem] bg-[#D5351D] rounded-4xl"
              disabled={loading} // Desabilita o botão enquanto o login está em andamento (`loading` é true)
            >
              <span className="font-extrabold font-['Montserrat'] text-4xl">
                {/* Exibe "Entrando..." quando `loading` é true, senão exibe "Login" */}
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