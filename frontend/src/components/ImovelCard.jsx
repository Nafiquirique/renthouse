import { Link } from "react-router-dom";
import { MapPin, Home, Banknote } from "lucide-react";

function ImovelCard({ imovel }) {
  return (
    <div className="card-imovel">
      <img
        src={
          imovel.imagem ||
          "https://images.unsplash.com/photo-1560184897-ae75f418493e"
        }
        alt={imovel.titulo}
      />

      <div className="card-body">
        <span className="tag">{imovel.tipo}</span>

        <h3>{imovel.titulo}</h3>

        <p className="descricao">{imovel.descricao}</p>

        <div className="info">
          <span>
            <MapPin size={16} />
            {imovel.cidade}, {imovel.bairro}
          </span>

          <span>
            <Home size={16} />
            {imovel.estado}
          </span>

          <span>
            <Banknote size={16} />
            {Number(imovel.preco).toLocaleString()} MT/mês
          </span>
        </div>

        <Link to={`/imoveis/${imovel.id}`} className="btn-primary">
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}

export default ImovelCard;