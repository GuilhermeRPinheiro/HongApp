import BotaoPedir from './BotaoPedir';
import { useCart } from '../Contexts/CartContext';

function CardPrato({ prato }) {
 
  const { id, nome, descricao, preco, imagem } = prato;
  
  const { addToCart } = useCart() 

  const handleAddItemToCart = () => {
  
    addToCart({
      id: id,
      name: nome, 
      price: preco,
      imageURL: imagem, 
      description: descricao 
    });
  };

  return (
    <div className="w-80 bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.75)]">
      <div className='flex justify-center items-center pt-4'>
       
        <img src={imagem} alt={nome} className='w-50 h-50' />
      </div>
      <div className="pl-4 pr-4">
      
        <h3 className="text-black text-xl font-extrabold font-['Montserrat']">{nome}</h3>
        <p className="text-black text-base font-normal font-['Sawarabi_Gothic'] pt-2">{descricao}</p>
      </div>
      <div className="pt-6 px-4 pb-4 flex justify-between items-center">
        <p className="text-black text-base font-bold font-['Montserrat']">
        
          Preço: R$ {preco !== undefined && preco !== null ? preco.toFixed(2) : '0.00'} 
        </p>
        <BotaoPedir onClick={handleAddItemToCart} /> 
      </div>
    </div>
  );
}

export default CardPrato