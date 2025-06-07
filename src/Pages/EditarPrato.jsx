// src/pages/EditarPrato.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Footer from '../Components/Footer';

function EditarPrato() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prato, setPrato] = useState(null);

  useEffect(() => {
    async function fetchPrato() {
      try {
        const res = await fetch(`http://localhost:3000/pratos/${id}`);
        if (!res.ok) throw new Error('Erro ao carregar prato');
        const data = await res.json();
        setPrato(data);
      } catch (err) {
        console.error(err);
        Swal.fire('Erro', 'Não foi possível carregar os dados do prato', 'error');
      }
    }

    fetchPrato();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrato({ ...prato, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/pratos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prato)
      });

      if (!res.ok) throw new Error('Erro ao atualizar prato');

      Swal.fire('Sucesso', 'Prato atualizado com sucesso', 'success');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      Swal.fire('Erro', 'Não foi possível atualizar o prato', 'error');
    }
  };

  if (!prato) {
    return <div className="text-white text-center mt-10">Carregando prato...</div>;
  }

  return (
    <>
      <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded shadow-md text-black">
        <h2 className="text-2xl font-bold mb-4">Editar Prato</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nome"
            value={prato.nome}
            onChange={handleChange}
            placeholder="Nome"
            required
            className="border p-1 rounded-[0.3rem]"
          />
          <textarea
            name="descricao"
            value={prato.descricao}
            onChange={handleChange}
            placeholder="Descrição"
            required
            className="border p-1 rounded-[0.3rem]"
          />
          <input
            type="number"
            name="preco"
            value={prato.preco}
            onChange={handleChange}
            placeholder="Preço"
            required
            className="border p-1 rounded-[0.3rem]"
          />
          <input
            type="text"
            name="category"
            value={prato.category}
            onChange={handleChange}
            placeholder="Categoria (Ex: Yakissoba)"
            required
            className="border p-1 rounded-[0.3rem]"
          />
          <input
            type="text"
            name="imagem"
            value={prato.imagem}
            onChange={handleChange}
            placeholder="URL da imagem"
            className="border p-1 rounded-[0.3rem]"
          />
          <button type="submit" className="bg-green-600 text-white p-2 rounded">
            Salvar Alterações
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default EditarPrato;
