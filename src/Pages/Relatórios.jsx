import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { Card, Dropdown, DropdownItem } from "flowbite-react"; // Importe Dropdown e DropdownItem
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import StarRating from '../Components/StarRating'; // Importe o componente StarRating (se já não estiver)

function RelatorioPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]); // Armazena TODOS os pedidos brutos
  const [filteredPedidos, setFilteredPedidos] = useState([]); // Armazena os pedidos filtrados/ordenados para exibição
  const [currentSort, setCurrentSort] = useState('dateDesc'); // Estado para a opção de ordenação: 'dateDesc' (mais recente), 'ratingDesc' (melhor avaliado)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redireciona se não for admin ou não estiver autenticado após o carregamento inicial
    if (!isAuthenticated || !isAdmin()) {
      if (!loading) { // Apenas redireciona se já terminou de carregar o estado de autenticação
        navigate('/admin'); // Ou para uma página de acesso negado
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:3000/pedidos');
      if (!response.ok) throw new Error(`Erro ao carregar pedidos: ${response.status} ${response.statusText}`);
      const data = await response.json();
      setPedidos(data); // Guarda todos os pedidos brutos
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError("Não foi possível carregar os relatórios de pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos(); // Busca os pedidos ao montar o componente
  }, []);

  // NOVO: Função para aplicar a ordenação aos pedidos
  const applySort = (sortOption) => {
    let sorted = [...pedidos]; // Começa com uma cópia dos pedidos brutos

    if (sortOption === 'ratingDesc') {
      // Ordena por nota (maior para menor). Pedidos não avaliados (null) vão para o final.
      sorted.sort((a, b) => {
        // Se ambos não avaliados, mantém a ordem
        if (a.orderRating === null && b.orderRating === null) return 0;
        // Se 'a' não tem nota, ele vai para o final
        if (a.orderRating === null) return 1;
        // Se 'b' não tem nota, ele vai para o final (ou 'a' vem antes de 'b')
        if (b.orderRating === null) return -1;
        // Compara as notas (maior para menor)
        return b.orderRating - a.orderRating;
      });
    } else { // Padrão: 'dateDesc' (mais recentes)
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setFilteredPedidos(sorted); // Atualiza o estado dos pedidos exibidos
  };

  // NOVO: useEffect para re-ordenar sempre que 'pedidos' ou 'currentSort' mudar
  useEffect(() => {
    if (!loading && pedidos.length > 0) { // Só ordena se não estiver carregando e houver pedidos
      applySort(currentSort);
    } else if (!loading && pedidos.length === 0) {
      setFilteredPedidos([]); // Garante que esteja vazio se não houver pedidos
    }
  }, [pedidos, currentSort, loading]); // Depende dos pedidos brutos, da opção de ordenação e do loading

  // Função para lidar com a impressão (mantida)
  const handlePrint = () => {
    window.print();
  };

  // Função para lidar com a avaliação do pedido (mantida, mas lembre-se que aqui é readOnly)
  // No contexto de Relatórios Admin, o admin geralmente NÃO avalia, apenas vê.
  // Se quiser que o admin possa mudar, precisa de uma UI diferente ou este mesmo modal.
  const handleAvaliarPedido = async (pedidoToEvaluate, newRating = null) => {
    // Para a página de Relatórios, vamos manter as estrelas readOnly no card.
    // Se quiser permitir que o admin edite A PARTIR DAQUI, você descomentaria a lógica abaixo.
    // No momento, o admin pode ver a avaliação, mas não a altera na página de relatórios.
    // A avaliação é feita pelo usuário na página de Histórico.
    Swal.fire({
      icon: 'info',
      title: 'Visualização da Avaliação',
      html: `Pedido #${pedidoToEvaluate.id.substring(0, 8)}<br>Nota: ${pedidoToEvaluate.orderRating}/5<br>Feedback: "${pedidoToEvaluate.orderFeedback || 'N/A'}"`,
      confirmButtonText: 'Fechar'
    });
  };

  if (loading) {
    return (
      <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
        <p className="text-2xl font-['Montserrat']">Carregando relatórios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
        <p className="text-2xl font-['Montserrat'] text-red-500">Erro: {error}</p>
      </div>
    );
  }

  // Se não é admin ou não está autenticado, exibe mensagem (o useEffect já redireciona)
  if (!isAuthenticated || !isAdmin()) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-2xl">Acesso Negado: Você não tem permissão de administrador.</div>;
  }

  return (
    <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
      <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Relatórios de Pedidos</h2>

      {/* NOVO: Container para o botão de imprimir e o filtro */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 ">
        {/* Botão de Imprimir/Salvar PDF */}
        {pedidos.length > 0 && (
          <button
            onClick={handlePrint}
            className="bg-[#f16c1d] hover:bg-orange-700 cursor-pointer text-white font-bold py-2 px-4 rounded print-hidden"
          >
            Imprimir Relatórios / Salvar como PDF
          </button>
        )}

        {/* Dropdown de Filtro */}
        {pedidos.length > 0 && (
          <Dropdown
            label={`Ordenar por: ${currentSort === 'dateDesc' ? 'Mais Recentes' : 'Mais Bem Avaliados'}`}
            inline
            className="bg-transparent text-black mb-10" // Estiliza o dropdown
          >
            <DropdownItem
              onClick={() => setCurrentSort('dateDesc')}
              className={currentSort === 'dateDesc' ? ' text-black' : 'text-black'}
            >
              Mais Recentes
            </DropdownItem>
            <DropdownItem
              onClick={() => setCurrentSort('ratingDesc')}
              className={currentSort === 'ratingDesc' ? 'bg-orange text-black' : 'text-black hover:bg-orange-500'}
            >
              Mais Bem Avaliados
            </DropdownItem>
          </Dropdown>
        )}
      </div>

      {filteredPedidos.length === 0 ? ( // Usamos filteredPedidos aqui
        <p className="text-xl font-['Montserrat'] text-gray-400">Nenhum pedido encontrado ainda.</p>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          {filteredPedidos.map((pedido) => ( // Mapeamos filteredPedidos
            <Card key={pedido.id} className="w-full bg-[#D31D1D] text-white">
              <div className="mb-2 flex items-center justify-between">
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
                        <img
                          alt={pedido.userName || 'Usuário'}
                          src={pedido.userPhoto || 'https://via.placeholder.com/32/cccccc/FFFFFF?text=User'}
                          width="32"
                          height="32"
                          className="rounded-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{pedido.userName || 'Usuário Desconhecido'}</p>
                        <p className="truncate text-sm text-gray-300">Status: <span className="capitalize">{pedido.status}</span></p>
                        {/* Exibe as estrelas de avaliação (apenas leitura para admin) */}
                        {pedido.orderRating !== null && (
                          <div className="mt-1 flex items-center">
                            <StarRating
                              rating={pedido.orderRating}
                              readOnly={true} // Admin não altera a nota por aqui
                            />
                            <span className="text-gray-300 text-sm ml-2">({pedido.orderRating}/5)</span>
                          </div>
                        )}
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-white">
                        R$ {pedido.totalValue.toFixed(2)}
                      </div>
                    </div>
                  </li>

                  {/* Itens do Pedido */}
                  <li className="pt-3 sm:pt-4">
                    <h6 className="text-md font-bold mb-2 text-white">Itens:</h6>
                    <ul className="list-disc list-inside text-sm text-gray-200">
                      {pedido.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="mb-1">
                          <div className="flex items-center">
                            <img
                              src={item.imageURL || 'https://via.placeholder.com/20'}
                              alt={item.name}
                              className="w-5 h-5 rounded-sm object-cover mr-2"
                            />
                            {item.quantity}x {item.name} (R$ {item.price.toFixed(2)})
                          </div>
                        </li>
                      ))}
                    </ul>
                    {/* Exibe o feedback se já avaliado */}
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
  );
}

export default RelatorioPage;