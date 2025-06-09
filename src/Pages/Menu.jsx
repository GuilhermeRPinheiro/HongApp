import { useState, useEffect } from 'react'
import CardPrato from '../Components/CardPrato'
import Footer from '../Components/Footer'


function Menu() {

  // Estados locais para armazenar os dados dos pratos, status de carregamento e erros
  const [pratos, setPratos] = useState([]) // Estado para armazenar a lista de todos os pratos
  const [loading, setLoading] = useState(true) // Estado booleano para indicar se os dados estão sendo carregados
  const [error, setError] = useState(null) // Estado para armazenar mensagens de erro, se ocorrerem


  // Hook useEffect: Responsável por buscar os pratos da API quando o componente é montado
  useEffect(() => {
    async function fetchPratos() {
      console.log("MENU DEBUG: 1. Iniciando fetchPratos...") // DEBUG 1: Início da função de busca
      try {
        setLoading(true) // Inicia o estado de carregamento
        setError(null) // Limpa qualquer erro anterior

        const response = await fetch('http://localhost:3000/pratos') // Faz uma requisição GET para a API de pratos
        console.log("MENU DEBUG: 2. Resposta do fetch:", response) // DEBUG 2: Log da resposta da requisição

        // Verifica se a resposta da API foi bem-sucedida (status 2xx)
        if (!response.ok) {
          const errorText = await response.text() // Tenta obter detalhes do erro da resposta
          throw new Error(`Erro HTTP ao carregar pratos: ${response.status} ${response.statusText}. Detalhes: ${errorText}`)
        }

        const data = await response.json() // Converte a resposta da API para JSON
        console.log("MENU DEBUG: 3. Dados JSON recebidos da API:", data) // DEBUG 3: Log dos dados recebidos

        // Mapeia os dados recebidos para ajustá-los antes de armazenar no estado
        const pratosAjustados = data.map(p => ({
          ...p, // Copia todas as propriedades originais do prato
          preco: parseFloat(p.preco) || 0, // Garante que 'preco' é um número decimal, ou 0 se for inválido
          category: p.category || 'Geral' // Garante que 'category' existe para o filtro, padrão 'Geral'
        }))
        setPratos(pratosAjustados) // Atualiza o estado 'pratos' com os dados ajustados
        console.log("MENU DEBUG: 4. Pratos ajustados e definidos no estado:", pratosAjustados) // DEBUG 4: Log dos pratos ajustados

      } catch (err) {
        console.error("MENU DEBUG: 5. ERRO CAPTURADO EM fetchPratos:", err) // DEBUG 5: Log de qualquer erro capturado
        setError("Não foi possível carregar o cardápio. Verifique a conexão com o servidor.") // Define uma mensagem de erro para o usuário
      } finally {
        setLoading(false) // Finaliza o estado de carregamento, independentemente do resultado
        console.log("MENU DEBUG: 6. fetchPratos finalizado. Loading:", false) // DEBUG 6: Log final do status de carregamento
      }
    }
    fetchPratos() // Chama a função assíncrona para buscar os pratos
  }, []) // O array de dependências vazio garante que este useEffect roda apenas uma vez, na montagem do componente

  // Filtra os pratos carregados em categorias específicas
  const entradas = pratos.filter(prato => prato.category === 'Entradas') // Filtra pratos com categoria 'Entradas'
  const yakissobas = pratos.filter(prato => prato.category === 'Yakissoba') // Filtra pratos com categoria 'Yakissoba'
  console.log("MENU DEBUG: 7. Entradas para mapear:", entradas) // DEBUG 7: Log das entradas filtradas
  console.log("MENU DEBUG: 8. Yakissobas para mapear:", yakissobas) // DEBUG 8: Log dos yakissobas filtrados

  // Renderização condicional baseada no estado de carregamento, erro ou dados
  if (loading) {
    console.log("MENU DEBUG: 9. Exibindo estado de Carregamento.") // DEBUG 9: Log quando o carregamento está ativo
    return (
      // Exibe uma mensagem de carregamento centralizada na tela
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Carregando cardápio...
      </div>
    )
  }

  if (error) {
    console.log("MENU DEBUG: 10. Exibindo estado de Erro:", error) // DEBUG 10: Log quando um erro está ativo
    return (
      // Exibe uma mensagem de erro centralizada na tela, em vermelho
      <div className="flex justify-center items-center h-screen text-red-500 text-2xl">
        {error}
      </div>
    )
  }

  console.log("MENU DEBUG: 11. Renderizando Cardápio (dados carregados).") // DEBUG 11: Log quando o cardápio está sendo renderizado

  return (
    <>
      {/* Título principal e subtítulo da página do cardápio */}
      <div className="flex flex-col">
        <h1 className="flex justify-center text-5xl font-bold pt-24 font-['Montserrat'] uppercase">
          conheça nossos pratos irresistíveis
        </h1>
        <p className="flex text-center justify-center text-white text-2xl font-semibold font-['Montserrat'] pt-5">
          Descubra os sabores autênticos da culinária chinesa. Cada prato é uma viagem <br />
          ao Oriente, combinando tradição, equilíbrio e sabor em cada detalhe.
        </p>
      </div>

      {/* Seção de Entradas */}
      <section>
        <h3 className="flex justify-center text-white text-3xl font-bold font-['Montserrat'] uppercase pt-20">
          entradas
        </h3>
        <div className="flex justify-center gap-14 pt-10 flex-wrap">
          {/* Renderização condicional: Se não houver entradas e não estiver carregando ou em erro */}
          {entradas.length === 0 && !loading && !error ? (
            <p className="text-xl text-gray-400">Nenhuma entrada encontrada.</p>
          ) : (
            // Mapeia e renderiza o componente CardPrato para cada entrada
            entradas.map((prato) => (
              <CardPrato
                key={prato.id} // Chave única para o React otimizar a renderização de listas
                prato={prato} // Passa o objeto 'prato' completo como propriedade para CardPrato
              />
            ))
          )}
        </div>
      </section>

      {/* Seção de Yakissobas */}
      <section>
        <h3 className="flex justify-center text-white text-3xl font-bold font-['Montserrat'] uppercase pt-20">
          yakissobas
        </h3>
        <div className="flex justify-center gap-14 pt-10 flex-wrap">
          {/* Renderização condicional: Se não houver yakissobas e não estiver carregando ou em erro */}
          {yakissobas.length === 0 && !loading && !error ? (
            <p className="text-xl text-gray-400">Nenhum yakissoba encontrado.</p>
          ) : (
            // Mapeia e renderiza o componente CardPrato para cada yakissoba
            yakissobas.map((prato) => (
              <CardPrato
                key={prato.id} // Chave única para otimização do React
                prato={prato} // Passa o objeto 'prato' completo
              />
            ))
          )}
        </div>
      </section>

      <Footer /> {/* Inclui o componente Footer no final da página */}

      {/* Botão flutuante para o carrinho, posicionado no canto inferior direito */}
      <button className="fixed bottom-6 right-6 bg-white hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition duration-300 z-50">
        <a href="/Carrinho">🛒</a> {/* Link simples para a página do carrinho */}
      </button>
    </>
  )
}

export default Menu 