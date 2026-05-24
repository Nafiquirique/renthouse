const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensagem: "Token não fornecido.",
    });
  }

  const partes = authHeader.split(" ");

  if (partes.length !== 2) {
    return res.status(401).json({
      mensagem: "Token inválido.",
    });
  }

  const [tipo, token] = partes;

  if (tipo !== "Bearer") {
    return res.status(401).json({
      mensagem: "Formato do token inválido.",
    });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.user = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token expirado ou inválido.",
    });
  }
}

function permitirTipos(...tiposPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
    }

    if (!tiposPermitidos.includes(req.user.tipo)) {
      return res.status(403).json({
        mensagem: "Acesso negado.",
      });
    }

    next();
  };
}

module.exports = {
  autenticarToken,
  permitirTipos,
};