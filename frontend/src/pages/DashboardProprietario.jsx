import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function DashboardProprietario() {
  const [imoveis, setImoveis] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarDados() {
    try {
      setCarregando(true);

      const [resImoveis, resReservas] = await Promise.all([
        api.get("/imoveis/meus"),
        api.get("/reservas"),
      ]);

      setImoveis(resImoveis.data);
      setReservas(resReservas.data);
    } catch (error) {
      alert("Erro ao carregar dados do painel.");
    } finally {
      setCarregando(false);
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

  const totalImoveis = imoveis.length;
  const totalDisponiveis = imoveis.filter(
    (imovel) => imovel.estado === "DISPONIVEL"
  ).length;
  const totalReservados = imoveis.filter(
    (imovel) => imovel.estado === "RESERVADO"
  ).length;
  const totalArrendados = imoveis.filter(
    (imovel) => imovel.estado === "ARRENDADO"
  ).length;
  const totalReservas = reservas.length;

  if (carregando) {
    return <main className="container">Carregando painel...</main>;
  }

  return (
    <main className="container">
      <div className="titulo-secao titulo-com-contador">
        <div>
          <h2>Painel do Proprietário</h2>
          <p>Gerencie os seus imóveis e acompanhe as reservas recebidas.</p>
        </div>

        <Link to="/proprietario/novo-imovel" className="btn-primary">
          Cadastrar novo imóvel
        </Link>
      </div>

      <section className="stats-grid proprietario-stats">
        <div className="stat-card">
          <h3>{totalImoveis}</h3>
          <p>Total de imóveis</p>
        </div>

        <div className="stat-card">
          <h3>{totalDisponiveis}</h3>
          <p>Disponíveis</p>
        </div>

        <div className="stat-card">
          <h3>{totalReservados}</h3>
          <p>Reservados</p>
        </div>

        <div className="stat-card">
          <h3>{totalArrendados}</h3>
          <p>Arrendados</p>
        </div>

        <div className="stat-card">
          <h3>{totalReservas}</h3>
          <p>Reservas recebidas</p>
        </div>
      </section>

      <div className="titulo-secao">
        <h2>Meus Imóveis</h2>
        <p>Lista de imóveis cadastrados por si.</p>
      </div>

      <div className="tabela-box">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Cidade</th>
              <th>Bairro</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {imoveis.length === 0 ? (
              <tr>
                <td colSpan="7">Nenhum imóvel cadastrado.</td>
              </tr>
            ) : (
              imoveis.map((imovel) => (
                <tr key={imovel.id}>
                  <td>{imovel.titulo}</td>
                  <td>{imovel.tipo}</td>
                  <td>{Number(imovel.preco).toLocaleString()} MT</td>
                  <td>{imovel.cidade}</td>
                  <td>{imovel.bairro}</td>
                  <td>
                    <span className={`badge-imovel ${imovel.estado.toLowerCase()}`}>
                      {imovel.estado}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/proprietario/editar-imovel/${imovel.id}`}
                      className="btn-table"
                    >
                      Editar
                    </Link>

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
    </main>
  );
}

export default DashboardProprietario;