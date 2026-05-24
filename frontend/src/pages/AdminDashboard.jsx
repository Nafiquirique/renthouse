import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [aba, setAba] = useState("estatisticas");
  const [carregando, setCarregando] = useState(true);

  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroImovel, setFiltroImovel] = useState("");
  const [filtroReserva, setFiltroReserva] = useState("");

  async function carregarDados() {
    try {
      setCarregando(true);

      const [resUsuarios, resImoveis, resReservas] = await Promise.all([
        api.get("/users"),
        api.get("/imoveis/admin/todos"),
        api.get("/reservas"),
      ]);

      setUsuarios(resUsuarios.data);
      setImoveis(resImoveis.data);
      setReservas(resReservas.data);
    } catch (error) {
      alert("Erro ao carregar dados do administrador.");
    } finally {
      setCarregando(false);
    }
  }

  async function removerUsuario(id) {
    const confirmar = confirm("Deseja remover este usuário?");

    if (!confirmar) return;

    try {
      await api.delete(`/users/${id}`);
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao remover usuário.");
    }
  }

  async function removerImovel(id) {
    const confirmar = confirm("Deseja remover este imóvel?");

    if (!confirmar) return;

    try {
      await api.delete(`/imoveis/${id}`);
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao remover imóvel.");
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const usuariosFiltrados = filtroUsuario
    ? usuarios.filter((usuario) => usuario.tipo === filtroUsuario)
    : usuarios;

  const imoveisFiltrados = filtroImovel
    ? imoveis.filter((imovel) => imovel.estado === filtroImovel)
    : imoveis;

  const reservasFiltradas = filtroReserva
    ? reservas.filter((reserva) => reserva.estado === filtroReserva)
    : reservas;

  const totalClientes = usuarios.filter((u) => u.tipo === "CLIENTE").length;

  const totalProprietarios = usuarios.filter(
    (u) => u.tipo === "PROPRIETARIO"
  ).length;

  const totalDisponiveis = imoveis.filter(
    (i) => i.estado === "DISPONIVEL"
  ).length;

  const totalReservados = imoveis.filter(
    (i) => i.estado === "RESERVADO"
  ).length;

  const totalArrendados = imoveis.filter(
    (i) => i.estado === "ARRENDADO"
  ).length;

  if (carregando) {
    return <main className="container">Carregando painel do administrador...</main>;
  }

  return (
    <main className="container">
      <div className="titulo-secao">
        <h2>Painel do Administrador</h2>
        <p>Controle geral dos usuários, imóveis e reservas da plataforma.</p>
      </div>

      <div className="admin-tabs">
        <button
          className={aba === "estatisticas" ? "active" : ""}
          onClick={() => setAba("estatisticas")}
        >
          Estatísticas
        </button>

        <button
          className={aba === "usuarios" ? "active" : ""}
          onClick={() => setAba("usuarios")}
        >
          Usuários
        </button>

        <button
          className={aba === "imoveis" ? "active" : ""}
          onClick={() => setAba("imoveis")}
        >
          Imóveis
        </button>

        <button
          className={aba === "reservas" ? "active" : ""}
          onClick={() => setAba("reservas")}
        >
          Reservas
        </button>
      </div>

      {aba === "estatisticas" && (
        <section className="stats-grid">
          <div className="stat-card">
            <h3>{usuarios.length}</h3>
            <p>Total de usuários</p>
          </div>

          <div className="stat-card">
            <h3>{totalClientes}</h3>
            <p>Clientes</p>
          </div>

          <div className="stat-card">
            <h3>{totalProprietarios}</h3>
            <p>Proprietários</p>
          </div>

          <div className="stat-card">
            <h3>{imoveis.length}</h3>
            <p>Total de imóveis</p>
          </div>

          <div className="stat-card">
            <h3>{totalDisponiveis}</h3>
            <p>Imóveis disponíveis</p>
          </div>

          <div className="stat-card">
            <h3>{totalReservados}</h3>
            <p>Imóveis reservados</p>
          </div>

          <div className="stat-card">
            <h3>{totalArrendados}</h3>
            <p>Imóveis arrendados</p>
          </div>

          <div className="stat-card">
            <h3>{reservas.length}</h3>
            <p>Total de reservas</p>
          </div>
        </section>
      )}

      {aba === "usuarios" && (
        <>
          <div className="admin-filtro">
            <label>Filtrar por tipo de usuário</label>

            <select
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="CLIENTE">Clientes</option>
              <option value="PROPRIETARIO">Proprietários</option>
              <option value="ADMIN">Administradores</option>
            </select>

            <span>{usuariosFiltrados.length} usuário(s) encontrado(s)</span>
          </div>

          <div className="tabela-box">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5">Nenhum usuário encontrado.</td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.telefone || "Não informado"}</td>
                      <td>{usuario.tipo}</td>
                      <td>
                        {usuario.tipo !== "ADMIN" && (
                          <button
                            className="btn-danger"
                            onClick={() => removerUsuario(usuario.id)}
                          >
                            Remover
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {aba === "imoveis" && (
        <>
          <div className="admin-filtro">
            <label>Filtrar por estado do imóvel</label>

            <select
              value={filtroImovel}
              onChange={(e) => setFiltroImovel(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="DISPONIVEL">Disponíveis</option>
              <option value="RESERVADO">Reservados</option>
              <option value="ARRENDADO">Arrendados</option>
            </select>

            <span>{imoveisFiltrados.length} imóvel(is) encontrado(s)</span>
          </div>

          <div className="tabela-box">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Preço</th>
                  <th>Localização</th>
                  <th>Estado</th>
                  <th>Proprietário</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {imoveisFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7">Nenhum imóvel encontrado.</td>
                  </tr>
                ) : (
                  imoveisFiltrados.map((imovel) => (
                    <tr key={imovel.id}>
                      <td>{imovel.titulo}</td>
                      <td>{imovel.tipo}</td>
                      <td>{Number(imovel.preco).toLocaleString()} MT</td>
                      <td>
                        {imovel.cidade}, {imovel.bairro}
                      </td>
                      <td>
                        <span className={`badge-imovel ${imovel.estado.toLowerCase()}`}>
                          {imovel.estado}
                        </span>
                      </td>
                      <td>{imovel.proprietario?.nome || "Não informado"}</td>
                      <td>
                        <button
                          className="btn-danger"
                          onClick={() => removerImovel(imovel.id)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {aba === "reservas" && (
        <>
          <div className="admin-filtro">
            <label>Filtrar por estado da reserva</label>

            <select
              value={filtroReserva}
              onChange={(e) => setFiltroReserva(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="CONFIRMADA">Confirmadas</option>
              <option value="CANCELADA">Canceladas</option>
              <option value="FINALIZADA">Finalizadas</option>
            </select>

            <span>{reservasFiltradas.length} reserva(s) encontrada(s)</span>
          </div>

          <div className="tabela-box">
            <table>
              <thead>
                <tr>
                  <th>Imóvel</th>
                  <th>Cliente</th>
                  <th>Proprietário</th>
                  <th>Estado</th>
                  <th>Mensagem</th>
                </tr>
              </thead>

              <tbody>
                {reservasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="5">Nenhuma reserva encontrada.</td>
                  </tr>
                ) : (
                  reservasFiltradas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td>{reserva.imovel?.titulo}</td>
                      <td>{reserva.cliente?.nome}</td>
                      <td>{reserva.imovel?.proprietario?.nome}</td>
                      <td>
                        <span className={classeEstadoReserva(reserva.estado)}>
                          {reserva.estado}
                        </span>
                      </td>
                      <td>{reserva.mensagem || "Sem mensagem"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

function classeEstadoReserva(estado) {
  if (estado === "PENDENTE") return "estado estado-pendente";
  if (estado === "CONFIRMADA") return "estado estado-confirmada";
  if (estado === "CANCELADA") return "estado estado-cancelada";
  if (estado === "FINALIZADA") return "estado estado-finalizada";
  return "estado";
}

export default AdminDashboard;