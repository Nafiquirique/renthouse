import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Perfil() {
  const { usuario, atualizarUsuarioLocal } = useAuth();

  const [modoEdicao, setModoEdicao] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const [perfil, setPerfil] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipo: "",
  });

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    senha: "",
  });

  async function carregarPerfil() {
    try {
      setCarregando(true);
      setMensagem("");
      setTipoMensagem("");

      const resposta = await api.get("/users/me");

      const dados = {
        nome: resposta.data.nome || "",
        email: resposta.data.email || "",
        telefone: resposta.data.telefone || "",
        tipo: resposta.data.tipo || "",
      };

      setPerfil(dados);

      setForm({
        nome: dados.nome,
        telefone: dados.telefone,
        senha: "",
      });
    } catch (error) {
      setMensagem("Erro ao carregar perfil.");
      setTipoMensagem("erro");
    } finally {
      setCarregando(false);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setMensagem("");
    setTipoMensagem("");
  }

  function cancelarEdicao() {
    setForm({
      nome: perfil.nome,
      telefone: perfil.telefone,
      senha: "",
    });

    setMensagem("");
    setTipoMensagem("");
    setModoEdicao(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMensagem("");
    setTipoMensagem("");

    if (!form.nome.trim()) {
      setMensagem("O nome é obrigatório.");
      setTipoMensagem("erro");
      return;
    }

    if (form.senha && form.senha.length < 6) {
      setMensagem("A nova senha deve ter pelo menos 6 caracteres.");
      setTipoMensagem("erro");
      return;
    }

    try {
      const resposta = await api.put("/users/me", {
        nome: form.nome,
        telefone: form.telefone,
        senha: form.senha,
      });

      const usuarioAtualizado = resposta.data.usuario;

      atualizarUsuarioLocal(usuarioAtualizado);

      setPerfil({
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        telefone: usuarioAtualizado.telefone || "",
        tipo: usuarioAtualizado.tipo,
      });

      setForm({
        nome: usuarioAtualizado.nome,
        telefone: usuarioAtualizado.telefone || "",
        senha: "",
      });

      setModoEdicao(false);
      setMensagem("Perfil atualizado com sucesso.");
      setTipoMensagem("sucesso");
    } catch (error) {
      setMensagem(error.response?.data?.mensagem || "Erro ao atualizar perfil.");
      setTipoMensagem("erro");
    }
  }

  useEffect(() => {
    carregarPerfil();
  }, []);

  if (carregando) {
    return <main className="container">Carregando perfil...</main>;
  }

  return (
    <main className="container">
      <div className="perfil-box">
        <div className="perfil-header">
          <div className="avatar">
            {usuario?.nome?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>Meu Perfil</h2>
            <p>Veja e atualize os seus dados pessoais.</p>
          </div>
        </div>

        {mensagem && (
          <div className={`mensagem-form ${tipoMensagem}`}>
            {mensagem}
          </div>
        )}

        {!modoEdicao ? (
          <>
            <div className="perfil-dados">
              <div className="perfil-item">
                <span>Nome</span>
                <strong>{perfil.nome}</strong>
              </div>

              <div className="perfil-item">
                <span>Email</span>
                <strong>{perfil.email}</strong>
              </div>

              <div className="perfil-item">
                <span>Telefone</span>
                <strong>{perfil.telefone || "Não informado"}</strong>
              </div>

              <div className="perfil-item">
                <span>Tipo de usuário</span>
                <strong>{perfil.tipo}</strong>
              </div>
            </div>

            <button
              className="btn-primary perfil-btn"
              onClick={() => {
                setMensagem("");
                setTipoMensagem("");
                setModoEdicao(true);
              }}
            >
              Atualizar dados
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="perfil-form">
            <label>
              Nome
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome completo"
              />
            </label>

            <label>
              Telefone
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Telefone"
              />
            </label>

            <label>
              Nova senha
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                placeholder="Deixe vazio se não quiser alterar"
              />
            </label>

            <div className="perfil-acoes">
              <button type="submit">Guardar alterações</button>

              <button
                type="button"
                className="btn-cancelar"
                onClick={cancelarEdicao}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default Perfil;