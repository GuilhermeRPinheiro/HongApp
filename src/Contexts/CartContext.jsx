import { createContext, useState, useContext, useEffect } from 'react'
import Swal from 'sweetalert2' 

// Cria o contexto do carrinho
export const CartContext = createContext()

// Componente Provedor do Carrinho
// Ele gerencia o estado dos itens no carrinho e expõe funções para manipulá-lo
export const CartProvider = ({ children }) => {
  // Estado para armazenar os itens do carrinho
  // Tenta carregar os itens do localStorage ao inicializar para persistência
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems') // Tenta obter itens do localStorage
      return storedCart ? JSON.parse(storedCart) : [] // Se existirem, faz o parse, senão retorna um array vazio
    } catch (e) {
      console.error("Erro ao carregar carrinho do localStorage:", e) // Loga erros de leitura
      return [] // Em caso de erro, retorna um carrinho vazio
    }
  })

  // Hook useEffect: Persiste o carrinho no localStorage sempre que `cartItems` muda
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems)) // Salva o array de itens como string JSON
  }, [cartItems]) // Dependência: executa sempre que `cartItems` é atualizado

  // Função `addToCart`: Adiciona um item ao carrinho ou aumenta sua quantidade
  const addToCart = (item) => {
    // Verifica se o item já existe no carrinho pelo seu ID
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id)

    // Cria um objeto `itemToAdd` com propriedades padronizadas do item
    // Garante compatibilidade com diferentes nomes de propriedades (ex: 'nome' ou 'name')
    const itemToAdd = {
      id: item.id,
      name: item.nome || item.name,
      price: item.preco || item.price,
      imageURL: item.imagem || item.imageURL,
      description: item.descricao || item.description,
    }

    // Se o item já existe no carrinho
    if (existingItemIndex > -1) {
      // Cria um novo array de itens, aumentando a quantidade do item existente
      const updatedCartItems = cartItems.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + 1 } // Aumenta a quantidade
          : cartItem // Mantém os outros itens inalterados
      )
      setCartItems(updatedCartItems) // Atualiza o estado do carrinho
      // Notifica o usuário que a quantidade do item foi atualizada
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${itemToAdd.name} adicionado novamente ao carrinho!`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })
    } else {
      // Se o item não existe no carrinho, adiciona-o com quantidade 1
      setCartItems([...cartItems, { ...itemToAdd, quantity: 1 }])
      // Notifica o usuário que o item foi adicionado
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${itemToAdd.name} adicionado ao carrinho!`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })
    }
  }

  // Função `removeFromCart`: Remove um item do carrinho pelo seu ID
  const removeFromCart = (itemId) => {
    // Filtra o array, removendo o item com o ID especificado
    setCartItems(cartItems.filter(item => item.id !== itemId))
    // Notifica o usuário que o item foi removido
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Item removido do carrinho!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
  }

  // Função `updateQuantity`: Atualiza a quantidade de um item no carrinho
  const updateQuantity = (itemId, newQuantity) => {
    // Se a nova quantidade for 0 ou menos, remove o item do carrinho
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    // Mapeia o array, atualizando a quantidade do item específico
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  // Função `clearCart`: Esvazia completamente o carrinho
  const clearCart = () => {
    setCartItems([]) // Define o carrinho como um array vazio
    // Notifica o usuário que o carrinho foi limpo
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Carrinho limpo!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
  }

  // Função `getCartTotal`: Calcula o valor total de todos os itens no carrinho
  const getCartTotal = () => {
    // Usa `reduce` para somar (preço * quantidade) de todos os itens
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Função `getCartItemCount`: Calcula o número total de itens (contando as quantidades) no carrinho
  const getCartItemCount = () => {
    // Usa `reduce` para somar a quantidade de todos os itens
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  // Objeto `cartContextValue`: Contém todos os valores e funções que serão expostos pelo contexto
  const cartContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  }

  // Provedor do Contexto: Envolve os componentes filhos e disponibiliza os valores do carrinho
  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  )
}

// Hook personalizado `useCart`: Permite que componentes acessem facilmente os valores do CartContext
export const useCart = () => {
  return useContext(CartContext)
}