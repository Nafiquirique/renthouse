const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

async function register(req, res) {
  try {
    const { nome, email, senha, telefone, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "Nome, email e senha são obrigatórios.",
      });
    }

    const tiposValidos = ["PROPRIETARIO", "CLIENTE"];

    if (tipo && !tiposValidos.includes(tipo)) {
      return res.status(400).json({
        mensagem: "Tipo de usuário inválido. Só é permitido CLIENTE ou PROPRIETARIO.",
      });
    }

    const usuarioExiste = await prisma.user.findUnique({
      where: { email },
    });

    if (usuarioExiste) {
      return res.status(400).json({
        mensagem: "Este email já está cadastrado.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        telefone,
        tipo: tipo || "CLIENTE",
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario,
    });
  } catch (error) {
    console.error("Erro no register:", error);
    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário.",
    });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Email e senha são obrigatórios.",
      });
    }

    const usuario = await prisma.user.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos.",
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos.",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      mensagem: "Login feito com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({
      mensagem: "Erro ao fazer login.",
    });
  }
}

module.exports = {
  register,
  login,
};