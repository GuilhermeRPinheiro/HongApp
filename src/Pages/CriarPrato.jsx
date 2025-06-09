import { useState } from 'react' 
import { useNavigate } from 'react-router-dom' 
import Footer from '../Components/Footer'
import Swal from 'sweetalert2' 

function CriarPrato() {
  // Define o estado do formulário usando useState
  // Cada propriedade corresponde a um campo do formulário de criação de prato
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '', // Mantido como string inicialmente, será convertido antes do envio
    category: '',
    imagem: ''
  })

  const navigate = useNavigate() // Instancia o hook de navegação

  // Função 'handleChange' é chamada toda vez que o valor de um campo do formulário muda
  const handleChange = (e) => {
    // Desestrutura name (nome do campo) e value (novo valor do campo) do evento
    const { name, value } = e.target
    // Atualiza o estado 'form', mantendo os outros campos e atualizando apenas o campo que mudou
    setForm({ ...form, [name]: value })
  }

  // Função 'handleSubmit' é chamada quando o formulário é submetido
  const handleSubmit = async (e) => {
    e.preventDefault() // Previne o comportamento padrão do formulário de recarregar a página

    // Converte o preço de string para número decimal
    // 1. 'form.preco.toString()': Garante que o valor é uma string
    // 2. '.replace(',', '.')': Substitui vírgulas por pontos (para tratar entradas como "12,50")
    // 3. 'parseFloat()': Converte a string resultante para um número de ponto flutuante
    const precoNumerico = parseFloat(form.preco.toString().replace(',', '.'))

    // Validação: Verifica se o resultado da conversão do preço é um número válido (não é NaN - Not-a-Number)
    if (isNaN(precoNumerico)) {
      // Se não for um número válido, exibe um alerta de erro ao usuário usando SweetAlert2
      Swal.fire('Erro', 'Por favor, insira um preço numérico válido. Use ponto ou vírgula para decimais.', 'error')
      return // Interrompe a execução da função de submissão
    }

    // Cria um novo objeto 'formDataToSend' que inclui todos os dados do formulário
    // e substitui o 'preco' original (string) pelo 'precoNumerico' (número decimal)
    const formDataToSend = {
      ...form,
      preco: precoNumerico
    }

    try {
      // Faz uma requisição POST para a API de pratos para criar um novo prato
      const response = await fetch('http://localhost:3000/pratos', {
        method: 'POST', // Define o método da requisição como POST
        headers: { 'Content-Type': 'application/json' }, // Define o cabeçalho Content-Type como JSON
        body: JSON.stringify(formDataToSend) // Converte o objeto de dados do formulário para uma string JSON e a envia no corpo da requisição
      })

      // Verifica se a resposta da requisição não foi bem-sucedida (status HTTP diferente de 2xx)
      if (!response.ok) {
        // Tenta parsear a mensagem de erro da resposta do backend, se disponível
        const errorData = await response.json()
        // Lança um novo erro com a mensagem do backend ou uma mensagem genérica de erro
        throw new Error(errorData.message || 'Erro ao criar prato')
      }

      // Se a requisição for bem-sucedida, exibe um alerta de sucesso
      Swal.fire('Sucesso!', 'Prato criado com sucesso!', 'success')
      navigate('/cardapio') // Redireciona o usuário para a página do cardápio

    } catch (err) {
      // Se ocorrer um erro durante a requisição ou processamento, loga o erro no console
      console.error("Erro ao criar prato:", err)
      // Exibe um alerta de erro ao usuário usando SweetAlert2
      Swal.fire('Erro!', 'Não foi possível criar o prato: ' + err.message, 'error')
    }
  }

  return (
    <>
      {/* Container principal do formulário, centralizado na tela e com estilo */}
      <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded shadow-md text-black">
        <h2 className="text-2xl font-bold mb-4">Criar Novo Prato</h2>
        {/* Formulário de criação de prato */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo para o Nome do Prato */}
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome} // O valor do input é controlado pelo estado form.nome
            onChange={handleChange} // Chama handleChange em cada mudança
            required // Campo obrigatório
            className='border p-1 rounded-[0.3rem]'
          />
          {/* Campo para a Descrição do Prato (área de texto) */}
          <textarea
            name="descricao"
            placeholder="Descrição"
            value={form.descricao} // O valor do input é controlado pelo estado form.descricao
            onChange={handleChange} // Chama handleChange em cada mudança
            required // Campo obrigatório
            className='border p-1 rounded-[0.3rem]'
          />
          {/* Campo para o Preço do Prato */}
          <input
            type="number" // Define o tipo de input como número
            name="preco"
            placeholder="Preço"
            value={form.preco} // O valor do input é controlado pelo estado form.preco
            onChange={handleChange} // Chama handleChange em cada mudança
            step="0.01" // Permite que o input aceite valores decimais com duas casas após a vírgula/ponto
            required // Campo obrigatório
            className='border p-1 rounded-[0.3rem]'
          />
          {/* Campo para a Categoria do Prato */}
          <input
            type="text"
            name="category"
            placeholder="Categoria (Ex: Yakissoba)"
            value={form.category} // O valor do input é controlado pelo estado form.category
            onChange={handleChange} // Chama handleChange em cada mudança
            required // Campo obrigatório
            className='border p-1 rounded-[0.3rem]'
          />
          {/* Campo para a URL da Imagem do Prato */}
          <input
            type="text"
            name="imagem"
            placeholder="URL da imagem"
            value={form.imagem} // O valor do input é controlado pelo estado form.imagem
            onChange={handleChange} // Chama handleChange em cada mudança
            className='border p-1 rounded-[0.3rem]' // Campo não obrigatório
          />
          {/* Botão para submeter o formulário */}
          <button type="submit" className="bg-red-600 text-white p-2 rounded">Salvar Prato</button>
        </form>
      </div>

      <Footer /> {/* Inclui o componente Footer no final da página */}
    </>
  )
}

export default CriarPrato 