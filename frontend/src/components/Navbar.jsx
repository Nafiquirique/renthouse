import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  LogIn,
  LogOut,
  PlusCircle,
  UserPlus,
  Building2,
  Menu,
  X,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(() => {
    return localStorage.getItem("tema") === "escuro";
  });

  useEffect(() => {
    if (modoEscuro) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("tema", "escuro");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("tema", "claro");
    }
  }, [modoEscuro]);

  function sair() {
    logout();
    setMenuAberto(false);
    navigate("/");
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  function abrirPerfil() {
    setMenuAberto(false);
    navigate("/perfil");
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={fecharMenu}>
        <Building2 size={26} />
        <span>RentHouse</span>
      </Link>

      <button
        className="menu-mobile-btn"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir menu"
      >
        {menuAberto ? <X size={26} /> : <Menu size={26} />}
      </button>

      <nav className={menuAberto ? "nav-links ativo" : "nav-links"}>
        <Link to="/" onClick={fecharMenu}>
          <Home size={18} />
          Início
        </Link>

        <Link to="/como-funciona" onClick={fecharMenu}>
          Como funciona
        </Link>

        {!usuario && (
          <>
            <Link to="/login" onClick={fecharMenu}>
              <LogIn size={18} />
              Login
            </Link>

            <Link to="/cadastro" onClick={fecharMenu}>
              <UserPlus size={18} />
              Cadastro
            </Link>
          </>
        )}

        {usuario?.tipo === "PROPRIETARIO" && (
          <>
            <Link to="/proprietario" onClick={fecharMenu}>
              Meus Imóveis
            </Link>

            <Link to="/proprietario/novo-imovel" onClick={fecharMenu}>
              <PlusCircle size={18} />
              Novo Imóvel
            </Link>

            <Link to="/minhas-reservas" onClick={fecharMenu}>
              Reservas Recebidas
            </Link>
          </>
        )}

        {usuario?.tipo === "CLIENTE" && (
          <Link to="/minhas-reservas" onClick={fecharMenu}>
            Minhas Reservas
          </Link>
        )}

        {usuario?.tipo === "ADMIN" && (
          <>
            <Link to="/admin" onClick={fecharMenu}>
              Admin
            </Link>

            <Link to="/proprietario/novo-imovel" onClick={fecharMenu}>
              <PlusCircle size={18} />
              Novo Imóvel
            </Link>

            <Link to="/minhas-reservas" onClick={fecharMenu}>
              Reservas
            </Link>
          </>
        )}

        <button
          className="btn-tema"
          onClick={() => setModoEscuro(!modoEscuro)}
          type="button"
        >
          {modoEscuro ? <Sun size={18} /> : <Moon size={18} />}
          {modoEscuro ? "Claro" : "Escuro"}
        </button>

        {usuario && (
          <button className="usuario-navbar" onClick={abrirPerfil}>
            <User size={18} />
            <div>
              <strong>{usuario.nome}</strong>
              <span>{usuario.tipo}</span>
            </div>
          </button>
        )}

        {usuario && (
          <button onClick={sair} className="btn-sair">
            <LogOut size={18} />
            Sair
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;