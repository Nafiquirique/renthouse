const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function criarImovel(req, res) {
  try {
    const {
      titulo,
      descricao,
      tipo,
      preco,
      cidade,
      bairro,
      endereco,
      imagem,
      contacto,
    } = req.body;

    if (!titulo || !descricao || !tipo || !preco || !cidade || !bairro) {
      return res.status(400).json({
        mensagem:
          "Título, descrição, tipo, preço, cidade e bairro são obrigatórios.",
      });
    }

    const tiposValidos = ["QUARTO", "CASA", "APARTAMENTO", "DEPENDENCIA"];

    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        mensagem: "Tipo de imóvel inválido.",
      });
    }

    const imovel = await prisma.imovel.create({
      data: {
        titulo,
        descricao,
        tipo,
        preco: Number(preco),
        cidade,
        bairro,
        endereco,
        imagem,
        contacto,
        estado: "DISPONIVEL",
        proprietarioId: req.user.id,
      },
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
    });

    return res.status(201).json({
      mensagem: "Imóvel cadastrado com sucesso.",
      imovel,
    });
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    return res.status(500).json({
      mensagem: "Erro ao criar imóvel.",
    });
  }
}

async function listarImoveis(req, res) {
  try {
    const { cidade, bairro, tipo, precoMin, precoMax } = req.query;

    const filtros = {
      estado: "DISPONIVEL",
    };

    if (cidade) {
      filtros.cidade = {
        contains: cidade,
      };
    }

    if (bairro) {
      filtros.bairro = {
        contains: bairro,
      };
    }

    if (tipo) {
      filtros.tipo = tipo;
    }

    if (precoMin || precoMax) {
      filtros.preco = {};

      if (precoMin) {
        filtros.preco.gte = Number(precoMin);
      }

      if (precoMax) {
        filtros.preco.lte = Number(precoMax);
      }
    }

    const imoveis = await prisma.imovel.findMany({
      where: filtros,
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
      orderBy: {
        id: "desc",
      },
    });

    return res.json(imoveis);
  } catch (error) {
    console.error("Erro ao listar imóveis:", error);
    return res.status(500).json({
      mensagem: "Erro ao listar imóveis.",
    });
  }
}

async function listarTodosImoveisAdmin(req, res) {
  try {
    const imoveis = await prisma.imovel.findMany({
      include: {
        proprietario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
        reservas: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json(imoveis);
  } catch (error) {
    console.error("Erro ao listar todos os imóveis:", error);
    return res.status(500).json({
      mensagem: "Erro ao listar todos os imóveis.",
    });
  }
}

async function listarMeusImoveis(req, res) {
  try {
    const imoveis = await prisma.imovel.findMany({
      where: {
        proprietarioId: req.user.id,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json(imoveis);
  } catch (error) {
    console.error("Erro ao listar meus imóveis:", error);
    return res.status(500).json({
      mensagem: "Erro ao listar seus imóveis.",
    });
  }
}

async function buscarImovelPorId(req, res) {
  try {
    const { id } = req.params;

    const imovel = await prisma.imovel.findUnique({
      where: {
        id: Number(id),
      },
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
    });

    if (!imovel) {
      return res.status(404).json({
        mensagem: "Imóvel não encontrado.",
      });
    }

    return res.json(imovel);
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    return res.status(500).json({
      mensagem: "Erro ao buscar imóvel.",
    });
  }
}

async function atualizarImovel(req, res) {
  try {
    const { id } = req.params;

    const imovel = await prisma.imovel.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!imovel) {
      return res.status(404).json({
        mensagem: "Imóvel não encontrado.",
      });
    }

    if (req.user.tipo !== "ADMIN" && imovel.proprietarioId !== req.user.id) {
      return res.status(403).json({
        mensagem: "Não tens permissão para editar este imóvel.",
      });
    }

    const {
      titulo,
      descricao,
      tipo,
      preco,
      cidade,
      bairro,
      endereco,
      imagem,
      contacto,
      estado,
    } = req.body;

    const estadosValidos = ["DISPONIVEL", "RESERVADO", "ARRENDADO"];

    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({
        mensagem: "Estado do imóvel inválido.",
      });
    }

    const imovelAtualizado = await prisma.imovel.update({
      where: {
        id: Number(id),
      },
      data: {
        titulo,
        descricao,
        tipo,
        preco: preco !== undefined ? Number(preco) : undefined,
        cidade,
        bairro,
        endereco,
        imagem,
        contacto,
        estado,
      },
    });

    return res.json({
      mensagem: "Imóvel atualizado com sucesso.",
      imovel: imovelAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar imóvel:", error);
    return res.status(500).json({
      mensagem: "Erro ao atualizar imóvel.",
    });
  }
}

async function removerImovel(req, res) {
  try {
    const { id } = req.params;

    const imovel = await prisma.imovel.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!imovel) {
      return res.status(404).json({
        mensagem: "Imóvel não encontrado.",
      });
    }

    if (req.user.tipo !== "ADMIN" && imovel.proprietarioId !== req.user.id) {
      return res.status(403).json({
        mensagem: "Não tens permissão para remover este imóvel.",
      });
    }

    await prisma.reserva.deleteMany({
      where: {
        imovelId: Number(id),
      },
    });

    await prisma.imovel.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({
      mensagem: "Imóvel removido com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao remover imóvel:", error);
    return res.status(500).json({
      mensagem: "Erro ao remover imóvel.",
    });
  }
}

module.exports = {
  criarImovel,
  listarImoveis,
  listarTodosImoveisAdmin,
  listarMeusImoveis,
  buscarImovelPorId,
  atualizarImovel,
  removerImovel,
};