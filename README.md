# RentHouse

Sistema web para arrendamento e reserva de imóveis em Moçambique.

O RentHouse permite que proprietários publiquem imóveis disponíveis para arrendamento, enquanto clientes podem visualizar detalhes, solicitar reservas e acompanhar o estado das suas solicitações online.

---

#  Tecnologias Utilizadas

## Frontend
- React.js
- Vite
- CSS
- Axios

## Backend
- Node.js
- Express.js
- Prisma ORM
- JWT Authentication

## Banco de Dados
- PostgreSQL
- Neon Database

## Hospedagem
- Vercel (Frontend)
- Render (Backend)

---

#  Funcionalidades

 Cadastro de utilizadores  
 Login com autenticação JWT  
 Publicação de imóveis  
 Atualização e remoção de imóveis  
 Reserva de imóveis online  
 Gestão de reservas  
 Perfil do utilizador  
 Painel administrativo  
 Responsividade  
 Modo escuro  

---

#  Estrutura do Projeto

```bash
renthouse/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│
└── README.md
```

---

#  Instalação Local

## 1. Clonar o repositório

```bash
git clone https://github.com/Nafiquirique/renthouse.git
```

---

## 2. Entrar na pasta do projeto

```bash
cd renthouse
```

---

#  Configuração do Backend

## Entrar na pasta backend

```bash
cd backend
```

## Instalar dependências

```bash
npm install
```

## Criar arquivo .env

```env
DATABASE_URL="SUA_DATABASE_URL"
JWT_SECRET="SUA_CHAVE_SECRETA"
PORT=5000
```

## Executar migrations

```bash
npx prisma migrate deploy
```

## Iniciar backend

```bash
npm start
```

---

#  Configuração do Frontend

## Entrar na pasta frontend

```bash
cd frontend
```

## Instalar dependências

```bash
npm install
```

## Iniciar frontend

```bash
npm run dev
```

---

#  Deploy

## Frontend
Hospedado na Vercel: https://renthouse-livid.vercel.app/

## Backend
Hospedado no Render.

## Banco de Dados
Hospedado no Neon PostgreSQL.

---

#  Segurança

O sistema utiliza:
- JWT Authentication
- Criptografia de senhas com bcrypt
- Rotas protegidas
- Controle de permissões

---

#  Responsividade

O sistema adapta-se a:
- Smartphones
- Tablets
- Computadores

---

#  Autor

Nafiquirique

---

#  Licença

Este projeto foi desenvolvido para fins académicos.