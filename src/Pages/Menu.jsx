import guioza from '../assets/Guioza_Porco.svg';
import rolinho from '../assets/Rolinho_Primavera.svg';
import shimeji from '../assets/Shimeji_Manteiga.svg';
import Yaki_Camarao from '../assets/Yaki_Camarao.svg';
import Yaki_Porco from '../assets/Yaki_Porco.svg';
import Yaki_Vegetariano from '../assets/Yaki_Vegetariano.svg';

import CardPrato from '../components/CardPrato';
import Footer from '../Components/Footer';

function Menu() {
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
          <CardPrato
            nome="Guioza de Porco (7 unid)"
            preco={24.9}
            imagem={guioza}
            descricao="Pastéis japoneses recheados, crocantes e suculentos por dentro."
          />
          <CardPrato
            nome="Rolinho Primavera (5 unid)"
            preco={19.9}
            imagem={rolinho}
            descricao="Clássico recheado com legumes, servido com molho agridoce."
          />
          <CardPrato
            nome="Shimeji na Manteiga"
            preco={27.9}
            imagem={shimeji}
            descricao="Delicioso cogumelo shimeji salteado na manteiga com um toque de shoyu."
          />
        </div>
      </section>

      
      <section>
        <h3 className="flex justify-center text-white text-3xl font-bold font-['Montserrat'] uppercase pt-20">
          yakissobas
        </h3>

        <div className="flex justify-center gap-14 pt-10 flex-wrap">
          <CardPrato
            nome="Yakissoba de Camarão"
            preco={39.9}
            imagem={Yaki_Camarao}
            descricao="Camarões salteados com legumes frescos e molho oriental."
          />
          <CardPrato
            nome="Yakissoba Vegetariano"
            preco={32.9}
            imagem={Yaki_Vegetariano}
            descricao="Legumes temperados com molho 100% vegetal."
          />
          <CardPrato
            nome="Yakissoba de Porco"
            preco={42.9}
            imagem={Yaki_Porco}
            descricao="Barriga de porco caramelizada com molho picante."
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Menu;
