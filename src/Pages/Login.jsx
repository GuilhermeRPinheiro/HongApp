import Swal from 'sweetalert2'
import { useState } from 'react' // Importe useState do React
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext' // Ajuste o caminho conforme a estrutura do seu projeto

function LoginPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para exibir erros básicos no formulário, se necessário
  const { login, loading } = useAuth(); // Pega a função de login e o estado de carregamento do AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    setError(''); // Limpa qualquer erro anterior

    if (!email || !password) {
      // Usar Swal.fire para campos vazios, substituindo o setError interno aqui
      Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Por favor, preencha todos os campos.",
      });
      return;
    }

    // Chama a função login do AuthContext e espera a resposta
    const success = await login(email, password);

    if (success) {
      // Se o login for bem-sucedido, exibe o pop-up de sucesso
      Swal.fire({
        title: "Sucesso!",
        text: "Login efetuado com sucesso!",
        icon: "success",
        confirmButtonText: "Ok"
      }).then(() => {
        // Redireciona APÓS o usuário fechar o alerta
        navigate('/'); 
      });
    } else {
      // Se o login falhar, exibe o pop-up de erro
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "E-mail ou senha inválidos. Tente novamente.",
        footer: '<a href="/register">Não tem uma conta? Cadastre-se!</a>'
      });
    }
  };

  return(
    <section className="min-h-screen flex flex-col justify-center items-center bg-[#A62C2C]">
      <div className="w-[52.5rem] flex flex-col">
        <div className="w-full text-center bg-[#D5351D] p-8 rounded-tl-4xl">
          <h1 className="text-5xl font-['Montserrat']">Bem-vindo de volta!</h1>
        </div>
        
        {/* Adicione o onSubmit ao seu formulário e remova o `className=""` vazio */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col w-[52.5rem] bg-white h-[26.875rem] items-center gap-6 justify-center rounded-br-4xl ">
            {/* Opcional: exiba o erro do estado aqui se preferir um feedback instantâneo ANTES do Swal */}
            {/* {error && <p className="text-red-500 text-center mb-4">{error}</p>} */}

            <div>
              <input
                required
                type="email"
                placeholder="E-mail"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={email} // Conecta o input ao estado 'email'
                onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
              />
            </div>
            <div>
              <input
                required
                type="password"
                placeholder="Senha"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={password} // Conecta o input ao estado 'password'
                onChange={(e) => setPassword(e.target.value)} // Atualiza o estado ao digitar
              />
              <div className="flex mt-2 ml-3 gap-1 ">
                <span className="text-black">Não possui cadastro? </span>
                <Link to="/register" className="font-extrabold text-black">
                  Cadastre-se!
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              className="cursor-pointer text-white w-[22.875rem] h-[4.136rem] bg-[#D5351D] rounded-4xl"
              disabled={loading} // Desabilita o botão enquanto o login está carregando
            >
              <span className="font-extrabold font-['Montserrat'] text-4xl">
                {loading ? 'Entrando...' : 'Login'} {/* Texto do botão muda durante o carregamento */}
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;