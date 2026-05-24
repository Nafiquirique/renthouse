import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CalendarCheck,
  Home,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function DetalhesImovel() {
  const { id } = useParams();
  const { usuario } = useAuth();

  const [imovel, setImovel] = useState(null);
  const [mensagemReserva, setMensagemReserva] = useState("");
  const [mensagemPagina, setMensagemPagina] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  async function carregarImovel() {
    try {
      setCarregando(true);

      const resposta = await api.get(`/imoveis/${id}`);
      setImovel(resposta.data);
    } catch (error) {
      setMensagemPagina("Erro ao carregar detalhes do imóvel.");
      setTipoMensagem("erro");
    } finally {
      setCarregando(false);
    }
  }

  async function reservar() {
    setMensagemPagina("");
    setTipoMensagem("");

    if (!usuario) {
      setMensagemPagina("Faça login como cliente para solicitar reserva.");
      setTipoMensagem("erro");
      return;
    }

    if (usuario.tipo !== "CLIENTE") {
      setMensagemPagina("Apenas clientes podem fazer reservas.");
      setTipoMensagem("erro");
      return;
    }

    try {
      setEnviando(true);

      await api.post("/reservas", {
        imovelId: Number(id),
        mensagem: mensagemReserva,
      });

      setMensagemPagina(
        "Reserva solicitada com sucesso. Aguarde a confirmação do proprietário."
      );
      setTipoMensagem("sucesso");
      setMensagemReserva("");

      carregarImovel();
    } catch (error) {
      setMensagemPagina(
        error.response?.data?.mensagem || "Erro ao solicitar reserva."
      );
      setTipoMensagem("erro");
    } finally {
      setEnviando(false);
    }
  }

  useEffect(() => {
    carregarImovel();
  }, [id]);

  if (carregando) {
    return <main className="container">Carregando imóvel...</main>;
  }

  if (!imovel) {
    return (
      <main className="container">
        {mensagemPagina && (
          <div className={`mensagem-form ${tipoMensagem}`}>
            {mensagemPagina}
          </div>
        )}

        <div className="sem-resultados">
          <h3>Imóvel não encontrado</h3>
          <p>O imóvel solicitado não existe ou foi removido.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <Link to="/" className="btn-voltar">
        <ArrowLeft size={18} />
        Voltar para imóveis
      </Link>

      {mensagemPagina && (
        <div className={`mensagem-form ${tipoMensagem}`}>
          {mensagemPagina}
        </div>
      )}

      <section className="detalhes-page">
        <div className="detalhes-imagem-box">
          <img
            src={
              imovel.imagem ||
              "https://images.unsplash.com/photo-1560184897-ae75f418493e"
            }
            alt={imovel.titulo}
          />

          <span className={`detalhes-estado ${imovel.estado.toLowerCase()}`}>
            {imovel.estado}
          </span>
        </div>

        <div className="detalhes-conteudo">
          <span className="tag">{imovel.tipo}</span>

          <h1>{imovel.titulo}</h1>

          <p className="detalhes-descricao">{imovel.descricao}</p>

          <div className="detalhes-preco">
            <Banknote size={24} />
            <div>
              <span>Preço mensal</span>
              <strong>{Number(imovel.preco).toLocaleString()} MT</strong>
            </div>
          </div>

          <div className="detalhes-grid-info">
            <div className="detalhe-info-card">
              <MapPin size={22} />
              <div>
                <span>Localização</span>
                <strong>
                  {imovel.cidade}, {imovel.bairro}
                </strong>
              </div>
            </div>

            <div className="detalhe-info-card">
              <Home size={22} />
              <div>
                <span>Endereço</span>
                <strong>{imovel.endereco || "Não informado"}</strong>
              </div>
            </div>

            <div className="detalhe-info-card">
              <Phone size={22} />
              <div>
                <span>Contacto</span>
                <strong>
                  {imovel.contacto ||
                    imovel.proprietario?.telefone ||
                    "Não informado"}
                </strong>
              </div>
            </div>

            <div className="detalhe-info-card">
              <User size={22} />
              <div>
                <span>Proprietário</span>
                <strong>{imovel.proprietario?.nome || "Não informado"}</strong>
              </div>
            </div>
          </div>

          {usuario?.tipo === "CLIENTE" && imovel.estado === "DISPONIVEL" && (
            <div className="reserva-detalhes-box">
              <div className="reserva-detalhes-titulo">
                <CalendarCheck size={22} />
                <div>
                  <h3>Solicitar reserva</h3>
                  <p>Envie uma mensagem ao proprietário demonstrando interesse.</p>
                </div>
              </div>

              <textarea
                placeholder="Ex: Olá, tenho interesse neste imóvel. Gostaria de saber se ainda está disponível."
                value={mensagemReserva}
                onChange={(e) => {
                  setMensagemReserva(e.target.value);
                  setMensagemPagina("");
                  setTipoMensagem("");
                }}
              />

              <button
                className="btn-primary"
                onClick={reservar}
                disabled={enviando}
              >
                {enviando ? "A enviar..." : "Solicitar reserva"}
              </button>
            </div>
          )}

          {!usuario && imovel.estado === "DISPONIVEL" && (
            <div className="aviso-login">
              Para solicitar reserva, faça login como cliente.
            </div>
          )}

          {imovel.estado !== "DISPONIVEL" && (
            <div className="aviso-indisponivel">
              Este imóvel não está disponível para novas reservas.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default DetalhesImovel;