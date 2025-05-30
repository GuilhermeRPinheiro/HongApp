import guioza from '../assets/Guioza_Porco.svg'
import rolinho from '../assets/Rolinho_Primavera.svg'
import shimeji from '../assets/Shimeji_Manteiga.svg'
import Yaki_Camarao from '../assets/Yaki_Camarao.svg'
import Yaki_Porco from '../assets/Yaki_Porco.svg'
import Yaki_Vegetariano from '../assets/Yaki_Vegetariano.svg'


function Menu(){
    return(
        <>
        <div className="flex flex-col">
        <h1 className="flex justify-center text-5xl font-bold pt-24 font-['Montserrat'] uppercase">conheça nossos pratos irresistíveis</h1>
        <p className="flex text-center justify-center text-white text-2xl font-semibold font-['Montserrat'] pt-5">Descubra os sabores autênticos da culinária chinesa. Cada prato é uma viagem <br /> ao Oriente, combinando tradição, equilíbrio e sabor em cada detalhe.</p>
        </div>

        <section>
            <h3 className="flex justify-center text-white text-3xl font-bold font-['Montserrat'] uppercase pt-20">entradas</h3> 

            <div className="flex justify-center gap-14 pt-10">

                <div className="w-80 h-94 bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.75)]">
                    <div className='flex justify-center items-center pt-4'>
                        <img src={guioza} alt="" className='w-50 h-50'/>    
                    </div>
                    <div className="pl-4">
                        <h3 className="h-6 justify-start text-black text-xl font-extrabold font-['Montserrat']">Guioza de Porco (7 unid)</h3>
                        <p className="w-72 h-11 justify-start text-black text-base font-normal font-['Sawarabi_Gothic'] pt-2">Pastéis japoneses recheados, crocantes e suculentos por dentro.</p>
                    </div>
                    <div className="pt-[1.5rem] pl-2.5 flex justify-around">
                        <p className="text-black text-base font-bold font-['Montserrat'] pt-3">Preço: R$ 24,90</p>
                        <button className="w-32 h-12 bg-red-600 rounded-[20px]"><a href="" className="w-24 h-4 justify-start text-white text-base font-semibold font-['Inter']">Pedir Agora</a></button>
                    </div>
                </div>

                <div className="w-80 h-94 bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.75)]">
                    <div className='flex justify-center items-center pt-4'>
                        <img src={rolinho} alt="" className='w-50 h-50'/>    
                    </div>
                    <div className="pl-4">
                        <h3 className="h-6 justify-start text-black text-xl font-extrabold font-['Montserrat']">Rolinho Primavera (5 unid)</h3>
                        <p className="w-72 h-11 justify-start text-black text-base font-normal font-['Sawarabi_Gothic'] pt-2">Clássico recheado com legumes, servido com molho agridoce.</p>
                    </div>
                    <div className="pt-[1.5rem] pl-2.5 flex justify-around">
                        <p className="text-black text-base font-bold font-['Montserrat'] pt-3">Preço: R$ 19,90</p>
                        <button className="w-32 h-12 bg-red-600 rounded-[20px]"><a href="" className="w-24 h-4 justify-start text-white text-base font-semibold font-['Inter']">Pedir Agora</a></button>
                    </div>
                </div>

                <div className="w-80 h-94 bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.75)]">
                    <div className='flex justify-center items-center pt-4'>
                        <img src={shimeji} alt="" className='w-50 h-50'/>    
                    </div>
                    <div className="pl-4">
                        <h3 className="h-6 justify-start text-black text-xl font-extrabold font-['Montserrat']">Shimeji na Manteiga</h3>
                        <p className="w-72 h-11 justify-start text-black text-base font-normal font-['Sawarabi_Gothic'] pt-2">Delicioso cogumelo shimeji salteado na manteiga com um toque de shoyu.</p>
                    </div>
                    <div className="pt-[1.5rem] pl-2.5 flex justify-around">
                        <p className="text-black text-base font-bold font-['Montserrat'] pt-3">Preço: R$ 27,90</p>
                        <button className="w-32 h-12 bg-red-600 rounded-[20px]"><a href="" className="w-24 h-4 justify-start text-white text-base font-semibold font-['Inter']">Pedir Agora</a></button>
                    </div>
                </div>
            </div>

        </section>

        <section>
            <h3 className="flex justify-center text-white text-3xl font-bold font-['Montserrat'] uppercase pt-20">yakissobas</h3> 

            <div className="flex justify-center gap-14 pt-10">

                <div className="w-80 h-94 bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.75)]">
                    <div className='flex justify-center items-center pt-4'>
                        <img src={Yaki_Camarao} alt="" className='w-50 h-50'/>    
                    </div>
                    <div className="pl-4">
                        <h3 className="h-6 justify-start text-black text-xl font-extrabold font-['Montserrat']">Yakissoba de Camarão</h3>
                        <p className="w-72 h-11 justify-start text-black text-base font-normal font-['Sawarabi_Gothic'] pt-2">Camarões salteados com legumes frescos e molho oriental.</p>
                    </div>
                    <div className="pt-[1.5rem] pl-2.5 flex justify-around">
                        <p className="text-black text-base font-bold font-['Montserrat'] pt-3">Preço: R$ 39,90</p>
                        <button className="w-32 h-12 bg-red-600 rounded-[20px]"><a href="" className="w-24 h-4 justify-start text-white text-base font-semibold font-['Inter']">Pedir Agora</a></button>
                    </div>
                </div>

                <div className="w-80 h-94 bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.75)]">
                    <div className='flex justify-center items-center pt-4'>
                        <img src={Yaki_Vegetariano} alt="" className='w-50 h-50'/>    
                    </div>
                    <div className="pl-4">
                        <h3 className="h-6 justify-start text-black text-xl font-extrabold font-['Montserrat']">Yakissoba Vegetariano</h3>
                        <p className="w-72 h-11 justify-start text-black text-base font-normal font-['Sawarabi_Gothic'] pt-2">Legumes temperados com molho 100%
vegetal.</p>
                    </div>
                    <div className="pt-[1.5rem] pl-2.5 flex justify-around">
                        <p className="text-black text-base font-bold font-['Montserrat'] pt-3">Preço: R$ 32,90</p>
                        <button className="w-32 h-12 bg-red-600 rounded-[20px]"><a href="" className="w-24 h-4 justify-start text-white text-base font-semibold font-['Inter']">Pedir Agora</a></button>
                    </div>
                </div>

                <div className="w-80 h-94 bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.75)]">
                    <div className='flex justify-center items-center pt-4'>
                        <img src={Yaki_Porco} alt="" className='w-50 h-50'/>    
                    </div>
                    <div className="pl-4">
                        <h3 className="h-6 justify-start text-black text-xl font-extrabold font-['Montserrat']">Yakissoba de Porco</h3>
                        <p className="w-72 h-11 justify-start text-black text-base font-normal font-['Sawarabi_Gothic'] pt-2">Barriga de porco caramelizada com molho picante.</p>
                    </div>
                    <div className="pt-[1.5rem] pl-2.5 flex justify-around">
                        <p className="text-black text-base font-bold font-['Montserrat'] pt-3">Preço: R$ 42,90</p>
                        <button className="w-32 h-12 bg-red-600 rounded-[20px]"><a href="" className="w-24 h-4 justify-start text-white text-base font-semibold font-['Inter']">Pedir Agora</a></button>
                    </div>
                </div>
            </div>

        </section>


        </>
    )
}

export default Menu