# Vasco Analytics ??

O **Vasco Analytics** é uma plataforma Full-Stack de "Scouting" e gerenciamento de elenco focada em dados e estatísticas do Vasco da Gama (e outras equipes via Football Manager/Sofascore).

## ?? Tecnologias

- **Frontend:** Next.js 14, TailwindCSS, Lucide-React (Interface Minimalista Dark)
- **Backend:** NestJS, Prisma ORM, GraphQL, REST
- **Banco de Dados:** PostgreSQL
- **Processamento de Dados:** Scripts em Python (via Pandas/BS4) para ingestão automatizada em lote.

---

## ??? Como Executar Localmente

**1. Instalar Dependências**
```bash
# No diretório raiz
cd backend && npm install
cd ../frontend && npm install
```

**2. Configurar Variáveis de Ambiente**
Crie um arquivo `.env` na pasta `backend`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/vasco_analytics?schema=public"
```

**3. Iniciar o Banco de Dados (Prisma)**
```bash
cd backend
npx prisma migrate dev
```

**4. Rodar o Sistema**
```bash
# Terminal 1 - Backend (Porta 3001)
cd backend && npm run start:dev

# Terminal 2 - Frontend (Porta 3000)
cd frontend && npm run dev
```

Acesse: `http://localhost:3000`

---

## ?? Deploy na Nuvem (Free Tier)

Para publicar o sistema gratuitamente, recomendamos a seguinte stack:

1. **Vercel (Frontend):** 
   - Conecte o seu repositório do GitHub na Vercel.
   - Defina o "Root Directory" para `frontend`.
   - O Next.js será detectado e implantado automaticamente com CDN global gratuita.

2. **Render.com (Backend):**
   - Crie um "Web Service".
   - Aponte para o diretório `backend`.
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
   - *Nota: No plano gratuito da Render, a API "dorme" após 15min de inatividade e pode demorar 30s para responder na primeira chamada.*

3. **Supabase (Banco de Dados):**
   - Crie um projeto gratuito e pegue a URL de conexão do PostgreSQL.
   - Substitua a variável `DATABASE_URL` tanto no `.env` do backend no Render.com, quanto no seu PC para rodar migrações:
     `npx prisma migrate deploy`

---

## ?? Gerenciamento de Fotos (Imagens de Jogadores e Clubes)

Por padrão, a aplicação lê fotos a partir do repositório físico na pasta do Frontend. Como os serviços gratuitos na nuvem são "Stateless" (resetam os arquivos ao reiniciar), a forma mais segura de hospedar as imagens é mantê-las junto com o código no GitHub.

**Como adicionar novas fotos:**
1. Salve as imagens no seu computador.
2. Coloque-as dentro de:
   - Fotos de Jogadores: `frontend/public/fotos-jogadores/`
   - Escudos de Times: `frontend/public/logos/`
3. Certifique-se de que o nome do arquivo seja exato ao nome do jogador/time em minúsculas (ex: `lucas-piton.png`, `vasco.png`).
4. Dê `git commit` e `git push` nas imagens para o repositório. O servidor vai atualizar automaticamente e as imagens não serão perdidas!

