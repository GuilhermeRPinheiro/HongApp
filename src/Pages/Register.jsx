import React, { useState } from 'react'; // Importe useState
import { Link, useNavigate } from 'react-router-dom'; // Importe Link e useNavigate
import Swal from 'sweetalert2'; // Importe SweetAlert2
import { useAuth } from '../contexts/AuthContext'; // Ajuste o caminho para o seu AuthContext

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Novo estado de carregamento para o registro
  const { login } = useAuth(); // Opcional: para logar automaticamente após o registro
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o estado de carregamento
    
    // Validação de campos obrigatórios
    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Por favor, preencha todos os campos.",
      });
      setLoading(false); // Desativa o carregamento em caso de erro
      return;
    }

    // Validação de senhas
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "As senhas digitadas não coincidem.",
      });
      setLoading(false); // Desativa o carregamento em caso de erro
      return;
    }

    try {
      // 1. Verificar se o e-mail já está cadastrado
      const checkResponse = await fetch(`http://localhost:3001/users?email=${email}`);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Erro no Cadastro!",
          text: "Este e-mail já está cadastrado. Tente outro ou faça login.",
        });
        setLoading(false); // Desativa o carregamento
        return;
      }

      // 2. Se o e-mail não existe, registrar o novo usuário
      const response = await fetch('http://localhost:3001/users', { // Garanta que a URL está correta para seu JSON Server
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia todos os dados do formulário, incluindo a role padrão
        body: JSON.stringify({ name, email, phone, address, password, role: 'user' }), 
      });

      if (response.ok) {
        Swal.fire({
          title: "Parabéns!",
          text: "Cadastro realizado com sucesso!",
          icon: "success",
          confirmButtonText: "Ok"
        }).then(async () => {
          // Opcional: Fazer login automático após o registro e redirecionar
          const loggedIn = await login(email, password); // Chama o login do AuthContext
          if (loggedIn) {
            navigate('/'); // Redireciona para a home
          } else {
            navigate('/login'); // Se o login automático falhar, vai para a página de login
          }
        });
      } else {
        // Erro na resposta da API (ex: status 500)
        Swal.fire({
          icon: "error",
          title: "Erro no Cadastro!",
          text: "Não foi possível realizar o cadastro. Tente novamente.",
        });
      }
    } catch (err) {
      console.error("Erro no registro:", err);
      // Erro de conexão
      Swal.fire({
        icon: "error",
        title: "Erro de Conexão!",
        text: "Não foi possível conectar ao servidor. Verifique sua conexão.",
        footer: 'Verifique se o JSON Server está rodando na porta 3001.'
      });
    } finally {
      setLoading(false); // Sempre desativa o carregamento no final, sucesso ou falha
    }
  };

  return(
    <section className="min-h-screen flex flex-col justify-center items-center bg-[#A62C2C]">
      <div className="w-[53.5rem] flex flex-col">
        <div className="w-full text-center bg-[#D5351D] p-8 rounded-tl-4xl">
          <h1 className="text-5xl font-['Montserrat']">Cadastre-se e Peça Já!</h1>
        </div>
        
        {/* Conecte o formulário ao handleSubmit */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col w-[53.5rem] bg-white h-[45.875rem] items-center gap-6 justify-center rounded-br-4xl ">
            <div>
              <input
                required
                type="text"
                placeholder="NOME COMPLETO"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={name} // Conecta ao estado 'name'
                onChange={(e) => setName(e.target.value)} // Atualiza o estado
              />
            </div>
            <div>
              <input
                required
                type="email" // Use type="email" para validação de e-mail do navegador
                placeholder="E-mail"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={email} // Conecta ao estado 'email'
                onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
              />
            </div>
            <div>
              <input
                required
                type="tel" // Use type="tel" para telefones
                placeholder="Telefone"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={phone} // Conecta ao estado 'phone'
                onChange={(e) => setPhone(e.target.value)} // Atualiza o estado
              />
            </div>
            <div>
              <input
                required
                type="text"
                placeholder="Endereço"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={address} // Conecta ao estado 'address'
                onChange={(e) => setAddress(e.target.value)} // Atualiza o estado
              />
            </div>
            <div>
              <input
                required
                type="password"
                placeholder="Senha"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={password} // Conecta ao estado 'password'
                onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
              />
            </div>
            <div>
              <input
                required
                type="password"
                placeholder="Confirmar Senha"
                className="bg-[#FFD8CC] w-[48.125rem] h-[3.884rem] text-black font-['Montserrat'] rounded-4xl p-5 border-none focus:outline-none focus:ring-0"
                value={confirmPassword} // Conecta ao estado 'confirmPassword'
                onChange={(e) => setConfirmPassword(e.target.value)} // Atualiza o estado
              />
            </div>
            
            <button
              type="submit"
              className="cursor-pointer text-white w-[22.875rem] h-[4.136rem] bg-[#D5351D] rounded-4xl"
              disabled={loading} // Desabilita o botão durante o carregamento
            >
              <span className="font-extrabold font-['Montserrat'] text-4xl">
                {loading ? 'Cadastrando...' : 'Cadastrar-se'} {/* Texto do botão muda durante o carregamento */}
              </span>
            </button>
            <div className="flex mt-2 ml-3 gap-1 ">
              <span className="text-black">Já possui cadastro? </span>
              <Link to="/login" className="font-extrabold text-black">
                Faça login!
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;