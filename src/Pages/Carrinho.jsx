import { useCart } from '../Contexts/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext' 

function Carrinho() {
  // Desestrutura o hook useCart para obter funções e estados relacionados ao carrinho
  const { cartItems, updateQuantity, removeFromCart, getCartItemCount, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate() // Hook para navegação programática entre rotas
  const { user, isAuthenticated } = useAuth() // Obtém o objeto de usuário e o status de autenticação do AuthContext

  // Função assíncrona para finalizar o pedido
  const handleFinalizarPedido = async () => {
    // Verifica se o carrinho está vazio antes de prosseguir
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.")
      return // Interrompe a função se o carrinho estiver vazio
    }

    // VERIFICA SE HÁ UM USUÁRIO LOGADO PARA CRIAR O PEDIDO
    // Se o usuário não estiver autenticado ou o objeto 'user' não existir/não tiver ID, exibe um alerta
    if (!isAuthenticated || !user || !user.id) {
      alert("Você precisa estar logado para finalizar um pedido.")
      navigate('/login') // Redireciona o usuário para a página de login
      return // Interrompe a função
    }

    // AQUI USAMOS O 'user' REAL DO CONTEXTO DE AUTENTICAÇÃO para construir o objeto do novo pedido
    const novoPedido = {
      userId: user.id, // ID do usuário logado
      userName: user.name, // Nome do usuário logado
      userPhoto: user.profilePicture, // Puxa a profilePicture do usuário logado para o pedido
      totalValue: getCartTotal(), // O valor total do carrinho, calculado pelo hook useCart
      items: cartItems.map(item => ({ // Mapeia os itens do carrinho para o formato desejado para o pedido
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageURL: item.imageURL
      })),
      date: new Date().toISOString(), // Data e hora atual do pedido no formato ISO (universal)
      status: 'confirmado' // Define o status inicial do pedido como 'confirmado'
    }

    try {
      // Faz uma requisição POST para a API de pedidos
      const response = await fetch('http://localhost:3000/pedidos', {
        method: 'POST', // Método HTTP POST para criar um novo recurso
        headers: {
          'Content-Type': 'application/json', // Indica que o corpo da requisição é JSON
        },
        body: JSON.stringify(novoPedido), // Converte o objeto do novo pedido para uma string JSON
      })

      // Se a resposta da API não for bem-sucedida (status não 2xx), lança um erro
      if (!response.ok) {
        throw new Error(`Erro ao finalizar pedido: ${response.statusText}`)
      }

      const pedidoSalvo = await response.json() // Converte a resposta da API (o pedido salvo) para JSON
      console.log('Pedido finalizado com sucesso:', pedidoSalvo) // Loga o pedido salvo para debug

      clearCart() // Limpa o carrinho após o pedido ser finalizado com sucesso
      alert('Pedido finalizado com sucesso! ID do Pedido: ' + pedidoSalvo.id) // Alerta o usuário
      navigate('/relatorios') // Redireciona o usuário para a página de relatórios (ou confirmação)
    } catch (error) {
      console.error('Erro ao finalizar o pedido:', error) // Loga o erro no console
      alert('Houve um erro ao finalizar o pedido. Tente novamente mais tarde.') // Alerta o usuário sobre o erro
    }
  }

  return (
    <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
      <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Seu Pedido</h2>

      {/* Renderização condicional: se o carrinho estiver vazio */}
      {cartItems.length === 0 ? (
        <div className="text-xl text-white font-['Montserrat'] flex flex-col items-center">
          <p className='font-["Montserrat"]'>Seu carrinho está vazio.</p>
          <Link to="/cardapio" className="text-black hover:underline mt-4 block text-center">
            Voltar ao Cardápio para adicionar itens
          </Link>
        </div>
      ) : (
        // Se o carrinho tiver itens, exibe o conteúdo do carrinho
        <div className="w-full max-w-3xl">
          {/* Cabeçalho da tabela do carrinho */}
          <div className="flex justify-between items-center bg-[#D31D1D] p-4 rounded-t-lg mb-2">
            <span className="flex-1 font-bold text-lg">Item</span>
            <span className="w-24 text-center font-bold text-lg">Preço</span>
            <span className="w-32 text-center font-bold text-lg">Qtd.</span>
            <span className="w-24 text-center font-bold text-lg">Subtotal</span>
            <span className="w-16"></span> {/* Coluna vazia para o botão de remover */}
          </div>

          {/* Mapeia e renderiza cada item no carrinho */}
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-[#D31D1D] p-4 border-b">
              <div className="flex items-center flex-1 pr-2">
                <img src={item.imageURL} alt={item.name} className="w-16 h-16 rounded-lg mr-4 object-cover" />
                <div>
                  <h4 className="text-xl font-semibold">{item.name}</h4>
                  <p className="text-sm text-white line-clamp-1">{item.description}</p>
                </div>
              </div>
              <span className="w-24 text-center text-lg">R$ {item.price.toFixed(2)}</span>
              <div className="w-32 flex items-center justify-center gap-2">
                {/* Botão para diminuir a quantidade do item */}
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                >
                  -
                </button>
                <span className="text-xl font-bold">{item.quantity}</span>
                {/* Botão para aumentar a quantidade do item */}
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-[#f16c1d] text-white p-2 rounded-md"
                >
                  +
                </button>
              </div>
              {/* Exibe o subtotal do item (preço * quantidade), formatado para 2 casas decimais */}
              <span className="w-24 text-center text-lg">R$ {(item.price * item.quantity).toFixed(2)}</span>
              {/* Botão para remover o item do carrinho */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="w-25 bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-md ml-2"
              >
                Remover
              </button>
            </div>
          ))}

          {/* Seção de Resumo do Carrinho e Botões de Ação */}
          <div className="mt-8 bg-[#D31D1D] p-6 rounded-lg shadow-lg">
            {/* Exibe o total de itens no carrinho */}
            <div className="flex justify-between text-2xl font-bold mb-4">
              <span>Total de Itens:</span>
              <span>{getCartItemCount()}</span>
            </div>
            {/* Exibe o valor total do carrinho, formatado para 2 casas decimais */}
            <div className="flex justify-between text-3xl font-extrabold text-orange">
              <span>Valor Total:</span>
              <span>R$ {getCartTotal().toFixed(2)}</span>
            </div>
            {/* Botão para limpar todo o carrinho */}
            <button
              onClick={clearCart}
              className="w-full mt-4 bg-[#f16c1d] hover:bg-yellow-700 text-white text-xl font-bold py-3 rounded-lg transition duration-300"
            >
              Limpar Carrinho
            </button>
            {/* Botão para finalizar o pedido, acionando a função handleFinalizarPedido */}
            <button
              onClick={handleFinalizarPedido}
              className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-3 rounded-lg transition duration-300"
            >
              Finalizar Pedido
            </button>
          </div>

          {/* Link para continuar comprando */}
          <div className="mt-8 text-center">
            <Link to="/cardapio" className="text-white hover:underline text-lg">
              Continuar Comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Carrinho