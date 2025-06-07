// src/pages/CriarPrato.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';

function CriarPrato() {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    imagem: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/pratos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Erro ao criar prato');

      alert('Prato criado com sucesso!');
      navigate('/cardapio');

    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded shadow-md text-black">
        <h2 className="text-2xl font-bold mb-4">Criar Novo Prato</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required className='border p-1 rounded-[0.3rem]'/>
          <textarea name="descricao" placeholder="Descrição" onChange={handleChange} required className='border p-1 rounded-[0.3rem]'/>
          <input type="number" name="preco" placeholder="Preço" onChange={handleChange} required className='border p-1 rounded-[0.3rem]'/>
          <input type="text" name="categoria" placeholder="Categoria (Ex: Yakissoba)" onChange={handleChange} required className='border p-1 rounded-[0.3rem]' />
          <input type="text" name="imagem" placeholder="URL da imagem" onChange={handleChange} className='border p-1 rounded-[0.3rem]'/>
          <button type="submit" className="bg-red-600 text-white p-2 rounded">Salvar Prato</button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default CriarPrato;
