import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NovoImovel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    tipo: "QUARTO",
    preco: "",
    cidade: "",
    bairro: "",
    endereco: "",
    imagem: "",
    contacto: "",
  });

  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErros({
      ...erros,
      [e.target.name]: "",
    });

    setMensagem("");
    setTipoMensagem("");
  }

  function validarUrlImagem(url) {
    if (!url.trim()) return true;

    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:image/")
    );
  }

  function validarFormulario() {
    const novosErros = {};

    if (!form.titulo.trim()) {
      novosErros.titulo = "O título é obrigatório.";
    }

    if (!form.descricao.trim()) {
      novosErros.descricao = "A descrição é obrigatória.";
    }

    if (!form.preco || Number(form.preco) <= 0) {
      novosErros.preco = "Informe um preço válido.";
    }

    if (!form.cidade.trim()) {
      novosErros.cidade = "A cidade é obrigatória.";
    }

    if (!form.bairro.trim()) {
      novosErros.bairro = "O bairro é obrigatório.";
    }

    if (!form.contacto.trim()) {
      novosErros.contacto = "O contacto é obrigatório.";
    }

    if (!validarUrlImagem(form.imagem)) {
      novosErros.imagem = "Informe uma URL de imagem válida.";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMensagem("");
    setTipoMensagem("");

    if (!validarFormulario()) {
      setMensagem("Corrija os campos destacados antes de cadastrar o imóvel.");
      setTipoMensagem("erro");
      return;
    }

    try {
      setEnviando(true);

      await api.post("/imoveis", form);

      setMensagem("Imóvel cadastrado com sucesso. A redirecionar para o painel...");
      setTipoMensagem("sucesso");

      setTimeout(() => {
        navigate("/proprietario");
      }, 1000);
    } catch (error) {
      setMensagem(error.response?.data?.mensagem || "Erro ao cadastrar imóvel.");
      setTipoMensagem("erro");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="container">
      <div className="form-imovel-box">
        <div className="form-imovel-header">
          <h1>Novo Imóvel</h1>
          <p>
            Preencha os dados do quarto, casa ou apartamento que deseja anunciar.
          </p>
        </div>

        {mensagem && (
          <div className={`mensagem-form ${tipoMensagem}`}>
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-imovel">
          <div className="campo full">
            <label>Título *</label>
            <input
              name="titulo"
              placeholder="Ex: Quarto disponível na Matola"
              value={form.titulo}
              onChange={handleChange}
              className={erros.titulo ? "input-erro" : ""}
            />
            {erros.titulo && <small>{erros.titulo}</small>}
          </div>

          <div className="campo full">
            <label>Descrição *</label>
            <textarea
              name="descricao"
              placeholder="Descreva as condições do imóvel, localização e vantagens."
              value={form.descricao}
              onChange={handleChange}
              className={erros.descricao ? "input-erro" : ""}
            />
            {erros.descricao && <small>{erros.descricao}</small>}
          </div>

          <div className="campo">
            <label>Tipo *</label>
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="QUARTO">Quarto</option>
              <option value="CASA">Casa</option>
              <option value="APARTAMENTO">Apartamento</option>
              <option value="DEPENDENCIA">Dependência</option>
            </select>
          </div>

          <div className="campo">
            <label>Preço mensal *</label>
            <input
              name="preco"
              type="number"
              placeholder="Ex: 4500"
              value={form.preco}
              onChange={handleChange}
              className={erros.preco ? "input-erro" : ""}
            />
            {erros.preco && <small>{erros.preco}</small>}
          </div>

          <div className="campo">
            <label>Cidade *</label>
            <input
              name="cidade"
              placeholder="Ex: Maputo"
              value={form.cidade}
              onChange={handleChange}
              className={erros.cidade ? "input-erro" : ""}
            />
            {erros.cidade && <small>{erros.cidade}</small>}
          </div>

          <div className="campo">
            <label>Bairro *</label>
            <input
              name="bairro"
              placeholder="Ex: Alto Maé"
              value={form.bairro}
              onChange={handleChange}
              className={erros.bairro ? "input-erro" : ""}
            />
            {erros.bairro && <small>{erros.bairro}</small>}
          </div>

          <div className="campo">
            <label>Endereço</label>
            <input
              name="endereco"
              placeholder="Ex: Próximo à estrada principal"
              value={form.endereco}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label>Contacto *</label>
            <input
              name="contacto"
              placeholder="Ex: 840000002"
              value={form.contacto}
              onChange={handleChange}
              className={erros.contacto ? "input-erro" : ""}
            />
            {erros.contacto && <small>{erros.contacto}</small>}
          </div>

          <div className="campo full">
            <label>URL da imagem</label>
            <input
              name="imagem"
              placeholder="Ex: https://images.unsplash.com/photo-..."
              value={form.imagem}
              onChange={handleChange}
              className={erros.imagem ? "input-erro" : ""}
            />
            {erros.imagem && <small>{erros.imagem}</small>}

            {form.imagem && validarUrlImagem(form.imagem) && (
              <img
                src={form.imagem}
                alt="Pré-visualização"
                className="preview-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          <div className="form-acoes full">
            <button type="submit" disabled={enviando}>
              {enviando ? "A cadastrar..." : "Cadastrar imóvel"}
            </button>

            <button
              type="button"
              className="btn-cancelar"
              onClick={() => navigate("/proprietario")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default NovoImovel;