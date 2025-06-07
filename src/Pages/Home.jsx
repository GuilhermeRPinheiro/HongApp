import React from 'react'; // Certifique-se de importar React
import Moto from '../assets/Motoqueiro-Home.svg';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import noodles from '../assets/chinese-food.svg';
import chart from '../assets/chart.svg';
import house from '../assets/house.svg';
import Footer from '../Components/Footer';
import { useAuth } from '../Contexts/AuthContext'; // Importe o useAuth

function Home() {
  const { isAuthenticated } = useAuth(); // Obtenha o status de autenticação do contexto

  return (
    <>
      <section className='flex items-center justify-center pt-20'>
        <div className='flex flex-col items-start gap-12'>
          <h2 className="md:text-[2.813rem] font-bold font-['Montserrat'] md:w-[41.563rem]">
            O sabor da tradição, com a velocidade do dragão
          </h2>
          <p className="font-['Sawarabi_Gothic'] md:text-[1.625rem] md:w-[40.125rem] md:h-[7.125rem] ">
            No Hong Long, a comida chinesa chega quente, fresca e com o toque especial da nossa cultura. Rápido, delicioso e inesquecível — direto na sua porta.
          </p>
          {/* BOTÃO PARA TELAS MAIORES - SÓ APARECE SE NÃO ESTIVER AUTENTICADO */}
          {!isAuthenticated && (
            <Button className="hidden md:inline-flex text-[#DF2828] bg-white w-[16.25rem] h-[4.25rem] text-3xl font['Sawarabi_Gothic'] " as={Link} to='/login'>
              Fazer Login
            </Button>
          )}
        </div>
        <img src={Moto} className=''/>
        {/* BOTÃO PARA TELAS PEQUENAS - SÓ APARECE SE NÃO ESTIVER AUTENTICADO */}
        {!isAuthenticated && (
          <Button className='md:hidden' as={Link} to='/login'>
            Login
          </Button>
        )}
      </section>
      <div className='flex flex-col items-center justify-center gap-6 mt-20'>
        <h2 className="text-5xl font-['Montserrat'] font-bold ">Simples, rápido e saboroso!</h2>

        <div className='flex items-center p-20 gap-10 '>

          <div className=' p-10 w-[23rem] h-[30.063rem] bg-white items-center flex flex-col rounded-4xl gap-4'>
            <img className='w-[10.188rem] h-[10.188rem]' src={noodles}/>
            <h3 className=" w-96 text-[2rem] font-extrabold font-['Montserrat] text-black  text-center">Escolha seu prato</h3>
            <p className="font-['Sawarabi_Gothic'] text-[1.25rem]  text-black mt-9"  >
              Navegue pelo nosso cardápio e escolha os pratos que mais lhe chamarem atenção!
            </p>
          </div>

          <div className='p-10 card w-[23rem] h-[30.063rem]  bg-white items-center flex flex-col rounded-4xl text-center gap-2 '>
            <img className='w-[10.188rem] h-[10.188rem]' src ={chart}/>
            <h3 className="text-[2rem] font-extrabold font-['Montserrat] text-black text-center  h-[]">Peça com poucos cliques</h3>
            <p className="font-['Sawarabi_Gothic'] text-[1.25rem]  text-black mt-2.5">
              Pedido feito de forma descomplicada e rápida!
            </p>
          </div>

          <div className='p-10 card w-[23rem] h-[30.063rem]  bg-white items-center flex flex-col rounded-4xl gap-2'>
            <img className='w-[10.188rem] h-[10.188rem]'  src={house}/>
            <h3 className="text-[2rem] font-extrabold font-['Montserrat] text-black  text-center">Receba e aproveite</h3>
            <p  className="font-['Sawarabi_Gothic'] text-[1.25rem] text-black mt-2.5">
              Delivery rápido e embalado com carinho.
            </p>
          </div>

        </div>
        <Button className="w-[17.813rem] h-[5.313rem] bg-white text-[#DF2828] font-['Sawarabi_Gothic'] text-2xl mb-10" as={Link} to ="/cardapio">
          Olhar Cardápio
        </Button>
      </div>

      <Footer/>
    </>
  );
}

export default Home;