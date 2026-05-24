import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function VoltarTopo() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    function verificarScroll() {
      setVisivel(window.scrollY > 350);
    }

    window.addEventListener("scroll", verificarScroll);

    return () => {
      window.removeEventListener("scroll", verificarScroll);
    };
  }, []);

  function voltarParaTopo() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!visivel) return null;

  return (
    <button className="btn-voltar-topo" onClick={voltarParaTopo}>
      <ArrowUp size={22} />
    </button>
  );
}

export default VoltarTopo;