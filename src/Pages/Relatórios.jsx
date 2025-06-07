// src/Pages/Relatorios.js
import React, { useState, useEffect } from 'react';
import { Card } from "flowbite-react";
// Importe o Footer se quiser usar aqui também
// import Footer from '../Components/Footer';

function RelatorioPage() { // Renomeado de AdminRelatorios para RelatorioPage
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('http://localhost:3000/pedidos'); // URL do seu JSON Server
        if (!response.ok) {
          throw new Error(`Erro ao carregar pedidos: ${response.statusText}`);
        }
        const data = await response.json();
        // Ordena os pedidos do mais novo para o mais antigo
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPedidos(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  // Função para lidar com a impressão
  const handlePrint = () => {
    window.print();
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

  return (
    <>
      <div className="pt-10 p-5 flex flex-col items-center min-h-screen bg-transparent text-white">
        <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Relatório de Pedidos</h2>

        {/* Botão de Imprimir/Salvar PDF */}
        {pedidos.length > 0 && ( // Mostra o botão apenas se houver pedidos
          <button
            onClick={handlePrint}
            className=" cursor-pointer bg-[#f16c1d] hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-6 print-hidden"
          >
            Imprimir Relatórios / Salvar como PDF
          </button>
        )}

        {pedidos.length === 0 ? (
          <p className="text-xl text-gray-400">Nenhum pedido encontrado ainda.</p>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pedidos.map((pedido) => (
              <Card key={pedido.id} className="w-full bg-[#A62C2C] text-white"> {/* Ajuste a cor de fundo */}
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="text-xl font-bold leading-none text-white">Pedido #{pedido.id.substring(0, 8)}</h5>
                  <span className="text-sm font-medium text-white">
                    {new Date(pedido.date).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flow-root">
                  <ul className="divide-y divide-gray-700">
                    {/* Informações do Usuário */}
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
                    </li>
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* <Footer /> Se quiser o footer aqui, importe-o e descomente */}
    </>
  );
}

export default RelatorioPage;