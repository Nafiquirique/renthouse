import { Search, Home, CalendarCheck, UserPlus, Building2, ShieldCheck } from "lucide-react";

function ComoFunciona() {
  return (
    <main>
      <section className="page-hero">
        <div>
          <h1>Como funciona o RentHouse?</h1>
          <p>
            O RentHouse facilita a procura e reserva de casas, quartos e apartamentos
            para arrendamento, aproximando clientes e proprietários numa plataforma simples.
          </p>
        </div>
      </section>

      <section className="container">
        <div className="titulo-secao">
          <h2>Para quem procura imóvel</h2>
          <p>O cliente pode encontrar opções disponíveis de forma rápida e organizada.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <Search size={34} />
            <h3>1. Pesquisar imóveis</h3>
            <p>
              O cliente pesquisa por cidade, bairro, tipo de imóvel e faixa de preço.
            </p>
          </div>

          <div className="step-card">
            <Home size={34} />
            <h3>2. Ver detalhes</h3>
            <p>
              Cada anúncio apresenta imagem, preço, descrição, localização e contacto.
            </p>
          </div>

          <div className="step-card">
            <CalendarCheck size={34} />
            <h3>3. Solicitar reserva</h3>
            <p>
              O cliente faz o pedido de reserva e aguarda a confirmação do proprietário.
            </p>
          </div>
        </div>

        <div className="titulo-secao">
          <h2>Para proprietários</h2>
          <p>O proprietário pode anunciar e gerir os seus imóveis disponíveis.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <UserPlus size={34} />
            <h3>1. Criar conta</h3>
            <p>
              O proprietário cria uma conta e acessa o seu painel de gestão.
            </p>
          </div>

          <div className="step-card">
            <Building2 size={34} />
            <h3>2. Cadastrar imóvel</h3>
            <p>
              Pode cadastrar quartos, casas ou apartamentos com imagem, preço e descrição.
            </p>
          </div>

          <div className="step-card">
            <ShieldCheck size={34} />
            <h3>3. Gerir reservas</h3>
            <p>
              O proprietário confirma, cancela ou finaliza pedidos de reserva recebidos.
            </p>
          </div>
        </div>

        <section className="beneficios-box">
          <h2>Benefícios do sistema</h2>

          <div className="beneficios-grid">
            <div>
              <h3>Organização</h3>
              <p>
                Centraliza anúncios de imóveis num único espaço, evitando informações espalhadas.
              </p>
            </div>

            <div>
              <h3>Rapidez</h3>
              <p>
                Ajuda pessoas novas numa cidade a encontrar casa ou quarto com mais facilidade.
              </p>
            </div>

            <div>
              <h3>Comunicação</h3>
              <p>
                Facilita o contacto entre clientes interessados e proprietários.
              </p>
            </div>

            <div>
              <h3>Controlo</h3>
              <p>
                Permite acompanhar o estado dos imóveis e das reservas feitas.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default ComoFunciona;