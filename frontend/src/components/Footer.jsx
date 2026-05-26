import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <Link to="/" className="footer-logo">
            <Building2 size={24} />
            <span>RentHouse</span>
          </Link>

          <p>
            Plataforma web para anúncio e reserva de casas, quartos e apartamentos
            para arrendamento.
          </p>
        </div>

        <div>
          <h3>Links</h3>
          <Link to="/">Início</Link>
          <Link to="/como-funciona">Como funciona</Link>
          <Link to="/cadastro">Criar conta</Link>
        </div>

        <div>
          <h3>Objetivo</h3>
          <p>
            Ajudar pessoas novas numa cidade a encontrar imóveis disponíveis
            de forma simples e organizada.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 RentHouse. | Desenvolvido por Fernando Nafiquirique cesar Fernando | Projeto acadêmico de programação web.</p>
      </div>
    </footer>
  );
}

export default Footer;