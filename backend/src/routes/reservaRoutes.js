const express = require("express");

const {
  criarReserva,
  listarReservas,
  atualizarEstadoReserva,
  removerReserva,
} = require("../controllers/reservaController");

const {
  autenticarToken,
  permitirTipos,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", autenticarToken, permitirTipos("CLIENTE"), criarReserva);

router.get(
  "/",
  autenticarToken,
  permitirTipos("CLIENTE", "PROPRIETARIO", "ADMIN"),
  listarReservas
);

router.put(
  "/:id/status",
  autenticarToken,
  permitirTipos("PROPRIETARIO", "ADMIN"),
  atualizarEstadoReserva
);

router.delete(
  "/:id",
  autenticarToken,
  permitirTipos("CLIENTE", "PROPRIETARIO", "ADMIN"),
  removerReserva
);

module.exports = router;