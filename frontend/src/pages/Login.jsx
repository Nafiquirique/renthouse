import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setMensagem("");
    setTipoMensagem("");

    if (!email || !senha) {
      setMensagem("Preencha o email e a senha.");
      setTipoMensagem("erro");
      return;
    }

    try {
      setCarregando(true);

      const usuario = await login(email, senha);

      setMensagem("Login feito com sucesso. A redirecionar...");
      setTipoMensagem("sucesso");

      setTimeout(() => {
        if (usuario.tipo === "ADMIN") {
          navigate("/admin");
        } else if (usuario.tipo === "PROPRIETARIO") {
          navigate("/proprietario");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (error) {
      setMensagem(error.response?.data?.mensagem || "Email ou senha inválidos.");
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

          <h1>Bem-vindo de volta</h1>

          <p>
            Entre na sua conta para gerir reservas, anunciar imóveis ou encontrar
            uma casa/quarto para arrendar.
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-title">
            <LogIn size={28} />
            <div>
              <h2>Login</h2>
              <p>Acesse a sua conta</p>
            </div>
          </div>

          {mensagem && (
            <div className={`mensagem-form ${tipoMensagem}`}>
              {mensagem}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <div className="input-icon">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Digite o seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            <label>
              Senha
              <div className="input-icon">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Digite a sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
            </label>

            <button type="submit" disabled={carregando}>
              {carregando ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <p className="auth-link">
            Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;