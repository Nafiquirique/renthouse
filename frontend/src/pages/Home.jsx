import { useEffect, useState } from "react";
import api from "../services/api";
import ImovelCard from "../components/ImovelCard";

function Home() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const [filtros, setFiltros] = useState({
    cidade: "",
    bairro: "",
    tipo: "",
    precoMin: "",
    precoMax: "",
  });

  async function carregarImoveis(filtrosAtuais = filtros) {
    try {
      setCarregando(true);
      setMensagem("");
      setTipoMensagem("");

      const params = new URLSearchParams();

      if (filtrosAtuais.cidade) params.append("cidade", filtrosAtuais.cidade);
      if (filtrosAtuais.bairro) params.append("bairro", filtrosAtuais.bairro);
      if (filtrosAtuais.tipo) params.append("tipo", filtrosAtuais.tipo);
      if (filtrosAtuais.precoMin) params.append("precoMin", filtrosAtuais.precoMin);
      if (filtrosAtuais.precoMax) params.append("precoMax", filtrosAtuais.precoMax);

      const resposta = await api.get(`/imoveis?${params.toString()}`);
      setImoveis(resposta.data);
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao carregar imóveis. Verifique se o backend está ligado.");
      setTipoMensagem("erro");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarImoveis();
  }, []);

  function handleChange(e) {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });

    setMensagem("");
    setTipoMensagem("");
  }

  function pesquisar(e) {
    e.preventDefault();

    if (
      filtros.precoMin &&
      filtros.precoMax &&
      Number(filtros.precoMin) > Number(filtros.precoMax)
    ) {
      setMensagem("O preço mínimo não pode ser maior que o preço máximo.");
      setTipoMensagem("erro");
      return;
    }

    carregarImoveis();
  }

  function limparFiltros() {
    const filtrosLimpos = {
      cidade: "",
      bairro: "",
      tipo: "",
      precoMin: "",
      precoMax: "",
    };

    setFiltros(filtrosLimpos);
    setMensagem("");
    setTipoMensagem("");
    carregarImoveis(filtrosLimpos);
  }

  return (
    <main>
      <section className="hero">
        <div>
          <h1>Encontre casa ou quarto para arrendar</h1>
          <p>
            Uma plataforma simples para ajudar pessoas novas numa cidade a
            encontrar quartos, casas e apartamentos disponíveis.
          </p>
        </div>
      </section>

      <section className="container">
        <form className="filtros filtros-melhorados" onSubmit={pesquisar}>
          <input
            type="text"
            name="cidade"
            placeholder="Cidade"
            value={filtros.cidade}
            onChange={handleChange}
          />

          <input
            type="text"
            name="bairro"
            placeholder="Bairro"
            value={filtros.bairro}
            onChange={handleChange}
          />

          <select name="tipo" value={filtros.tipo} onChange={handleChange}>
            <option value="">Todos os tipos</option>
            <option value="QUARTO">Quarto</option>
            <option value="CASA">Casa</option>
            <option value="APARTAMENTO">Apartamento</option>
            <option value="DEPENDENCIA">Dependência</option>
          </select>

          <input
            type="number"
            name="precoMin"
            placeholder="Preço mínimo"
            value={filtros.precoMin}
            onChange={handleChange}
          />

          <input
            type="number"
            name="precoMax"
            placeholder="Preço máximo"
            value={filtros.precoMax}
            onChange={handleChange}
          />

          <button type="submit">Pesquisar</button>

          <button type="button" className="btn-limpar" onClick={limparFiltros}>
            Limpar
          </button>
        </form>

        {mensagem && (
          <div className={`mensagem-form ${tipoMensagem}`}>
            {mensagem}
          </div>
        )}

        <div className="titulo-secao titulo-com-contador">
          <div>
            <h2>Imóveis disponíveis</h2>
            <p>Veja as melhores opções cadastradas na plataforma.</p>
          </div>

          {!carregando && (
            <span className="contador-imoveis">
              {imoveis.length} imóvel(is) encontrado(s)
            </span>
          )}
        </div>

        {carregando ? (
          <p>Carregando imóveis...</p>
        ) : imoveis.length === 0 ? (
          <div className="sem-resultados">
            <h3>Nenhum imóvel encontrado</h3>
            <p>
              Tente pesquisar por outra cidade, bairro, tipo ou faixa de preço.
            </p>
          </div>
        ) : (
          <div className="grid-imoveis">
            {imoveis.map((imovel) => (
              <ImovelCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;