import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function MinhasReservas() {
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const { usuario } = useAuth();

  async function carregarReservas() {
    try {
      setCarregando(true);

      const resposta = await api.get("/reservas");
      setReservas(resposta.data);
    } catch (error) {
      setMensagem("Erro ao carregar reservas.");
      setTipoMensagem("erro");
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarEstado(id, estado) {
    const confirmar = confirm(`Deseja alterar a reserva para ${estado}?`);

    if (!confirmar) return;

    setMensagem("");
    setTipoMensagem("");

    try {
      await api.put(`/reservas/${id}/status`, { estado });

      setMensagem(`Reserva alterada para ${estado} com sucesso.`);
      setTipoMensagem("sucesso");

      carregarReservas();
    } catch (error) {
      setMensagem(error.response?.data?.mensagem || "Erro ao atualizar reserva.");
      setTipoMensagem("erro");
    }
  }

  async function removerReserva(id) {
    const confirmar = confirm("Deseja remover esta reserva?");

    if (!confirmar) return;

    setMensagem("");
    setTipoMensagem("");

    try {
      await api.delete(`/reservas/${id}`);

      setMensagem("Reserva removida com sucesso.");
      setTipoMensagem("sucesso");

      carregarReservas();
    } catch (error) {
      setMensagem(error.response?.data?.mensagem || "Erro ao remover reserva.");
      setTipoMensagem("erro");
    }
  }

  useEffect(() => {
    carregarReservas();
  }, []);

  function tituloPagina() {
    if (usuario?.tipo === "CLIENTE") return "Minhas Reservas";
    if (usuario?.tipo === "PROPRIETARIO") return "Reservas Recebidas";
    return "Todas as Reservas";
  }

  function descricaoPagina() {
    if (usuario?.tipo === "CLIENTE") {
      return "Acompanhe os imóveis que você solicitou reserva.";
    }

    if (usuario?.tipo === "PROPRIETARIO") {
      return "Veja os pedidos feitos pelos clientes nos seus imóveis.";
    }

    return "Controle todas as reservas feitas na plataforma.";
  }

  function classeEstado(estado) {
    if (estado === "PENDENTE") return "estado estado-pendente";
    if (estado === "CONFIRMADA") return "estado estado-confirmada";
    if (estado === "CANCELADA") return "estado estado-cancelada";
    if (estado === "FINALIZADA") return "estado estado-finalizada";
    return "estado";
  }

  return (
    <main className="container">
      <div className="titulo-secao">
        <h2>{tituloPagina()}</h2>
        <p>{descricaoPagina()}</p>
      </div>

      {mensagem && (
        <div className={`mensagem-form ${tipoMensagem}`}>
          {mensagem}
        </div>
      )}

      {carregando ? (
        <p>Carregando reservas...</p>
      ) : reservas.length === 0 ? (
        <div className="sem-resultados">
          <h3>Nenhuma reserva encontrada</h3>
          <p>Ainda não existem reservas para mostrar.</p>
        </div>
      ) : (
        <div className="reservas-grid">
          {reservas.map((reserva) => (
            <div className="reserva-card" key={reserva.id}>
              <div className="reserva-topo">
                <h3>{reserva.imovel?.titulo}</h3>

                <span className={classeEstado(reserva.estado)}>
                  {reserva.estado}
                </span>
              </div>

              <p>
                <strong>Tipo:</strong> {reserva.imovel?.tipo}
              </p>

              <p>
                <strong>Preço:</strong>{" "}
                {Number(reserva.imovel?.preco || 0).toLocaleString()} MT/mês
              </p>

              <p>
                <strong>Localização:</strong> {reserva.imovel?.cidade},{" "}
                {reserva.imovel?.bairro}
              </p>

              {usuario?.tipo !== "CLIENTE" && (
                <p>
                  <strong>Cliente:</strong> {reserva.cliente?.nome} —{" "}
                  {reserva.cliente?.telefone || "Sem telefone"}
                </p>
              )}

              {usuario?.tipo === "CLIENTE" && (
                <p>
                  <strong>Proprietário:</strong>{" "}
                  {reserva.imovel?.proprietario?.nome} —{" "}
                  {reserva.imovel?.proprietario?.telefone || "Sem telefone"}
                </p>
              )}

              <p>
                <strong>Mensagem:</strong>{" "}
                {reserva.mensagem || "Sem mensagem."}
              </p>

              <div className="reserva-acoes">
                {usuario?.tipo !== "CLIENTE" &&
                  reserva.estado === "PENDENTE" && (
                    <>
                      <button
                        className="btn-confirmar"
                        onClick={() =>
                          atualizarEstado(reserva.id, "CONFIRMADA")
                        }
                      >
                        Confirmar
                      </button>

                      <button
                        className="btn-danger"
                        onClick={() =>
                          atualizarEstado(reserva.id, "CANCELADA")
                        }
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                {usuario?.tipo !== "CLIENTE" &&
                  reserva.estado === "CONFIRMADA" && (
                    <button
                      className="btn-finalizar"
                      onClick={() =>
                        atualizarEstado(reserva.id, "FINALIZADA")
                      }
                    >
                      Finalizar
                    </button>
                  )}

                {usuario?.tipo === "CLIENTE" &&
                  reserva.estado === "PENDENTE" && (
                    <button
                      className="btn-danger"
                      onClick={() => removerReserva(reserva.id)}
                    >
                      Cancelar pedido
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MinhasReservas;