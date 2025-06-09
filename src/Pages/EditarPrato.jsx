import { useState, useEffect } from 'react' 
import { useParams, useNavigate } from 'react-router-dom' 
import Swal from 'sweetalert2'
import Footer from '../Components/Footer' 

function EditarPrato() {
  const { id } = useParams() // Obtém o ID do prato a ser editado a partir dos parâmetros da URL
  const navigate = useNavigate() // Hook para navegação programática
  const [prato, setPrato] = useState(null) // Estado para armazenar os dados do prato que será editado

  // Hook useEffect para buscar os dados do prato quando o componente é montado ou o ID muda
  useEffect(() => {
    async function fetchPrato() {
      try {
        // Faz uma requisição GET para buscar os detalhes do prato específico pelo ID
        const res = await fetch(`http://localhost:3000/pratos/${id}`)
        // Se a resposta não for ok, lança um erro
        if (!res.ok) throw new Error('Erro ao carregar prato')
        const data = await res.json() // Converte a resposta para JSON
        setPrato(data) // Atualiza o estado 'prato' com os dados recebidos
      } catch (err) {
        console.error(err) // Loga o erro no console
        // Exibe um alerta de erro ao usuário caso não consiga carregar o prato
        Swal.fire('Erro', 'Não foi possível carregar os dados do prato', 'error')
      }
    }

    fetchPrato() // Chama a função para buscar o prato
  }, [id]) // A dependência [id] garante que a busca seja re-executada se o ID na URL mudar

  // Função `handleChange` é chamada toda vez que o valor de um campo do formulário muda
  const handleChange = (e) => {
    const { name, value } = e.target // Desestrutura o nome do campo e seu novo valor
    // Atualiza o estado 'prato', criando uma nova cópia do objeto e atualizando apenas o campo modificado
    setPrato({ ...prato, [name]: value })
  }

  // Função `handleSubmit` é chamada quando o formulário é submetido
  const handleSubmit = async (e) => {
    e.preventDefault() // Previne o comportamento padrão do formulário de recarregar a página

    // Converte o preço de string para número decimal antes de enviar
    // Garante que o valor é uma string e substitui vírgulas por pontos antes de converter para float
    const precoNumerico = parseFloat(prato.preco.toString().replace(',', '.'))

    // Validação: Verifica se o resultado da conversão do preço é um número válido
    if (isNaN(precoNumerico)) {
      Swal.fire('Erro', 'Por favor, insira um preço numérico válido. Use ponto ou vírgula para decimais.', 'error')
      return // Interrompe a execução se o preço não for válido
    }

    // Cria um novo objeto com os dados do prato, garantindo que 'preco' seja um número
    const pratoParaAtualizar = {
      ...prato,
      preco: precoNumerico
    }

    try {
      // Faz uma requisição PUT para a API para atualizar o prato específico pelo ID
      const res = await fetch(`http://localhost:3000/pratos/${id}`, {
        method: 'PUT', // Define o método da requisição como PUT
        headers: { 'Content-Type': 'application/json' }, // Define o cabeçalho Content-Type como JSON
        body: JSON.stringify(pratoParaAtualizar) // Converte o objeto do prato atualizado para JSON
      })

      // Se a resposta não for ok, lança um erro
      if (!res.ok) throw new Error('Erro ao atualizar prato')

      // Exibe um alerta de sucesso ao usuário
      Swal.fire('Sucesso', 'Prato atualizado com sucesso', 'success')
      navigate('/admin') // Redireciona o usuário para a página de administração após o sucesso
    } catch (err) {
      console.error(err) // Loga o erro no console
      // Exibe um alerta de erro ao usuário caso não consiga atualizar o prato
      Swal.fire('Erro', 'Não foi possível atualizar o prato', 'error')
    }
  }

  // Renderização condicional: Exibe uma mensagem de carregamento se o prato ainda não foi buscado
  if (!prato) {
    return <div className="text-white text-center mt-10">Carregando prato...</div>
  }

  // Renderização do formulário de edição de prato
  return (
    <>
      {/* Container principal do formulário, centralizado e estilizado */}
      <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded shadow-md text-black">
        <h2 className="text-2xl font-bold mb-4">Editar Prato</h2>
        {/* Formulário de edição, que chama handleSubmit ao ser submetido */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo de input para o Nome do Prato */}
          <input
            type="text"
            name="nome"
            value={prato.nome} // O valor do input é controlado pelo estado 'prato.nome'
            onChange={handleChange} // Atualiza o estado quando o input muda
            placeholder="Nome"
            required // Campo obrigatório
            className="border p-1 rounded-[0.3rem]"
          />
          {/* Campo de input para a Descrição do Prato */}
          <textarea
            name="descricao"
            value={prato.descricao} // O valor do input é controlado pelo estado 'prato.descricao'
            onChange={handleChange} // Atualiza o estado quando o input muda
            placeholder="Descrição"
            required // Campo obrigatório
            className="border p-1 rounded-[0.3rem]"
          />
          {/* Campo de input para o Preço do Prato */}
          <input
            type="number" // Define o tipo de input como número
            name="preco"
            value={prato.preco} // O valor do input é controlado pelo estado 'prato.preco'
            onChange={handleChange} // Atualiza o estado quando o input muda
            placeholder="Preço"
            step="0.01" // Permite a entrada de números decimais com duas casas
            required // Campo obrigatório
            className="border p-1 rounded-[0.3rem]"
          />
          {/* Campo de input para a Categoria do Prato */}
          <input
            type="text"
            name="category"
            value={prato.category} // O valor do input é controlado pelo estado 'prato.category'
            onChange={handleChange} // Atualiza o estado quando o input muda
            placeholder="Categoria (Ex: Yakissoba)"
            required // Campo obrigatório
            className="border p-1 rounded-[0.3rem]"
          />
          {/* Campo de input para a URL da Imagem do Prato */}
          <input
            type="text"
            name="imagem"
            value={prato.imagem} // O valor do input é controlado pelo estado 'prato.imagem'
            onChange={handleChange} // Atualiza o estado quando o input muda
            placeholder="URL da imagem"
            className="border p-1 rounded-[0.3rem]" // Campo não obrigatório
          />
          {/* Botão para submeter as alterações do formulário */}
          <button type="submit" className="bg-green-600 text-white p-2 rounded">
            Salvar Alterações
          </button>
        </form>
      </div>

      <Footer /> {/* Inclui o componente Footer no final da página */}
    </>
  )
}

export default EditarPrato 