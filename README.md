# Minha Jornada TDAH

Portal de atividades e autoconhecimento para alunas do curso sobre TDAH.

## 🚀 Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (opcional — funciona sem Supabase)
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

O app abre em [http://localhost:3000](http://localhost:3000).

## 🧪 Testes

```bash
npm test          # Rodar testes uma vez
npm run test:watch  # Rodar em modo watch
```

## 🏗️ Build de Produção

```bash
npm run build     # Gera bundle em dist/
npm run preview   # Preview do build local
```

## 🌐 Deploy

### Vercel (Recomendado)
1. Conecte o repositório no [vercel.com](https://vercel.com)
2. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automático a cada push

### Netlify
1. Conecte o repositório no [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Adicione as variáveis de ambiente nas settings

## 🗄️ Banco de Dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute `supabase/migrations/001_schema.sql` no SQL Editor
3. Copie a URL e anon key para as variáveis de ambiente

> Sem Supabase, o app funciona em modo offline (localStorage).

## 📁 Estrutura

```
├── components/          # Componentes React
│   ├── activities/      # Renderizadores de atividade (quiz, checklist, etc.)
│   ├── Login.tsx        # Auth (login/cadastro/reset)
│   ├── DashboardHome.tsx
│   ├── ModulesList.tsx
│   ├── JournalView.tsx
│   └── ...
├── context/             # Providers (Auth, Progress, Journal)
├── services/            # Supabase client
├── tests/               # Vitest test suites
├── supabase/migrations/ # SQL schema
└── public/              # Assets estáticos
```
