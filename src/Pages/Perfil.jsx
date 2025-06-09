import { useState, useEffect } from 'react' 
import { useAuth } from '../Contexts/AuthContext' 
import { useNavigate } from 'react-router-dom' 
import Swal from 'sweetalert2' 

function PerfilPage() {
  // Desestrutura o hook `useAuth` para obter informações do usuário e funções de autenticação
  const { user, isAuthenticated, updateUser } = useAuth()
  const navigate = useNavigate() // Instancia o hook de navegação para redirecionamentos

  // Estados locais para armazenar os dados do formulário do perfil
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') // Estado para a senha (pode ser preenchido, mas não é recomendado armazenar em texto puro em apps reais)
  const [adress, setAdress] = useState('')
  const [profilePicture, setProfilePicture] = useState('') // Estado para a URL da imagem de perfil

  // Estados para controlar o carregamento durante a atualização e o carregamento inicial dos dados
  const [loadingUpdate, setLoadingUpdate] = useState(false) // Indica se a atualização do perfil está em andamento
  const [initialLoadComplete, setInitialLoadComplete] = useState(false) // Sinaliza se a carga inicial dos dados do usuário foi concluída

  // Hook useEffect: Redireciona o usuário para a página de login se não estiver autenticado
  useEffect(() => {
    // Só redireciona se a carga inicial dos dados já tiver sido completada
    if (!isAuthenticated && initialLoadComplete) {
      navigate('/login')
    }
  }, [isAuthenticated, initialLoadComplete, navigate]) // Dependências: re-executa se status de auth, carga inicial ou navigate mudarem

  // Hook useEffect: Carrega os dados do usuário para os estados do formulário
  useEffect(() => {
    // Se o objeto 'user' existe (usuário está logado)
    if (user) {
      // Preenche os estados do formulário com os dados do usuário, usando '' como fallback para evitar undefined
      setNome(user.name || '')
      setEmail(user.email || '')
      setPassword(user.password || '') // Carrega a senha (novamente, em um app real, a senha não seria carregada assim)
      setAdress(user.adress || '')
      setProfilePicture(user.profilePicture || '')
      setInitialLoadComplete(true) // Marca que o carregamento inicial dos dados está completo
    } else if (!isAuthenticated && !initialLoadComplete) {
      // Caso o 'user' seja null (não logado) e a carga inicial ainda não terminou,
      // marca a carga inicial como completa para evitar um loop de redirecionamento antes da verificação de autenticação
      setInitialLoadComplete(true)
    }
  }, [user, isAuthenticated, initialLoadComplete]) // Dependências: re-executa se user, isAuthenticated ou initialLoadComplete mudarem

  // Função para lidar com a alteração da imagem de perfil (simula upload pedindo uma URL)
  const handleImageChange = (e) => {
    const file = e.target.files[0] // Captura o arquivo selecionado (embora o tipo seja URL)
    if (file) {
      // Exibe um modal do SweetAlert2 para que o usuário cole a URL da nova imagem
      Swal.fire({
        title: 'Atualizar Imagem de Perfil',
        input: 'text', // Tipo de input do modal é texto
        inputLabel: 'Cole a URL da nova imagem de perfil:',
        inputPlaceholder: 'Ex: /images/UserX.png ou https://example.com/image.jpg',
        showCancelButton: true, // Mostra o botão de cancelar
        confirmButtonText: 'Salvar Imagem', // Texto do botão de confirmação
        showLoaderOnConfirm: true, // Exibe um loader no botão enquanto a preConfirm está ativa
        preConfirm: (url) => {
          // Validação: verifica se a URL não está vazia
          if (!url) {
            Swal.showValidationMessage('A URL da imagem não pode ser vazia.')
          }
          return url // Retorna a URL inserida
        },
        allowOutsideClick: () => !Swal.isLoading() // Permite fechar clicando fora, exceto durante o carregamento
      }).then((result) => {
        // Se o usuário confirmou e inseriu uma URL
        if (result.isConfirmed) {
          setProfilePicture(result.value) // Atualiza o estado da imagem de perfil com a URL
          // Alerta o usuário que a URL foi salva, mas que precisa salvar o perfil completo
          Swal.fire('Imagem Atualizada!', 'A nova URL da imagem foi salva. Clique em "Salvar Alterações" para aplicar.', 'success')
        }
      })
    }
  }

  // Função `handleSubmit` é chamada quando o formulário de perfil é submetido
  const handleSubmit = async (e) => {
    e.preventDefault() // Previne o comportamento padrão do formulário
    setLoadingUpdate(true) // Ativa o estado de carregamento da atualização

    // Cria um objeto com os dados atualizados do usuário para enviar à API
    const updatedUserData = {
      name: nome,
      email: email,
      password: password, // Inclui a senha no objeto de atualização
      adress: adress,
      profilePicture: profilePicture,
      role: user.role, // Mantém a função (role) original do usuário
      id: user.id // Mantém o ID original do usuário
    }

    try {
      // Faz uma requisição PUT para a API para atualizar o perfil do usuário
      // `PUT` substitui o recurso completo com os dados fornecidos
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Indica que o corpo da requisição é JSON
        },
        body: JSON.stringify(updatedUserData), // Converte o objeto de dados atualizados para JSON
      })

      // Se a resposta da requisição não for bem-sucedida, lança um erro
      if (!response.ok) {
        throw new Error(`Falha ao atualizar perfil: ${response.statusText}`)
      }

      const data = await response.json() // Converte a resposta da API para JSON (dados do usuário atualizados)
      updateUser(data) // ATUALIZA O CONTEXTO DE AUTENTICAÇÃO COM OS NOVOS DADOS DO USUÁRIO

      // Exibe um alerta de sucesso usando SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Perfil atualizado com sucesso!',
        showConfirmButton: false, // Não mostra botão de confirmação (fecha automaticamente)
        timer: 1500 // Fecha após 1.5 segundos
      })

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err) // Loga o erro no console
      // Exibe um alerta de erro usando SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Não foi possível atualizar o perfil: ${err.message}`
      })
    } finally {
      setLoadingUpdate(false) // Desativa o estado de carregamento da atualização, independentemente do resultado
    }
  }

  // Renderização condicional: Exibe uma mensagem de carregamento inicial
  if (!isAuthenticated && !initialLoadComplete) {
    return <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">Carregando perfil...</div>
  }

  // Renderização condicional: Não renderiza nada se o usuário não estiver autenticado
  // (o useEffect de redirecionamento já cuidará de levá-lo para a página de login)
  if (!isAuthenticated) {
    return null
  }

  // Renderização do formulário de edição de perfil
  return (
    <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
      <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Editar Perfil</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#A62C2C] p-6 rounded-lg shadow-lg text-white">
        {/* Seção de Foto de Perfil */}
        <div className="mb-4 flex flex-col items-center">
          <img
            src={profilePicture || 'https://via.placeholder.com/100/cccccc/FFFFFF?text=Sem+Foto'} // Exibe a foto de perfil ou um placeholder
            alt="Foto de Perfil"
            className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-white"
          />
          {/* Label personalizado para o input de arquivo, estilizado como um botão */}
          <label htmlFor="profilePictureInput" className="cursor-pointer bg-[#f16c1d] hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Alterar Foto
          </label>
          {/* Input de arquivo oculto que é ativado pelo clique no label */}
          <input
            id="profilePictureInput"
            type="file" // Tipo "file" para seleção de arquivos
            accept="image/*" // Aceita apenas arquivos de imagem
            className="hidden" // Oculta o input padrão do navegador
            onChange={handleImageChange} // Chama `handleImageChange` quando um arquivo é selecionado
          />
          <p className="text-sm text-gray-200 mt-2">
            Clique para inserir uma URL de imagem (ex: /images/User1.png).
          </p>
        </div>

        {/* Campo ID do Usuário (somente leitura) */}
        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-bold mb-2">ID do Usuário:</label>
          <input
            type="text"
            id="id"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
            value={user?.id || ''} // Exibe o ID do usuário (usa optional chaining `?.` para segurança)
            readOnly // Campo somente leitura, não pode ser editado pelo usuário
          />
        </div>

        {/* Campo Nome */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">Nome:</label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={nome} // O valor do input é controlado pelo estado `nome`
            onChange={(e) => setNome(e.target.value)} // Atualiza o estado `nome` em cada mudança
            required // Campo obrigatório
          />
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold mb-2">Email:</label>
          <input
            type="email" // Tipo email para validação de formato básico
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={email} // O valor do input é controlado pelo estado `email`
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado `email` em cada mudança
            required // Campo obrigatório
          />
        </div>

        {/* Campo Senha */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-bold mb-2">Senha:</label>
          <input
            type="password" // Tipo password para ocultar os caracteres digitados
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={password} // O valor do input é controlado pelo estado `password`
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado `password` em cada mudança
            required // Campo obrigatório
          />
          <p className="text-xs text-gray-300 mt-1">
            Atenção: A senha é armazenada em texto puro no JSON Server para fins de demonstração.
          </p>
        </div>

        {/* Campo Endereço */}
        <div className="mb-6">
          <label htmlFor="adress" className="block text-sm font-bold mb-2">Endereço:</label>
          <input
            type="text"
            id="adress"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={adress} // O valor do input é controlado pelo estado `adress`
            onChange={(e) => setAdress(e.target.value)} // Atualiza o estado `adress` em cada mudança
          />
        </div>

        {/* Campo Função (Role) - (somente leitura) */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-bold mb-2">Função (Role):</label>
          <input
            type="text"
            id="role"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
            value={user?.role || ''} // Exibe a função do usuário (usa optional chaining `?.` para segurança)
            readOnly // Campo somente leitura
          />
        </div>

        {/* Botão Salvar Alterações */}
        <button
          type="submit"
          className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
          disabled={loadingUpdate} // Desabilita o botão enquanto a atualização está em andamento
        >
          {loadingUpdate ? 'Salvando...' : 'Salvar Alterações'} {/* Altera o texto do botão durante o carregamento */}
        </button>
      </form>
    </div>
  )
}

export default PerfilPage 