// src/pages/Menu.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardPrato from '../Components/CardPrato';
import Footer from '../Components/Footer';
import button from 'daisyui/components/button';

function Menu() {
  const [pratos, setPratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate

  useEffect(() => {
    async function fetchPratos() {
      console.log("MENU DEBUG: 1. Iniciando fetchPratos..."); // DEBUG 1
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3000/pratos'); 
        console.log("MENU DEBUG: 2. Resposta do fetch:", response); // DEBUG 2

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro HTTP ao carregar pratos: ${response.status} ${response.statusText}. Detalhes: ${errorText}`);
        }

        const data = await response.json();
        console.log("MENU DEBUG: 3. Dados JSON recebidos da API:", data); // DEBUG 3

        // Mapeia para garantir que o 'preco' seja um número e que 'category' exista
        const pratosAjustados = data.map(p => ({
            ...p,
            preco: parseFloat(p.preco) || 0, // Garante que 'preco' é numérico
            category: p.category || 'Geral' // Garante que 'category' existe para o filtro
        }));
        setPratos(pratosAjustados);
        console.log("MENU DEBUG: 4. Pratos ajustados e definidos no estado:", pratosAjustados); // DEBUG 4

      } catch (err) {
        console.error("MENU DEBUG: 5. ERRO CAPTURADO EM fetchPratos:", err); // DEBUG 5
        setError("Não foi possível carregar o cardápio. Verifique a conexão com o servidor.");
      } finally {
        setLoading(false);
        console.log("MENU DEBUG: 6. fetchPratos finalizado. Loading:", false); // DEBUG 6
      }
    }
    fetchPratos();
  }, []); // O array vazio garante que roda apenas uma vez

  // Filtra os pratos com base na categoria
  const entradas = pratos.filter(prato => prato.category === 'Entradas');
  const yakissobas = pratos.filter(prato => prato.category === 'Yakissoba');
  console.log("MENU DEBUG: 7. Entradas para mapear:", entradas); // DEBUG 7
  console.log("MENU DEBUG: 8. Yakissobas para mapear:", yakissobas); // DEBUG 8

  if (loading) {
    console.log("MENU DEBUG: 9. Exibindo estado de Carregamento."); // DEBUG 9
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Carregando cardápio...
      </div>
    );
  }

  if (error) {
    console.log("MENU DEBUG: 10. Exibindo estado de Erro:", error); // DEBUG 10
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-2xl">
        {error}
      </div>
    );
  }
  
  console.log("MENU DEBUG: 11. Renderizando Cardápio (dados carregados)."); // DEBUG 11

  return (
    <>
      <div className="flex flex-col">
        <h1 className="flex justify-center text-5xl font-bold pt-24 font-['Montserrat'] uppercase">
          conheça nossos pratos irresistíveis
        </h1>
        <p className="flex text-center justify-center text-white text-2xl font-semibold font-['Montserrat'] pt-5">
          Descubra os sabores autênticos da culinária chinesa. Cada prato é uma viagem <br />
          ao Oriente, combinando tradição, equilíbrio e sabor em cada detalhe.
        </p>
      </div>

      <section>
        <h3 className="flex justify-center text-white text-3xl font-bold font-['Montserrat'] uppercase pt-20">
          entradas
        </h3>
        <div className="flex justify-center gap-14 pt-10 flex-wrap">
          {entradas.length === 0 && !loading && !error ? ( // Mensagem se não houver entradas e não estiver carregando/erro
            <p className="text-xl text-gray-400">Nenhuma entrada encontrada.</p>
          ) : (
            entradas.map((prato) => (
              <CardPrato
                key={prato.id}
                prato={prato} // Passa o objeto 'prato' completo, que já foi ajustado
              />
            ))
          )}
        </div>
      </section>

      <section>
        <h3 className="flex justify-center text-white text-3xl font-bold font-['Montserrat'] uppercase pt-20">
          yakissobas
        </h3>
        <div className="flex justify-center gap-14 pt-10 flex-wrap">
          {yakissobas.length === 0 && !loading && !error ? ( // Mensagem se não houver yakissobas
            <p className="text-xl text-gray-400">Nenhum yakissoba encontrado.</p>
          ) : (
            yakissobas.map((prato) => (
              <CardPrato
                key={prato.id}
                prato={prato}
              />
            ))
          )}
        </div>
      </section>

      <Footer />
    

           <button className="fixed bottom-6 right-6 bg-white hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition duration-300 z-50">
        <a href="/Carrinho">🛒</a>
      </button>
</>
  );
}

export default Menu;