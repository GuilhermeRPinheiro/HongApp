import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { Card } from "flowbite-react";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import StarRating from '../Components/StarRating'; // Importe o componente StarRating

function HistoricoPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [userPedidos, setUserPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:3000/pedidos');
      if (!response.ok) throw new Error(`Erro ao carregar pedidos: ${response.status} ${response.statusText}`);
      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError("Não foi possível carregar seu histórico de pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  useEffect(() => {
    if (user && pedidos.length > 0) {
      const filtered = pedidos.filter(pedido => pedido.userId === user.id);
      const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      setUserPedidos(sorted);
    } else if (!user && !isAuthenticated && !loading) {
      setUserPedidos([]);
    }
  }, [user, pedidos, isAuthenticated, loading]);

  const handleAvaliarPedido = async (pedidoToEvaluate, newRating = null) => {
    let finalRating = newRating;

    if (finalRating === null || pedidoToEvaluate.orderRating === null) {
      const { value: formValues } = await Swal.fire({
        title: `Avaliar Pedido #${pedidoToEvaluate.id.substring(0, 8)}`,
        html:
          '<label for="swal-input1" class="swal2-label">Nota (1-5):</label>' +
          `<input id="swal-input1" class="swal2-input" type="number" min="1" max="5" placeholder="Sua nota" value="${finalRating || ''}">` +
          '<label for="swal-input2" class="swal2-label">Comentário (opcional):</label>' +
          `<textarea id="swal-input2" class="swal2-textarea" placeholder="O que você achou?">${pedidoToEvaluate.orderFeedback || ''}</textarea>`,
        focusConfirm: false,
        preConfirm: () => {
          const ratingInput = document.getElementById('swal-input1').value;
          const feedbackInput = document.getElementById('swal-input2').value;

          if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
            Swal.showValidationMessage('Por favor, dê uma nota de 1 a 5.');
            return false;
          }
          return { rating: parseInt(ratingInput), feedback: feedbackInput };
        }
      });

      if (!formValues) return;
      finalRating = formValues.rating;
      pedidoToEvaluate = { ...pedidoToEvaluate, orderFeedback: formValues.feedback };
    }

    if (finalRating !== null) {
      const updatedPedido = {
        ...pedidoToEvaluate,
        orderRating: finalRating,
        orderFeedback: pedidoToEvaluate.orderFeedback,
        status: 'avaliado'
      };

      try {
        const response = await fetch(`http://localhost:3000/pedidos/${pedidoToEvaluate.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPedido)
        });

        if (!response.ok) throw new Error(`Erro ao enviar avaliação: ${response.statusText}`);

        const savedPedido = await response.json();
        setPedidos(prevPedidos => prevPedidos.map(p =>
          p.id === savedPedido.id ? savedPedido : p
        ));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Avaliação Enviada!',
          showConfirmButton: false,
          timer: 100000, // Tempo do Swal
          timerProgressBar: false,
        });
      } catch (err) {
        console.error("Erro ao enviar avaliação:", err);
        Swal.fire('Erro', 'Não foi possível enviar sua avaliação. Tente novamente.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
        <p className="text-2xl font-['Montserrat']">Carregando histórico de pedidos...</p>
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
      <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Seu Histórico de Pedidos</h2>

      {userPedidos.length === 0 ? (
        <p className="text-xl font-['Montserrat'] text-gray-400">Você não tem nenhum pedido em seu histórico ainda.</p>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPedidos.map((pedido) => (
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
                        <p className="truncate text-sm font-medium text-white">{pedido.userName || 'Você'}</p>
                        <p className="truncate text-sm text-gray-300">Status: <span className="capitalize">{pedido.status}</span></p>
                        {/* Exibe as estrelas de avaliação ou o botão "Avaliar Pedido" */}
                        {isAuthenticated && user && user.role === 'user' ? (
                          pedido.orderRating !== null ? (
                            <div className="mt-1 flex items-center">
                              <StarRating
                                rating={pedido.orderRating}
                                onRatingChange={(newRating) => handleAvaliarPedido(pedido, newRating)} // Permite mudar a nota clicando nas estrelas
                                readOnly={false} // Permite interagir para mudar a nota
                              />
                              <span className="text-gray-300 text-sm ml-2">({pedido.orderRating}/5)</span>
                            </div>
                          ) : (
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
                          // Se não é user logado (ex: admin ou não logado), só exibe a nota se houver
                          pedido.orderRating !== null && (
                            <div className="mt-1 flex items-center">
                              <StarRating
                                rating={pedido.orderRating}
                                readOnly={true} // Não permite interagir
                              />
                              <span className="text-gray-300 text-sm ml-2">({pedido.orderRating}/5)</span>
                            </div>
                          )
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

export default HistoricoPage;