# Node.js + RabbitMQ

## Visão Geral

Este projeto é composto por:

- **Frontend**: Next.js
- **Backend**: NestJS
- **Banco de Dados**: PostgreSQL
- **Broker**: RabbitMQ

O backend recebe mensagens do frontend, criptografa, persiste no banco de dados e publica na fila. Um consumer assíncrono processa o status de funil — atualmente, apenas fazendo log dos dados recebidos.

---

## Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Setup Recomendado

```bash
git clone git@github.com:mkafonso/rabbitmq-nodejs.git
cd rabbitmq-nodejs
```

### Entrar no pasta /backend

```bash
cd backend
cp .env.example .env
```

### Subir os container

```bash
docker-compose up
```

### Entrar no pasta /frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev

# A aplicação estará disponível em:
# http://localhost:3000/
```

---

## Observações

- O backend aguarda o RabbitMQ e o banco estarem prontos antes de iniciar.
- O processamento de status de funil é feito de forma assíncrona via fila.
- Por enquanto, o consumer apenas imprime os dados processados no log.
