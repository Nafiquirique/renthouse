const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const emailAdmin = "admin@gmail.com";

  const adminExiste = await prisma.user.findUnique({
    where: {
      email: emailAdmin,
    },
  });

  if (adminExiste) {
    console.log("Administrador já existe.");
    return;
  }

  const senhaCriptografada = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      nome: "Administrador",
      email: emailAdmin,
      senha: senhaCriptografada,
      telefone: "840000003",
      tipo: "ADMIN",
    },
  });

  console.log("Administrador criado com sucesso:", admin.email);
}

main()
  .catch((error) => {
    console.error("Erro ao criar administrador:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });