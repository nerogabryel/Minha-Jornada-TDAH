# Arquitetura Atual (Fevereiro/2026)

## Visão Geral do Sistema
O **Minha Jornada TDAH** é uma aplicação Single Page Application (SPA) React focada em acessibilidade, offline-first e gamificação para alunas de cursos sobre TDAH.

### Tech Stack
- **Frontend Core:** React 19, TypeScript, React Router DOM v7
- **Styling:** Tailwind CSS v4 (Vanilla)
- **Build Tooling:** Vite v6
- **Testes:** Vitest + React Testing Library + JSDOM
- **Backend/BaaS:** Supabase (Auth + PostgreSQL Database)
- **Deploy:** Vercel / Netlify configs

## Estrutura de Diretórios
```text
├── components/          # Componentes visuais
│   ├── activities/      # Renderizadores polimórficos de atividades
│   └── ...              # Outros componentes (Login, Modal, Toast etc.)
├── context/             # Gerenciamento de Estado Global (Providers)
├── services/            # Serviços externos (ex: supabaseClient.ts)
├── supabase/            # Configs e migrações do banco (001_schema.sql)
├── tests/               # Suítes de testes automatizados unitários/integração
└── docs/                # Documentação técnica e histórico de decisões
```

## Padrões de Projeto e Fluxo de Dados

### 1. Offline-First (Graceful Degradation)
O app funciona 100% sem backend configurado.
- Os contextos (`ProgressContext`, `JournalContext`, `AuthContext`) interceptam chamadas ao Supabase.
- Se o Supabase falhar ou não estiver configurado, as modificações são gravadas de forma persistente no `localStorage` do navegador.
- Quando online, o padrão adotado é **Write-Through Cache**: salvamos localmente (para UI otimista) e disparamos a promise de sync com o banco em background (Fire and Forget).

### 2. Autenticação (AuthContext)
- Usa o módulo `@supabase/supabase-js`.
- Fluxos: `signInWithPassword`, `signUp`, `resetPasswordForEmail`, e fallback offline.
- Políticas de segurança: RLS (Row Level Security) aplicadas diretamente no banco PostgreSQL para que o usuário X só veja os registros do usuário X.

### 3. Gamificação e Progresso (ProgressContext)
- Módulos, Lições e Atividades baseadas em arrays de objetos hierárquicos.
- O progresso global (%) é calculado dinamicamente com base nas atividades macadas como `isCompleted: true`.
- **Streak:** O sistema de streak (ofensiva diária) analisa datas e conta dias consecutivos. Funciona offline (localStorage) e online (Supabase).
- Renderização Polimórfica: Cada tipo de atividade possui um componente específico em `components/activities/*` encapsulando sua lógica (Ex: `QuizRenderer`, `TimelineRenderer`).

### 4. Gestão de Testes
- A suíte de testes (20 testes funcionais) roda via JSDOM no Vitest.
- O arquivo `setup.ts` garante que o DOM falso simule perfeitamente os limites do navegador (injeta mocks para `crypto.randomUUID` e `localStorage`).
