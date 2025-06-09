// src/pages/CriarPrato.jsx
import React, { useState } from 'react'; // <--- AQUI ESTÁ A CORREÇÃO!
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2'; // Adicione o SweetAlert para mensagens mais amigáveis

function CriarPrato() {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '', // Mantemos como string no estado inicial para o input
    category: '',
    imagem: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Início das Modificações para o Preço ---

    // 1. Converte o preço para string para garantir o método replace
    // 2. Substitui vírgulas por pontos, caso o usuário digite "12,50"
    // 3. Converte a string resultante para um número decimal
    const precoNumerico = parseFloat(form.preco.toString().replace(',', '.'));

    // Validação: Verifica se o resultado é um número válido.
    if (isNaN(precoNumerico)) {
      Swal.fire('Erro', 'Por favor, insira um preço numérico válido. Use ponto ou vírgula para decimais.', 'error');
      return; // Interrompe a execução se o preço não for válido
    }

    // Cria um novo objeto `form` com o preço já como número
    const formDataToSend = {
      ...form,
      preco: precoNumerico // Aqui o 'preco' é um número decimal
    };

    // --- Fim das Modificações para o Preço ---

    try {
      const response = await fetch('http://localhost:3000/pratos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataToSend) // Envia o novo objeto com o preço convertido
      });

      if (!response.ok) {
        // Tenta ler a mensagem de erro do backend, se disponível
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar prato');
      }

      Swal.fire('Sucesso!', 'Prato criado com sucesso!', 'success');
      navigate('/cardapio');

    } catch (err) {
      console.error("Erro ao criar prato:", err); // Para debug
      Swal.fire('Erro!', 'Não foi possível criar o prato: ' + err.message, 'error');
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded shadow-md text-black">
        <h2 className="text-2xl font-bold mb-4">Criar Novo Prato</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome} // Adicione o value para controle do estado
            onChange={handleChange}
            required
            className='border p-1 rounded-[0.3rem]'
          />
          <textarea
            name="descricao"
            placeholder="Descrição"
            value={form.descricao} // Adicione o value
            onChange={handleChange}
            required
            className='border p-1 rounded-[0.3rem]'
          />
          <input
            type="number"
            name="preco"
            placeholder="Preço"
            value={form.preco} // Adicione o value
            onChange={handleChange}
            step="0.01" // <--- ADIÇÃO CRÍTICA AQUI! Permite decimais
            required
            className='border p-1 rounded-[0.3rem]'
          />
          <input
            type="text"
            name="category"
            placeholder="Categoria (Ex: Yakissoba)"
            value={form.category} // Adicione o value
            onChange={handleChange}
            required
            className='border p-1 rounded-[0.3rem]'
          />
          <input
            type="text"
            name="imagem"
            placeholder="URL da imagem"
            value={form.imagem} // Adicione o value
            onChange={handleChange}
            className='border p-1 rounded-[0.3rem]'
          />
          <button type="submit" className="bg-red-600 text-white p-2 rounded">Salvar Prato</button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default CriarPrato;