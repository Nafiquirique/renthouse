const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function listarUsuarios(req, res) {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo: true,
        createdAt: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({
      mensagem: "Erro ao listar usuários.",
    });
  }
}

async function buscarUsuarioPorId(req, res) {
  try {
    const { id } = req.params;

    const usuario = await prisma.user.findUnique({
      where: {
        id: Number(id),
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

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    return res.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({
      mensagem: "Erro ao buscar usuário.",
    });
  }
}

async function buscarMeuPerfil(req, res) {
  try {
    const usuario = await prisma.user.findUnique({
      where: {
        id: req.user.id,
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

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    return res.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({
      mensagem: "Erro ao buscar perfil.",
    });
  }
}

async function atualizarMeuPerfil(req, res) {
  try {
    const { nome, telefone, senha } = req.body;

    if (!nome) {
      return res.status(400).json({
        mensagem: "O nome é obrigatório.",
      });
    }

    const dadosAtualizacao = {
      nome,
      telefone,
    };

    if (senha && senha.trim() !== "") {
      dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
    }

    const usuarioAtualizado = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: dadosAtualizacao,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo: true,
      },
    });

    return res.json({
      mensagem: "Perfil atualizado com sucesso.",
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({
      mensagem: "Erro ao atualizar perfil.",
    });
  }
}

async function removerUsuario(req, res) {
  try {
    const { id } = req.params;

    const usuario = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    if (usuario.tipo === "ADMIN") {
      return res.status(400).json({
        mensagem: "Não é permitido remover administrador.",
      });
    }

    await prisma.reserva.deleteMany({
      where: {
        clienteId: Number(id),
      },
    });

    const imoveis = await prisma.imovel.findMany({
      where: {
        proprietarioId: Number(id),
      },
    });

    for (const imovel of imoveis) {
      await prisma.reserva.deleteMany({
        where: {
          imovelId: imovel.id,
        },
      });
    }

    await prisma.imovel.deleteMany({
      where: {
        proprietarioId: Number(id),
      },
    });

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({
      mensagem: "Usuário removido com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
    return res.status(500).json({
      mensagem: "Erro ao remover usuário.",
    });
  }
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  buscarMeuPerfil,
  atualizarMeuPerfil,
  removerUsuario,
};