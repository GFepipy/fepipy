# Fepipy

Plataforma para conectar atletas com clubes/empresários, oferecendo vitrine de talentos, eventos e candidaturas.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Banco de dados:** PostgreSQL

## Estrutura do projeto

```
.
├── backend
│   ├── db
│   │   └── schema.sql
│   └── src
│       ├── middleware
│       ├── routes
│       ├── db.js
│       ├── index.js
│       └── seed.js
└── frontend
    └── src
```

## Modelagem principal

- **Atleta:** nome, idade, posição, cidade, altura/peso, estatísticas, habilidades, vídeos (URLs), status, contatos.
- **Evento:** título, descrição, data/local, requisitos, organizador (clube/empresário).
- **Candidatura:** atleta, evento, status, observações.

## Configuração

### Backend

1. Crie um banco PostgreSQL e defina a variável `DATABASE_URL`:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/fepipy
JWT_SECRET=uma_chave_segura
PORT=4000
```

2. Execute o schema:

```
psql "$DATABASE_URL" -f backend/db/schema.sql
```

3. Instale dependências e rode o servidor:

```
cd backend
npm install
npm run dev
```

4. Opcional: carregar dados de exemplo:

```
npm run seed
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## Endpoints principais

- **Autenticação:** `POST /api/auth/register`, `POST /api/auth/login`
- **Atletas:** `GET /api/athletes`, `GET /api/athletes/:id`, `POST /api/athletes`, `PUT /api/athletes/:id`
- **Eventos:** `GET /api/events`, `GET /api/events/:id`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`
- **Candidaturas:** `POST /api/events/:eventId/applications`, `GET /api/events/:eventId/applications`, `PATCH /api/applications/:id/status`

## Validações e feedback

- Backend valida campos obrigatórios e perfil de acesso (atleta vs organizador).
- Frontend traz mensagens de erro nos formulários e feedback ao salvar perfil.

## Seeds/Dados de exemplo

O comando `npm run seed` cria:
- Usuário atleta (`atleta@demo.com` / senha `senha123`)
- Usuário organizador (`clube@demo.com` / senha `senha123`)
- Um atleta e um evento de demonstração.
