// src/contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import Swal from 'sweetalert2'; // Para os SweetAlerts

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Inicializa o carrinho com dados do localStorage, se houver
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      console.error("Erro ao carregar carrinho do localStorage:", e);
      return [];
    }
  });

  // Salva o carrinho no localStorage sempre que cartItems muda
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    // Verifica se o item já está no carrinho
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
      // Se o item já existe, aumenta a quantidade
      const updatedCartItems = cartItems.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCartItems);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${item.name} adicionado novamente ao carrinho!`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } else {
      // Se o item é novo, adiciona-o com quantidade 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${item.name} adicionado ao carrinho!`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Item removido do carrinho!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Carrinho limpo!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const cartContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};