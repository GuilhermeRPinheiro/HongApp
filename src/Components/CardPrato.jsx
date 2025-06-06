// src/Components/CardPrato.jsx
import BotaoPedir from './BotaoPedir';
import { useCart } from '../contexts/CartContext'; // Usando o seu CartContext!

function CardPrato({ prato }) {
  // DESESTRUTURAÇÃO: Usa os nomes das chaves do SEU JSON (id, nome, preco, imagem, descricao)
  const { id, nome, descricao, preco, imagem } = prato;
  
  const { addToCart } = useCart(); // Acessa a função addToCart do SEU contexto

  const handleAddItemToCart = () => {
    // Ao adicionar ao carrinho, passe as propriedades que o SEU CartContext espera.
    // SEU CartContext espera 'id', 'name', 'price', 'imageURL', 'description'.
    // Mapeamos os nomes do JSON para os nomes que o CartContext espera.
    addToCart({
      id: id,
      name: nome, // <--- mapeando 'nome' do JSON para 'name' no carrinho
      price: preco, // <--- 'preco' já é numérico graças ao Menu.jsx
      imageURL: imagem, // <--- mapeando 'imagem' do JSON para 'imageURL' no carrinho
      description: descricao // <--- mapeando 'descricao' do JSON para 'description' no carrinho
    });
  };

  return (
    <div className="w-80 bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.75)]">
      <div className='flex justify-center items-center pt-4'>
        {/* Usa as propriedades do SEU JSON */}
        <img src={imagem} alt={nome} className='w-50 h-50' />
      </div>
      <div className="pl-4 pr-4">
        {/* Usa as propriedades do SEU JSON */}
        <h3 className="text-black text-xl font-extrabold font-['Montserrat']">{nome}</h3>
        <p className="text-black text-base font-normal font-['Sawarabi_Gothic'] pt-2">{descricao}</p>
      </div>
      <div className="pt-6 px-4 pb-4 flex justify-between items-center">
        <p className="text-black text-base font-bold font-['Montserrat']">
          {/* Usa a propriedade 'preco' que já deve ser numérica */}
          Preço: R$ {preco !== undefined && preco !== null ? preco.toFixed(2) : '0.00'} 
        </p>
        <BotaoPedir onClick={handleAddItemToCart} /> 
      </div>
    </div>
  );
}

export default CardPrato;