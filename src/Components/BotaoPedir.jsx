import Swal from 'sweetalert2';

function BotaoPedir({ nome, preco, imagem, descricao }) {
  async function addCarrinho() {
    try {
      const resposta = await fetch(`http://localhost:3001/pratos`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ nome, preco, imagem, descricao })
      });

      if (!resposta.ok) {
        await Swal.fire({
          icon: "error",
          title: "Erro ao adicionar prato no carrinho!",
          text: "Tente novamente mais tarde ou escolha outro prato"
        });
      } else {
        await Swal.fire({
          title: "Boa!",
          text: "Prato adicionado com sucesso",
          icon: "success",
          confirmButtonText: "Ok"
        });
      }
    } catch (erro) {
      console.log(`Erro: ${erro.message}`);
    }
  }

  return (
    <button
      onClick={addCarrinho}
      className="cursor-pointer w-32 h-12 bg-red-600 rounded-[20px]"
    >
      <span className="text-white text-base font-semibold font-['Montserrat']">Pedir Agora</span>
    </button>
  );
}

export default BotaoPedir;
