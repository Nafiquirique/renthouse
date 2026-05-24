const express = require("express");

const {
  listarUsuarios,
  buscarUsuarioPorId,
  buscarMeuPerfil,
  atualizarMeuPerfil,
  removerUsuario,
} = require("../controllers/userController");

const {
  autenticarToken,
  permitirTipos,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", autenticarToken, buscarMeuPerfil);
router.put("/me", autenticarToken, atualizarMeuPerfil);

router.get("/", autenticarToken, permitirTipos("ADMIN"), listarUsuarios);
router.get("/:id", autenticarToken, permitirTipos("ADMIN"), buscarUsuarioPorId);
router.delete("/:id", autenticarToken, permitirTipos("ADMIN"), removerUsuario);

module.exports = router;