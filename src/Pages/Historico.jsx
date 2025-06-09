import { useState, useEffect } from 'react'
import { useAuth } from '../Contexts/AuthContext' 
import { Card } from 'flowbite-react' 
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom' 
import StarRating from '../Components/StarRating' 

function HistoricoPage() {
  const { user, isAuthenticated } = useAuth() // Obtém o objeto de usuário e o status de autenticação do AuthContext
  const navigate = useNavigate() // Hook para navegação programática
  const [pedidos, setPedidos] = useState([]) // Estado para armazenar TODOS os pedidos da API (não apenas do usuário logado)
  const [userPedidos, setUserPedidos] = useState([]) // Estado para armazenar os pedidos filtrados e ordenados do usuário atual
  const [loading, setLoading] = useState(true) // Estado para indicar se os dados estão sendo carregados
  const [error, setError] = useState(null) // Estado para armazenar mensagens de erro, se houver

  // useEffect para redirecionar para a página de login se o usuário não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login') // Redireciona se não estiver autenticado e o carregamento inicial terminou
    }
  }, [isAuthenticated, loading, navigate]) // Dependências: re-executa se status de auth, loading ou navigate mudarem

  // Função assíncrona para buscar todos os pedidos da API
  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:3000/pedidos') // Faz a requisição GET para a API de pedidos
      // Se a resposta não for bem-sucedida, lança um erro
      if (!response.ok) throw new Error(`Erro ao carregar pedidos: ${response.status} ${response.statusText}`)
      const data = await response.json() // Converte a resposta para JSON
      setPedidos(data) // Armazena todos os pedidos no estado 'pedidos'
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err) // Loga o erro no console
      setError("Não foi possível carregar seu histórico de pedidos.") // Define uma mensagem de erro para exibição
    } finally {
      setLoading(false) // Define loading como false, independentemente do sucesso ou falha da requisição
    }
  }

  // useEffect para buscar os pedidos quando o componente é montado
  useEffect(() => {
    fetchPedidos() // Chama a função para buscar os pedidos
  }, []) // Array de dependências vazio significa que este efeito executa apenas uma vez, após a montagem inicial

  // useEffect para filtrar e ordenar os pedidos do usuário atual
  // Este efeito é executado sempre que 'user', 'pedidos', 'isAuthenticated' ou 'loading' mudam
  useEffect(() => {
    if (user && pedidos.length > 0) {
      // Filtra os pedidos para incluir apenas aqueles cujo userId corresponde ao ID do usuário logado
      const filtered = pedidos.filter(pedido => pedido.userId === user.id)
      // Ordena os pedidos filtrados do mais novo para o mais antigo com base na data
      const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
      setUserPedidos(sorted) // Atualiza o estado 'userPedidos' com os pedidos filtrados e ordenados
    } else if (!user && !isAuthenticated && !loading) {
      // Se não há usuário logado e o carregamento terminou, zera os pedidos do usuário
      setUserPedidos([])
    }
  }, [user, pedidos, isAuthenticated, loading]) // Dependências: re-executa quando essas variáveis mudam

  // Função assíncrona para lidar com a avaliação de um pedido
  // 'pedidoToEvaluate' é o objeto do pedido, 'newRating' é a nota (opcional, se vindo do StarRating)
  const handleAvaliarPedido = async (pedidoToEvaluate, newRating = null) => {
    let finalRating = newRating // A nota final, inicializada com a nota passada (se houver)

    // Se não há uma nota inicial ou o pedido ainda não foi avaliado, abre o modal do SweetAlert2
    if (finalRating === null || pedidoToEvaluate.orderRating === null) {
      const { value: formValues } = await Swal.fire({
        title: `Avaliar Pedido #${pedidoToEvaluate.id.substring(0, 8)}`, // Título do modal com ID abreviado do pedido
        html:
          '<label for="swal-input1" class="swal2-label">Nota (1-5):</label>' +
          `<input id="swal-input1" class="swal2-input" type="number" min="1" max="5" placeholder="Sua nota" value="${finalRating || ''}">` +
          '<label for="swal-input2" class="swal2-label">Comentário (opcional):</label>' +
          `<textarea id="swal-input2" class="swal2-textarea" placeholder="O que você achou?">${pedidoToEvaluate.orderFeedback || ''}</textarea>`,
        focusConfirm: false, // Desabilita o foco automático no botão de confirmação
        preConfirm: () => {
          // Função executada antes de confirmar o modal, para validação dos inputs
          const ratingInput = document.getElementById('swal-input1').value
          const feedbackInput = document.getElementById('swal-input2').value

          // Valida se a nota está entre 1 e 5
          if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
            Swal.showValidationMessage('Por favor, dê uma nota de 1 a 5.') // Exibe mensagem de validação
            return false // Impede o fechamento do modal
          }
          return { rating: parseInt(ratingInput), feedback: feedbackInput } // Retorna os valores do formulário
        }
      })

      // Se o usuário cancelou o modal ou a validação falhou, interrompe a função
      if (!formValues) return
      finalRating = formValues.rating // Atualiza a nota final com o valor do formulário
      // Atualiza o objeto do pedido com o feedback do formulário (mantendo o objeto original intacto para o PATCH)
      pedidoToEvaluate = { ...pedidoToEvaluate, orderFeedback: formValues.feedback }
    }

    // Se uma nota final válida foi obtida (do StarRating ou do modal)
    if (finalRating !== null) {
      // Cria um objeto `updatedPedido` com a nova avaliação e feedback
      const updatedPedido = {
        ...pedidoToEvaluate, // Copia todas as propriedades do pedido original
        orderRating: finalRating, // Define a nota de avaliação
        orderFeedback: pedidoToEvaluate.orderFeedback, // Define o feedback
        status: 'avaliado' // Atualiza o status do pedido para 'avaliado'
      }

      try {
        // Faz uma requisição PATCH para atualizar o pedido na API
        const response = await fetch(`http://localhost:3000/pedidos/${pedidoToEvaluate.id}`, {
          method: 'PATCH', // Método PATCH para atualizar parcialmente um recurso
          headers: { 'Content-Type': 'application/json' }, // Indica que o corpo da requisição é JSON
          body: JSON.stringify(updatedPedido) // Converte o objeto de pedido atualizado para JSON
        })

        // Se a resposta não for bem-sucedida, lança um erro
        if (!response.ok) throw new Error(`Erro ao enviar avaliação: ${response.statusText}`)

        const savedPedido = await response.json() // Converte a resposta da API (o pedido atualizado) para JSON
        // Atualiza a lista de pedidos no estado, substituindo o pedido antigo pelo pedido atualizado
        setPedidos(prevPedidos => prevPedidos.map(p =>
          p.id === savedPedido.id ? savedPedido : p
        ))
        // Exibe um alerta de sucesso 'toast' no canto da tela
        Swal.fire({
          toast: true, // Estilo de notificação 'toast'
          position: 'top-end', // Posição no canto superior direito
          icon: 'success', // Ícone de sucesso
          title: 'Avaliação Enviada!', // Título da notificação
          showConfirmButton: false, // Não mostra botão de confirmação
          timer: 100000, // Tempo de exibição em milissegundos (muito longo, pode ser um erro de digitação, ex: 3000 para 3 segundos)
          timerProgressBar: false, // Não mostra barra de progresso do timer
        })
      } catch (err) {
        console.error("Erro ao enviar avaliação:", err) // Loga o erro no console
        Swal.fire('Erro', 'Não foi possível enviar sua avaliação. Tente novamente.', 'error') // Exibe um alerta de erro
      }
    }
  }

  // Renderização condicional: Exibe mensagem de carregamento
  if (loading) {
    return (
      <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
        <p className="text-2xl font-['Montserrat']">Carregando histórico de pedidos...</p>
      </div>
    )
  }

  // Renderização condicional: Exibe mensagem de erro
  if (error) {
    return (
      <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
        <p className="text-2xl font-['Montserrat'] text-red-500">Erro: {error}</p>
      </div>
    )
  }

  // Renderização condicional: Se não estiver autenticado, não renderiza nada (redirecionamento já acontece no useEffect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
      <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Seu Histórico de Pedidos</h2>

      {/* Renderização condicional: Se não houver pedidos para o usuário */}
      {userPedidos.length === 0 ? (
        <p className="text-xl font-['Montserrat'] text-gray-400">Você não tem nenhum pedido em seu histórico ainda.</p>
      ) : (
        /* Grid para exibir os cartões de pedidos */
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mapeia e renderiza cada pedido do usuário como um Card do Flowbite */}
          {userPedidos.map((pedido) => (
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
                        <p className="truncate text-sm font-medium text-white">{pedido.userName || 'Você'}</p>
                        <p className="truncate text-sm text-gray-300">Status: <span className="capitalize">{pedido.status}</span></p>
                        {/* Lógica condicional para exibir as estrelas de avaliação ou o botão "Avaliar Pedido" */}
                        {isAuthenticated && user && user.role === 'user' ? (
                          // Se o usuário é um 'user' e está logado
                          pedido.orderRating !== null ? (
                            // Se o pedido já tem uma avaliação, exibe as estrelas e a nota
                            <div className="mt-1 flex items-center">
                              <StarRating
                                rating={pedido.orderRating}
                                onRatingChange={(newRating) => handleAvaliarPedido(pedido, newRating)} // Permite mudar a nota clicando nas estrelas
                                readOnly={false} // Estrelas são interativas
                              />
                              <span className="text-gray-300 text-sm ml-2">({pedido.orderRating}/5)</span>
                            </div>
                          ) : (
                            // Se o pedido ainda não foi avaliado, exibe o botão "Avaliar Pedido"
                            <div className="mt-1">
                              <button
                                onClick={() => handleAvaliarPedido(pedido)} // Abre o SweetAlert para coletar nota e feedback
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md font-semibold text-sm"
                              >
                                Avaliar Pedido
                              </button>
                            </div>
                          )
                        ) : (
                          // Se não é um 'user' logado (ex: admin ou não logado), só exibe a nota se ela existir
                          pedido.orderRating !== null && (
                            <div className="mt-1 flex items-center">
                              <StarRating
                                rating={pedido.orderRating}
                                readOnly={true} // Estrelas não são interativas
                              />
                              <span className="text-gray-300 text-sm ml-2">({pedido.orderRating}/5)</span>
                            </div>
                          )
                        )}
                      </div>
                      {/* Exibe o valor total do pedido formatado */}
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

export default HistoricoPage 