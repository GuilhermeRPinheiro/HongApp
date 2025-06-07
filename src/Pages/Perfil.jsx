// src/Pages/Perfil.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function PerfilPage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  // Estados para todos os campos do usuário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Adicionado: para a senha
  const [adress, setAdress] = useState('');
  // role e id serão exibidos, mas não terão estado mutável aqui
  const [profilePicture, setProfilePicture] = useState('');

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Redireciona se não estiver autenticado após a carga inicial
  useEffect(() => {
    if (!isAuthenticated && initialLoadComplete) {
      navigate('/login');
    }
  }, [isAuthenticated, initialLoadComplete, navigate]);

  // Carrega os dados do usuário quando o componente monta ou o usuário muda
  useEffect(() => {
    if (user) {
      setNome(user.name || '');
      setEmail(user.email || '');
      setPassword(user.password || ''); // Carrega a senha
      setAdress(user.adress || '');
      setProfilePicture(user.profilePicture || '');
      setInitialLoadComplete(true);
    } else if (!isAuthenticated && !initialLoadComplete) {
      // Caso o user seja null e não esteja autenticado, mas o carregamento não terminou
      setInitialLoadComplete(true);
    }
  }, [user, isAuthenticated, initialLoadComplete]);

  // Função para lidar com a seleção da imagem (pede uma URL)
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Captura o evento do input type="file"
    if (file) {
      Swal.fire({
        title: 'Atualizar Imagem de Perfil',
        input: 'text',
        inputLabel: 'Cole a URL da nova imagem de perfil:',
        inputPlaceholder: 'Ex: /images/UserX.png ou https://example.com/image.jpg',
        showCancelButton: true,
        confirmButtonText: 'Salvar Imagem',
        showLoaderOnConfirm: true,
        preConfirm: (url) => {
          if (!url) {
            Swal.showValidationMessage('A URL da imagem não pode ser vazia.');
          }
          return url;
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          setProfilePicture(result.value);
          Swal.fire('Imagem Atualizada!', 'A nova URL da imagem foi salva. Clique em "Salvar Alterações" para aplicar.', 'success');
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);

    // Cria o objeto com os dados atualizados para enviar
    const updatedUserData = {
      name: nome,
      email: email,
      password: password, // Inclui a senha para atualização
      adress: adress,
      profilePicture: profilePicture,
      // role e id não são alterados pelo usuário aqui, mas são parte do objeto original
      role: user.role, // Mantém o role original
      id: user.id // Mantém o ID original
    };

    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT', // Use PUT para substituir o objeto completo (ou PATCH para apenas os campos alterados)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        throw new Error(`Falha ao atualizar perfil: ${response.statusText}`);
      }

      const data = await response.json();
      updateUser(data); // ATUALIZA O CONTEXTO COM OS NOVOS DADOS

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Perfil atualizado com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Não foi possível atualizar o perfil: ${err.message}`
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (!isAuthenticated && !initialLoadComplete) {
    return <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">Carregando perfil...</div>;
  }

  if (!isAuthenticated) {
    return null; // O useEffect de redirecionamento já cuida disso
  }

  return (
    <div className="pt-10 p-5 flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
      <h2 className="text-5xl font-bold mb-8 font-['Montserrat'] text-center uppercase">Editar Perfil</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#A62C2C] p-6 rounded-lg shadow-lg text-white">
        {/* Seção de Foto de Perfil */}
        <div className="mb-4 flex flex-col items-center">
          <img
            src={profilePicture || 'https://via.placeholder.com/100/cccccc/FFFFFF?text=Sem+Foto'}
            alt="Foto de Perfil"
            className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-white"
          />
          <label htmlFor="profilePictureInput" className="cursor-pointer bg-[#f16c1d] hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Alterar Foto
          </label>
          <input
            id="profilePictureInput"
            type="file" // Type file para ativar o clique do label
            accept="image/*"
            className="hidden" // Esconde o input file padrão
            onChange={handleImageChange}
          />
          <p className="text-sm text-gray-200 mt-2">Clique para inserir uma URL de imagem (ex: /images/User1.png).</p>
        </div>

        {/* Campo ID (apenas leitura) */}
        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-bold mb-2">ID do Usuário:</label>
          <input
            type="text"
            id="id"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
            value={user?.id || ''}
            readOnly // Campo somente leitura
          />
        </div>

        {/* Campo Nome */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">Nome:</label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo Senha */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-bold mb-2">Senha:</label>
          <input
            type="password" // Tipo password para esconder o texto
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-gray-300 mt-1">
            Atenção: A senha é armazenada em texto puro no JSON Server para fins de demonstração.
          </p>
        </div>

        {/* Campo Endereço */}
        <div className="mb-6">
          <label htmlFor="adress" className="block text-sm font-bold mb-2">Endereço:</label>
          <input
            type="text"
            id="adress"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
          />
        </div>

        {/* Campo Role (papel - apenas leitura) */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-bold mb-2">Função (Role):</label>
          <input
            type="text"
            id="role"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
            value={user?.role || ''}
            readOnly // Campo somente leitura
          />
        </div>

        {/* Botão Salvar */}
        <button
          type="submit"
          className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
          disabled={loadingUpdate}
        >
          {loadingUpdate ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}

export default PerfilPage;