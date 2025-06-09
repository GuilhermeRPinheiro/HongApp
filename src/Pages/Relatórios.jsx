import { useState, useEffect } from 'react' 
import { useAuth } from '../Contexts/AuthContext' 
import { Card, Dropdown, DropdownItem } from "flowbite-react" 
import { useNavigate } from 'react-router-dom' 
import StarRating from '../Components/StarRating' 

function RelatorioPage() {
  const { isAuthenticated, isAdmin } = useAuth() // Obtém dados do usuário, status de autenticação e função de verificação de admin
  const navigate = useNavigate() // Hook para navegação programática
  const [pedidos, setPedidos] = useState([]) // Estado para armazenar TODOS os pedidos brutos recebidos da API
  const [filteredPedidos, setFilteredPedidos] = useState([]) // Estado para armazenar os pedidos após filtragem e ordenação (o que é exibido)
  const [currentSort, setCurrentSort] = useState('dateDesc') // Estado para controlar a opção de ordenação atual (padrão: 'Mais Recentes')
  const [loading, setLoading] = useState(true) // Estado booleano para indicar se os dados estão sendo carregados
  const [error, setError] = useState(null) // Estado para armazenar mensagens de erro, se houver

  // Hook useEffect: Responsável por redirecionar usuários não administradores ou não autenticados
  useEffect(() => {
    // Redireciona se o usuário não for autenticado ou não for administrador
    // Apenas redireciona se o carregamento inicial dos dados de autenticação já tiver terminado
    if (!isAuthenticated || !isAdmin()) {
      if (!loading) {
        navigate('/admin') // Redireciona para a página de administração (ou outra página de acesso negado)
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate]) // Dependências: re-executa se status de autenticação, função isAdmin, loading ou navigate mudarem

  // Função assíncrona para buscar todos os pedidos da API
  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:3000/pedidos') // Faz uma requisição GET para a API de pedidos
      // Se a resposta não for bem-sucedida, lança um erro
      if (!response.ok) throw new Error(`Erro ao carregar pedidos: ${response.status} ${response.statusText}`)
      const data = await response.json() // Converte a resposta para JSON
      setPedidos(data) // Armazena todos os pedidos brutos no estado 'pedidos'
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err) // Loga o erro no console
      setError("Não foi possível carregar os relatórios de pedidos.") // Define uma mensagem de erro para exibição
    } finally {
      setLoading(false) // Finaliza o estado de carregamento, independentemente do sucesso ou falha
    }
  }

  // Hook useEffect: Chama a função para buscar os pedidos quando o componente é montado
  useEffect(() => {
    fetchPedidos() // Executa a busca de pedidos
  }, []) // Array de dependências vazio significa que este efeito executa apenas uma vez, na montagem inicial

  // Função para aplicar a ordenação aos pedidos com base na opção selecionada
  const applySort = (sortOption) => {
    let sorted = [...pedidos] // Cria uma cópia dos pedidos brutos para não modificar o estado original

    // Lógica de ordenação:
    if (sortOption === 'ratingDesc') {
      // Ordena por nota de avaliação (do maior para o menor).
      // Pedidos sem avaliação (orderRating === null) são movidos para o final da lista.
      sorted.sort((a, b) => {
        if (a.orderRating === null && b.orderRating === null) return 0 // Mantém ordem se ambos não avaliados
        if (a.orderRating === null) return 1 // Se 'a' não tem nota, ele vai para o final
        if (b.orderRating === null) return -1 // Se 'b' não tem nota, 'a' vem antes de 'b'
        return b.orderRating - a.orderRating // Compara as notas (maior para menor)
      })
    } else { // Caso padrão: 'dateDesc' (ordenar por data, do mais recente para o mais antigo)
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    setFilteredPedidos(sorted) // Atualiza o estado 'filteredPedidos' com a lista ordenada
  }

  // Hook useEffect: Re-ordena os pedidos sempre que o estado 'pedidos' ou 'currentSort' muda
  useEffect(() => {
    // Só aplica a ordenação se o carregamento já terminou e houver pedidos
    if (!loading && pedidos.length > 0) {
      applySort(currentSort)
    } else if (!loading && pedidos.length === 0) {
      // Se não há pedidos e o carregamento terminou, garante que a lista filtrada esteja vazia
      setFilteredPedidos([])
    }
  }, [pedidos, currentSort, loading]) // Dependências: re-executa quando 'pedidos', 'currentSort' ou 'loading' mudam

  // Função para lidar com a impressão do conteúdo da página (abre a caixa de diálogo de impressão do navegador)
  const handlePrint = () => {
    window.print()
  }

  // Renderização condicional: Exibe mensagem de carregamento enquanto os dados são buscados
  if (loading) {
    return (
      <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
        <p className="text-2xl font-['Montserrat']">Carregando relatórios...</p>
      </div>
    )
  }

  // Renderização condicional: Exibe mensagem de erro se a busca de dados falhou
  if (error) {
    return (
      <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
        <p className="text-2xl font-['Montserrat'] text-red-500">Erro: {error}</p>
      </div>
    )
  }

  // Renderização condicional: Exibe mensagem de acesso negado se o usuário não for admin ou não estiver autenticado
  // (o useEffect já cuida do redirecionamento, mas esta é uma segurança visual)
  if (!isAuthenticated || !isAdmin()) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-2xl">Acesso Negado: Você não tem permissão de administrador.</div>
  }

  // Renderização principal do componente RelatorioPage
  return (
    <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
      <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Relatórios de Pedidos</h2>

      {/* Container para o botão de imprimir/PDF e o Dropdown de ordenação */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        {/* Botão de Imprimir/Salvar como PDF */}
        {/* Só é exibido se houver pedidos para imprimir */}
        {pedidos.length > 0 && (
          <button
            onClick={handlePrint}
            // `print-hidden` é uma classe personalizada para esconder o botão na versão impressa
            className="bg-[#f16c1d] hover:bg-orange-700 cursor-pointer text-white font-bold py-2 px-4 rounded print-hidden"
          >
            Imprimir Relatórios / Salvar como PDF
          </button>
        )}

        {/* Dropdown de Ordenação */}
        {/* Só é exibido se houver pedidos para ordenar */}
        {pedidos.length > 0 && (
          <Dropdown
            // Exibe o texto da opção de ordenação atual no label do dropdown
            label={`Ordenar por: ${currentSort === 'dateDesc' ? 'Mais Recentes' : 'Mais Bem Avaliados'}`}
            inline // Renderiza o dropdown inline
            className="bg-transparent text-black mb-10" // Estilos para o dropdown
          >
            {/* Opção "Mais Recentes" no dropdown */}
            <DropdownItem
              onClick={() => setCurrentSort('dateDesc')} // Define a opção de ordenação ao clicar
              className={currentSort === 'dateDesc' ? 'text-black' : 'text-black'} // Estilo para a opção selecionada
            >
              Mais Recentes
            </DropdownItem>
            {/* Opção "Mais Bem Avaliados" no dropdown */}
            <DropdownItem
              onClick={() => setCurrentSort('ratingDesc')} // Define a opção de ordenação ao clicar
              className={currentSort === 'ratingDesc' ? 'bg-orange text-black' : 'text-black hover:bg-orange-500'} // Estilo para a opção selecionada
            >
              Mais Bem Avaliados
            </DropdownItem>
          </Dropdown>
        )}
      </div>

      {/* Renderização condicional: Se não houver pedidos filtrados para exibir */}
      {filteredPedidos.length === 0 ? (
        <p className="text-xl font-['Montserrat'] text-gray-400">Nenhum pedido encontrado ainda.</p>
      ) : (
        /* Grid para exibir os cartões de pedidos */
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          {/* Mapeia e renderiza cada pedido filtrado/ordenado como um Card do Flowbite */}
          {filteredPedidos.map((pedido) => (
            <Card key={pedido.id} className="w-full bg-[#D31D1D] text-white">
              <div className="mb-2 flex items-center justify-between">
                {/* Exibe o ID do pedido (primeiros 8 caracteres) e a data formatada */}
                <h5 className="text-xl font-bold leading-none text-white">Pedido #{pedido.id.substring(0, 8)}</h5>
                <span className="text-sm font-medium text-white">
                  {new Date(pedido.date).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flow-root">
                <ul className="divide-y divide-gray-700">
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0">
                        {/* Exibe a foto do usuário associado ao pedido */}
                        <img
                          alt={pedido.userName || 'Usuário'}
                          src={pedido.userPhoto || 'https://via.placeholder.com/32/cccccc/FFFFFF?text=User'}
                          width="32"
                          height="32"
                          className="rounded-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* Exibe o nome do usuário e o status do pedido */}
                        <p className="truncate text-sm font-medium text-white">{pedido.userName || 'Usuário Desconhecido'}</p>
                        <p className="truncate text-sm text-gray-300">Status: <span className="capitalize">{pedido.status}</span></p>
                        {/* Exibe as estrelas de avaliação se o pedido tiver uma nota (apenas leitura para o admin) */}
                        {pedido.orderRating !== null && (
                          <div className="mt-1 flex items-center">
                            <StarRating
                              rating={pedido.orderRating}
                              readOnly={true} // As estrelas são somente leitura para o administrador nesta página
                            />
                            <span className="text-gray-300 text-sm ml-2">({pedido.orderRating}/5)</span>
                          </div>
                        )}
                      </div>
                      {/* Exibe o valor total do pedido formatado para 2 casas decimais */}
                      <div className="inline-flex items-center text-base font-semibold text-white">
                        R$ {pedido.totalValue.toFixed(2)}
                      </div>
                    </div>
                  </li>

                  {/* Lista de Itens do Pedido */}
                  <li className="pt-3 sm:pt-4">
                    <h6 className="text-md font-bold mb-2 text-white">Itens:</h6>
                    <ul className="list-disc list-inside text-sm text-gray-200">
                      {/* Mapeia e exibe cada item dentro do pedido */}
                      {pedido.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="mb-1">
                          <div className="flex items-center">
                            <img
                              src={item.imageURL || 'https://via.placeholder.com/20'} // Exibe a imagem do item ou um placeholder
                              alt={item.name}
                              className="w-5 h-5 rounded-sm object-cover mr-2"
                            />
                            {item.quantity}x {item.name} (R$ {item.price.toFixed(2)})
                          </div>
                        </li>
                      ))}
                    </ul>
                    {/* Exibe o feedback do pedido, se já avaliado e houver feedback */}
                    {pedido.orderFeedback && (
                      <p className="text-gray-300 text-xs mt-2">Feedback: "{pedido.orderFeedback}"</p>
                    )}
                  </li>
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default RelatorioPage 