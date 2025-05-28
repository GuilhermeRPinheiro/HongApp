export default function RegisterPage(){
    return(
        <section className="min-h-screen flex flex-col justify-center items-center bg-[#C83226]">
            <div className="w-[52.5rem] flex flex-col">
                <div className="w-full text-center bg-[#D5351D] p-8 rounded-tl-4xl">
                    <h1 className="text-5xl font-['Montserrat']">Cadastre-se e Peça Já!</h1>
                </div>
                <form className="">
                    <div className="flex flex-col w-[52.5rem] bg-white h-[26.875rem] items-center gap-6 justify-center rounded-br-4xl ">
                        <div>
                            <input type="text" placeholder="NOME COMPLETO" className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5   border-none focus:outline-none focus:ring-0"/>
                        </div>
                        <div>
                            <input type="number" placeholder="Telefone" className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5   border-none focus:outline-none focus:ring-0" />
                        </div>
                        <div>
                            <input type="text" placeholder="Endereço" className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5    border-none focus:outline-none focus:ring-0"/>
                        </div>
                        <button type="submit" className=" cursor-pointer text-white w-[22.875rem] h-[4.136rem] bg-[#D5351D] rounded-4xl">
                            <span className="font-extrabold font-['Montserrat'] text-4xl">Cadastrar-se</span>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}