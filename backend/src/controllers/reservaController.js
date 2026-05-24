const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function criarReserva(req, res) {
  try {
    const { imovelId, mensagem } = req.body;

    if (!imovelId) {
      return res.status(400).json({
        mensagem: "O imóvel é obrigatório.",
      });
    }

    const imovel = await prisma.imovel.findUnique({
      where: {
        id: Number(imovelId),
      },
    });

    if (!imovel) {
      return res.status(404).json({
        mensagem: "Imóvel não encontrado.",
      });
    }

    if (imovel.estado !== "DISPONIVEL") {
      return res.status(400).json({
        mensagem: "Este imóvel não está disponível para reserva.",
      });
    }

    if (imovel.proprietarioId === req.user.id) {
      return res.status(400).json({
        mensagem: "Não podes reservar o teu próprio imóvel.",
      });
    }

    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        imovelId: Number(imovelId),
        clienteId: req.user.id,
        estado: "PENDENTE",
      },
    });

    if (reservaExistente) {
      return res.status(400).json({
        mensagem: "Você já solicitou reserva para este imóvel.",
      });
    }

    const reserva = await prisma.reserva.create({
      data: {
        imovelId: Number(imovelId),
        clienteId: req.user.id,
        mensagem,
        estado: "PENDENTE",
      },
      include: {
        imovel: true,
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
      },
    });

    return res.status(201).json({
      mensagem:
        "Reserva solicitada com sucesso. O imóvel continuará disponível até o proprietário confirmar.",
      reserva,
    });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return res.status(500).json({
      mensagem: "Erro ao criar reserva.",
    });
  }
}

async function listarReservas(req, res) {
  try {
    let where = {};

    if (req.user.tipo === "CLIENTE") {
      where.clienteId = req.user.id;
    }

    if (req.user.tipo === "PROPRIETARIO") {
      where.imovel = {
        proprietarioId: req.user.id,
      };
    }

    const reservas = await prisma.reserva.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
        imovel: {
          include: {
            proprietario: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json(reservas);
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    return res.status(500).json({
      mensagem: "Erro ao listar reservas.",
    });
  }
}

async function atualizarEstadoReserva(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ["PENDENTE", "CONFIRMADA", "CANCELADA", "FINALIZADA"];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        mensagem: "Estado da reserva inválido.",
      });
    }

    const reserva = await prisma.reserva.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        imovel: true,
      },
    });

    if (!reserva) {
      return res.status(404).json({
        mensagem: "Reserva não encontrada.",
      });
    }

    if (
      req.user.tipo !== "ADMIN" &&
      reserva.imovel.proprietarioId !== req.user.id
    ) {
      return res.status(403).json({
        mensagem: "Não tens permissão para alterar esta reserva.",
      });
    }

    const reservaAtualizada = await prisma.reserva.update({
      where: {
        id: Number(id),
      },
      data: {
        estado,
      },
      include: {
        imovel: true,
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
      },
    });

    if (estado === "CANCELADA") {
      await prisma.imovel.update({
        where: {
          id: reserva.imovelId,
        },
        data: {
          estado: "DISPONIVEL",
        },
      });
    }

    if (estado === "CONFIRMADA") {
      await prisma.imovel.update({
        where: {
          id: reserva.imovelId,
        },
        data: {
          estado: "RESERVADO",
        },
      });

      await prisma.reserva.updateMany({
        where: {
          imovelId: reserva.imovelId,
          id: {
            not: Number(id),
          },
          estado: "PENDENTE",
        },
        data: {
          estado: "CANCELADA",
        },
      });
    }

    if (estado === "FINALIZADA") {
      await prisma.imovel.update({
        where: {
          id: reserva.imovelId,
        },
        data: {
          estado: "ARRENDADO",
        },
      });
    }

    return res.json({
      mensagem: "Estado da reserva atualizado com sucesso.",
      reserva: reservaAtualizada,
    });
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    return res.status(500).json({
      mensagem: "Erro ao atualizar reserva.",
    });
  }
}

async function removerReserva(req, res) {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        imovel: true,
      },
    });

    if (!reserva) {
      return res.status(404).json({
        mensagem: "Reserva não encontrada.",
      });
    }

    if (
      req.user.tipo !== "ADMIN" &&
      reserva.clienteId !== req.user.id &&
      reserva.imovel.proprietarioId !== req.user.id
    ) {
      return res.status(403).json({
        mensagem: "Não tens permissão para remover esta reserva.",
      });
    }

    await prisma.reserva.delete({
      where: {
        id: Number(id),
      },
    });

    if (reserva.estado === "CONFIRMADA") {
      await prisma.imovel.update({
        where: {
          id: reserva.imovelId,
        },
        data: {
          estado: "DISPONIVEL",
        },
      });
    }

    return res.json({
      mensagem: "Reserva removida com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao remover reserva:", error);
    return res.status(500).json({
      mensagem: "Erro ao remover reserva.",
    });
  }
}

module.exports = {
  criarReserva,
  listarReservas,
  atualizarEstadoReserva,
  removerReserva,
};