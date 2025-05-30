import FooterLogo from '../assets/Hong_Footer.svg'
import Insta from '../assets/insta_icon.svg'
import Face from '../assets/facebook_icon.svg'
import Whats from '../assets/whatsapp_icon.svg'

function Footer(){
    return(
        <>
        <footer className="flex flex-col items-center mt-48 gap-5  ">
            <div className="bg-white w-[80.438rem] h-[0.1rem]  mb-8"> </div>
            <div className="flex flex-col items-center">
                <img className='w-[16.625rem] h-[16.625rem]' src={FooterLogo}/>
                <p className="font-['Sawarabi_Gothic'] text-[1.7rem] w-[38.5rem] text-center ">
                    Rua das Palmeiras, 123 - Centro São Paulo - SP
                    Atendimento: 11h ás 23h | Todos os dias<br/>
                    (11) 1234-5678 contato@honglong.com.br
                </p>
                <div className="flex gap-7 mt-10 mb-8">
                    <a href="">
                        <img src={Insta}/>
                    </a>
                    <a href="">
                        <img src={Face}/>
                    </a>
                    <a href="">
                        <img src={Whats}/>
                    </a>
                </div>
                <h5 className="mb-10">© 2025 Hong Lóng. Todos os direitos reservados.</h5>
            </div>
        </footer>

        </>
    )
}




export default Footer 