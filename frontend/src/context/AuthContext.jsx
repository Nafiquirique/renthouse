import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  const login = async (email, senha) => {
    const resposta = await api.post("/auth/login", { email, senha });

    localStorage.setItem("token", resposta.data.token);
    localStorage.setItem("usuario", JSON.stringify(resposta.data.usuario));

    setUsuario(resposta.data.usuario);

    return resposta.data.usuario;
  };

  const register = async (dados) => {
    const resposta = await api.post("/auth/register", dados);
    return resposta.data;
  };

  const atualizarUsuarioLocal = (novoUsuario) => {
    localStorage.setItem("usuario", JSON.stringify(novoUsuario));
    setUsuario(novoUsuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        register,
        logout,
        atualizarUsuarioLocal,
        autenticado: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}