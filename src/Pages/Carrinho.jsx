import React from 'react';
import { useCart } from '../contexts/CartContext'; // Importa SEU hook useCart
import { Link } from 'react-router-dom';

function Carrinho() {
  const { cartItems, addToCart, updateQuantity, removeFromCart, getCartItemCount, getCartTotal, clearCart } = useCart();

  return (
    <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
      <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Seu Pedido</h2>

      {cartItems.length === 0 ? (
        <div className="text-xl text-white font-['Montserrat'] flex flex-col items-center ">
          <p className='font-["Montserrat"]'>Seu carrinho está vazio.</p>
          <Link to="/cardapio" className="text-black hover:underline mt-4 block text-center">
            Voltar ao Cardápio para adicionar itens
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center bg-[#D31D1D] p-4 rounded-t-lg mb-2">
            <span className="flex-1 font-bold text-lg">Item</span>
            <span className="w-24 text-center font-bold text-lg">Preço</span>
            <span className="w-32 text-center font-bold text-lg">Qtd.</span>
            <span className="w-24 text-center font-bold text-lg">Subtotal</span>
            <span className="w-16"></span>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-[#D31D1D] p-4 border-b border-gray-700">
              <div className="flex items-center flex-1 pr-2">
                <img src={item.imageURL} alt={item.name} className="w-16 h-16 rounded-lg mr-4 object-cover" />
                <div>
                  <h4 className="text-xl font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-400 line-clamp-1">{item.description}</p>
                </div>
              </div>
              <span className="w-24 text-center text-lg">R$ {item.price.toFixed(2)}</span>
              <div className="w-32 flex items-center justify-center gap-2">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md "
                >
                  -
                </button>
                <span className="text-xl font-bold">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-[#f16c1d]  text-white p-2 rounded-md "
                >
                  +
                </button>
              </div>
              <span className="w-24 text-center text-lg">R$ {(item.price * item.quantity).toFixed(2)}</span>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="w-25 bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-md ml-2"
              >
                Remover
              </button>
            </div>
          ))}

          <div className="mt-8 bg-[#D31D1D] p-6 rounded-lg shadow-lg">
            <div className="flex justify-between text-2xl font-bold mb-4">
              <span>Total de Itens:</span>
              <span>{getCartItemCount()}</span>
            </div>
            <div className="flex justify-between text-3xl font-extrabold text-orange">
              <span>Valor Total:</span>
              <span>R$ {getCartTotal().toFixed(2)}</span>
            </div>
            <button 
              onClick={clearCart}
              className="w-full mt-4 bg-[#f16c1d] hover:bg-yellow-700 text-white text-xl font-bold py-3 rounded-lg transition duration-300"
            >
              Limpar Carrinho
            </button>
            <button className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-3 rounded-lg transition duration-300">
              Finalizar Pedido
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link to="/cardapio" className="text-red-500 hover:underline text-lg">
              Continuar Comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrinho;