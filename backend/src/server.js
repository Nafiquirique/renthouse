const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const imovelRoutes = require("./routes/imovelRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API RentHouse funcionando com sucesso!",
  });
});

app.use("/auth", authRoutes);
app.use("/imoveis", imovelRoutes);
app.use("/reservas", reservaRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});