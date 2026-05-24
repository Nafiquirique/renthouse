const express = require("express");

const {
  criarImovel,
  listarImoveis,
  listarTodosImoveisAdmin,
  listarMeusImoveis,
  buscarImovelPorId,
  atualizarImovel,
  removerImovel,
} = require("../controllers/imovelController");

const {
  autenticarToken,
  permitirTipos,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", listarImoveis);

router.get(
  "/admin/todos",
  autenticarToken,
  permitirTipos("ADMIN"),
  listarTodosImoveisAdmin
);

router.get(
  "/meus",
  autenticarToken,
  permitirTipos("PROPRIETARIO", "ADMIN"),
  listarMeusImoveis
);

router.get("/:id", buscarImovelPorId);

router.post(
  "/",
  autenticarToken,
  permitirTipos("PROPRIETARIO", "ADMIN"),
  criarImovel
);

router.put(
  "/:id",
  autenticarToken,
  permitirTipos("PROPRIETARIO", "ADMIN"),
  atualizarImovel
);

router.delete(
  "/:id",
  autenticarToken,
  permitirTipos("PROPRIETARIO", "ADMIN"),
  removerImovel
);

module.exports = router;