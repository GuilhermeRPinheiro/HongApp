import { useState, useEffect } from 'react' 
import { useAuth } from '../Contexts/AuthContext' 
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import Footer from '../Components/Footer'


// Definição do componente funcional Admin
function Admin() {

  // Hooks para acessar o contexto de autenticação, verificando se o usuário está autenticado e é um administrador
  const { isAuthenticated, isAdmin } = useAuth()

  // Estados locais para armazenar os dados gerenciados e o status da UI
  const [users, setUsers] = useState([]) // Estado para armazenar a lista de usuários
  const [pratos, setPratos] = useState([]) // Estado para armazenar a lista de pratos
  const [loading, setLoading] = useState(true) // Estado para indicar se os dados estão sendo carregados
  const [error, setError] = useState(null) // Estado para armazenar mensagens de erro, se houver

  // Função assíncrona para buscar a lista de usuários da API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users') // Faz uma requisição GET para a API de usuários
      // Verifica se a resposta da requisição foi bem-sucedida (status 2xx)
      if (!response.ok) throw new Error(`Erro ao carregar usuários: ${response.status} ${response.statusText}`)
      const data = await response.json() // Converte a resposta para JSON
      setUsers(data) // Atualiza o estado 'users' com os dados recebidos
    } catch (err) {
      console.error("Erro ao buscar usuários:", err) // Loga o erro no console para debug
      setError("Não foi possível carregar a lista de usuários.") // Define uma mensagem de erro para exibição na UI
    }
  }

  // Função assíncrona para buscar a lista de pratos da API
  const fetchPratos = async () => {
    try {
      const response = await fetch('http://localhost:3000/pratos') // Faz uma requisição GET para a API de pratos
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) throw new Error(`Erro ao carregar pratos: ${response.status} ${response.statusText}`)
      const data = await response.json() // Converte a resposta para JSON

      // Ajusta os dados dos pratos antes de armazenar no estado
      // Garante que 'preco' seja um número (convertido para 'price') e trata inconsistências de nomes de campos
      const pratosAjustados = data.map(p => ({
        ...p, // Copia todas as propriedades originais do prato
        name: p.nome || p.name, // Usa 'nome' se existir, senão 'name' para o nome do prato
        imageURL: p.imagem || p.imageURL, // Usa 'imagem' se existir, senão 'imageURL' para a URL da imagem
        price: parseFloat(p.preco) || 0, // Converte 'preco' (que vem da API) para um número decimal (salva em 'price'), padrão 0 se for inválido
        category: p.category || 'Não Especificado' // Define a categoria, padrão 'Não Especificado' se não houver
      }))
      setPratos(pratosAjustados) // Atualiza o estado 'pratos' com os dados ajustados
    } catch (err) {
      console.error("Erro ao buscar pratos:", err) // Loga o erro no console
      setError("Não foi possível carregar a lista de pratos.") // Define mensagem de erro
    }
  }

 
  // Função assíncrona para deletar um usuário
  const deleteUser = async (userId, userName) => {
    // Exibe um alerta de confirmação usando SweetAlert2 antes de deletar
    Swal.fire({
      title: `Tem certeza que quer deletar ${userName}?`,
      text: "Esta ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      // Se o usuário confirmar a exclusão
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/users/${userId}`, { method: 'DELETE' }) // Faz requisição DELETE
          // Verifica se a resposta foi bem-sucedida
          if (!response.ok) throw new Error(`Erro ao deletar usuário: ${response.status} ${response.statusText}`)
          // Atualiza o estado 'users' removendo o usuário deletado
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
          Swal.fire('Deletado!', `O usuário ${userName} foi deletado com sucesso.`, 'success') // Exibe sucesso
        } catch (err) {
          console.error("Erro ao deletar usuário:", err) // Loga o erro
          Swal.fire('Erro!', `Não foi possível deletar o usuário ${userName}. ${err.message}`, 'error') // Exibe erro
        }
      }
    })
  }

  // Função assíncrona para deletar um prato
  const deletePrato = async (pratoId, pratoNome) => {
    // Exibe um alerta de confirmação usando SweetAlert2 antes de deletar
    Swal.fire({
      title: `Tem certeza que quer deletar ${pratoNome}?`,
      text: "Esta ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      // Se o usuário confirmar a exclusão
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/pratos/${pratoId}`, { method: 'DELETE' }) // Faz requisição DELETE
          // Verifica se a resposta foi bem-sucedida
          if (!response.ok) throw new Error(`Erro ao deletar prato: ${response.status} ${response.statusText}`)
          // Atualiza o estado 'pratos' removendo o prato deletado
          setPratos(prevPratos => prevPratos.filter(prato => prato.id !== pratoId))
          Swal.fire('Deletado!', `O prato ${pratoNome} foi deletado com sucesso.`, 'success') // Exibe sucesso
        } catch (err) {
          console.error("Erro ao deletar prato:", err) // Loga o erro
          Swal.fire('Erro!', `Não foi possível deletar o prato ${pratoNome}. ${err.message}`, 'error') // Exibe erro
        }
      }
    })
  }



  // Hook useEffect: executa efeitos colaterais após renderizações
  // Este useEffect é responsável por buscar os dados iniciais quando o componente é montado
  useEffect(() => {
    // Verifica seo o usuário está autenticado e tem permissão de administradr
    if (isAuthenticated && isAdmin()) {
      // Busca todos os dados (usuários, pratos, pedidos) em paralelo usando Promise.all
      Promise.all([fetchUsers(), fetchPratos()])
        .finally(() => setLoading(false)) // Define loading como false quando todas as promessas forem resolvidas (com sucesso ou falha)
    } else {
      setLoading(false) // Se não for admin, para o loading imediatamente
    }
  }, [isAuthenticated, isAdmin]) // Dependências: o efeito será re-executado se isAuthenticated ou isAdmin mudarem

  // Renderização condicional baseada no estado de carregamento, erro ou permissões
  if (loading) {
    // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
    return <div className="flex justify-center items-center h-screen text-white text-2xl">Carregando dados de administração...</div>
  }

  if (error) {
    // Exibe uma mensagem de erro se algo deu errado na busca dos dados
    return <div className="flex justify-center items-center h-screen text-red-500 text-2xl">{error}</div>
  }

  if (!isAuthenticated || !isAdmin()) {
    // Exibe uma mensagem de acesso negado se o usuário não for autenticado ou não for administrador
    return <div className="flex justify-center items-center h-screen text-red-500 text-2xl">Acesso Negado: Você não tem permissão de administrador.</div>
  }

  // Renderização principal do componente Admin
  return (
    <>
      {/* Container principal da página de administração */}
      <div className="pt-10 p-5 flex flex-col items-center min-h-screen bg-transparent text-white">

        {/* Seção para Gerenciar Usuários */}
        <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Gerenciar Usuários</h2>
        {/* Renderização condicional: se não houver usuários, exibe uma mensagem */}
        {users.length === 0 ? (
          <div className="text-xl text-gray-400">Nenhum usuário cadastrado.</div>
        ) : (
          // Tabela/Lista de usuários
          <div className="w-full max-w-3xl bg-[#A62C2C] rounded-lg shadow-lg overflow-hidden">
            {/* Cabeçalho da tabela de usuários com estilo de fundo diferente para destaque */}
            <div className="flex justify-between items-center bg-[#EB2E2E] p-4 font-bold text-lg">
              <span className="w-1/4">ID</span>
              <span className="w-1/4">Nome</span>
              <span className="w-1/4">Email</span>
              <span className="w-1/4 text-center">Ações</span>
            </div>
            {/* Mapeia e renderiza cada usuário na lista */}
            {users.map(userItem => (
              <div key={userItem.id} className="flex justify-between items-center p-4 last:border-b-0">
                <span className="w-1/4 text-sm break-words pr-2">{userItem.id}</span>
                <span className="w-1/4 text-base break-words pr-2">{userItem.name}</span>
                <span className="w-1/4 text-base break-words pr-2">{userItem.email}</span>
                <div className="w-1/4 flex justify-center">
                  {/* Botão para deletar usuário */}
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

        {/* Seção para Gerenciar Pratos com Botão Criar */}
        <div className="flex justify-between items-center w-full max-w-5xl mt-16 mb-8">
          <h2 className="text-5xl font-bold font-['Montserrat'] uppercase text-white">Gerenciar Pratos</h2>
          {/* Link para a página de criação de novo prato */}
          <Link
            to="/criarprato"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Criar Novo Prato
          </Link>
        </div>

        {/* Renderização condicional: se não houver pratos, exibe uma mensagem */}
        {pratos.length === 0 ? (
          <div className="text-xl text-gray-400">Nenhum prato cadastrado.</div>
        ) : (
          // Tabela/Lista de pratos
          <div className="w-full max-w-5xl rounded-lg overflow-hidden">
            {/* Cabeçalho da tabela de pratos */}
            <div className="flex justify-between items-center bg-[#EB2E2E] p-4 font-bold text-lg">
              <span className="w-[10%]"></span> {/* Coluna vazia para imagem */}
              <span className="w-1/4">Nome</span>
              <span className="w-1/5">Categoria</span>
              <span className="w-[15%]">Preço</span>
              <span className="w-1/4 text-center">Ações</span>
            </div>
            {/* Mapeia e renderiza cada prato na lista */}
            {pratos.map(prato => (
              <div key={prato.id} className="flex items-center p-4 border-b last:border-b-0">
                <div className="w-[10%] flex justify-center items-center">
                  {/* Exibe a imagem do prato, priorizando 'imageURL' se existir, senão 'imagem' */}
                  <img src={prato.imageURL || prato.imagem} alt={prato.name || prato.nome} className="w-16 h-16 object-cover rounded-md" />
                </div>
                {/* Exibe o nome do prato, priorizando 'name' se existir, senão 'nome' */}
                <span className="w-1/4 text-base break-words pr-2">{prato.name || prato.nome}</span>
                <span className="w-1/5 text-base break-words pr-2">{prato.category}</span>
                <span className="w-[15%] text-base break-words pr-2">
                  {/* Exibe o preço formatado para 2 casas decimais, usando a propriedade 'price' (já numérica) */}
                  R$ {prato.price !== undefined && prato.price !== null ? prato.price.toFixed(2) : '0.00'}
                </span>
                <div className="w-1/4 flex justify-center space-x-2">
                  {/* Link para a página de edição de prato */}
                  <Link
                    to={`/editarprato/${prato.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                  >
                    Editar
                  </Link>
                  {/* Botão para deletar prato */}
                  <button
                    onClick={() => deletePrato(prato.id, prato.name || prato.nome)}
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