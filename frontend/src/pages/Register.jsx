import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  User,
  Building2,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    tipo: "CLIENTE",
  });

  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

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

  function validar() {
    const novosErros = {};

    if (!form.nome.trim()) {
      novosErros.nome = "O nome é obrigatório.";
    }

    if (!form.email.trim()) {
      novosErros.email = "O email é obrigatório.";
    }

    if (!form.telefone.trim()) {
      novosErros.telefone = "O telefone é obrigatório.";
    }

    if (!form.senha.trim()) {
      novosErros.senha = "A senha é obrigatória.";
    }

    if (form.senha && form.senha.length < 6) {
      novosErros.senha = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMensagem("");
    setTipoMensagem("");

    if (!validar()) {
      setMensagem("Corrija os campos destacados antes de continuar.");
      setTipoMensagem("erro");
      return;
    }

    try {
      setCarregando(true);

      await register(form);

      setMensagem("Conta criada com sucesso. A redirecionar para o login...");
      setTipoMensagem("sucesso");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMensagem(error.response?.data?.mensagem || "Erro ao criar conta.");
      setTipoMensagem("erro");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-left">
          <div className="auth-brand">
            <Building2 size={34} />
            <span>RentHouse</span>
          </div>

          <h1>Crie a sua conta</h1>

          <p>
            Cadastre-se como cliente para procurar imóveis ou como proprietário
            para anunciar casas, quartos e apartamentos disponíveis.
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-title">
            <UserPlus size={28} />
            <div>
              <h2>Cadastro</h2>
              <p>Preencha os seus dados</p>
            </div>
          </div>

          {mensagem && (
            <div className={`mensagem-form ${tipoMensagem}`}>
              {mensagem}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Nome completo
              <div className="input-icon">
                <User size={18} />
                <input
                  type="text"
                  name="nome"
                  placeholder="Digite o seu nome"
                  value={form.nome}
                  onChange={handleChange}
                  className={erros.nome ? "input-erro" : ""}
                />
              </div>
              {erros.nome && <small>{erros.nome}</small>}
            </label>

            <label>
              Email
              <div className="input-icon">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Digite o seu email"
                  value={form.email}
                  onChange={handleChange}
                  className={erros.email ? "input-erro" : ""}
                />
              </div>
              {erros.email && <small>{erros.email}</small>}
            </label>

            <label>
              Telefone
              <div className="input-icon">
                <Phone size={18} />
                <input
                  type="text"
                  name="telefone"
                  placeholder="Ex: 840000000"
                  value={form.telefone}
                  onChange={handleChange}
                  className={erros.telefone ? "input-erro" : ""}
                />
              </div>
              {erros.telefone && <small>{erros.telefone}</small>}
            </label>

            <label>
              Senha
              <div className="input-icon">
                <Lock size={18} />
                <input
                  type="password"
                  name="senha"
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={handleChange}
                  className={erros.senha ? "input-erro" : ""}
                />
              </div>
              {erros.senha && <small>{erros.senha}</small>}
            </label>

            <label>
              Tipo de conta
              <div className="input-icon">
                <BadgeCheck size={18} />
                <select name="tipo" value={form.tipo} onChange={handleChange}>
                  <option value="CLIENTE">Cliente</option>
                  <option value="PROPRIETARIO">Proprietário</option>
                </select>
              </div>
            </label>

            <button type="submit" disabled={carregando}>
              {carregando ? "A criar conta..." : "Criar conta"}
            </button>
          </form>

          <p className="auth-link">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;