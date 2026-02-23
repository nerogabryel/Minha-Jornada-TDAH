# 001 - Configuração Inicial e Refinamento do MVP

**Data:** 27/05/2024 (Data atual simulada)
**Autor:** Senior Frontend Engineer

## 1. Contexto
O projeto iniciou com o objetivo de criar um portal de atividades para alunas de um curso sobre TDAH. O requisito principal era uma interface mobile-first, limpa, acessível e focada na experiência do usuário (UX), utilizando React e Tailwind CSS.

## 2. Mudanças Realizadas

### 2.1. Estrutura Base e Stack
- **O que mudou:** Criação do scaffolding inicial com React Router v6, Context API para Auth e Tailwind CSS via CDN (para prototipagem rápida).
- **Como:** 
  - `Layout.tsx` define a estrutura shell (Header, Sidebar/BottomNav).
  - `AuthContext.tsx` gerencia o estado global de usuário.
  - Uso de **Lucide React** para ícones consistentes.
- **Por que:** React Router é padrão para SPAs. Context API evita prop-drilling desnecessário para dados simples como "Usuário Logado". Tailwind permite iteração visual extremamente rápida.

### 2.2. Autenticação (Mock & Demo)
- **O que mudou:** Implementação de uma tela de login com validação visual e um botão "Entrar como Aluna (Demo)".
- **Como:** Adicionado método `handleTestLogin` no componente `Login.tsx` que preenche estados e dispara o login mockado.
- **Por que:** Facilita o teste manual e o desenvolvimento sem a necessidade de digitar credenciais repetidamente ou configurar um backend real neste estágio.

### 2.3. Modelagem de Dados (Refinamento Crítico)
- **O que mudou:** A estrutura de dados plana (`Modules`) foi aprofundada para uma árvore hierárquica: `Module -> Lesson[] -> Activity[]`.
- **Como:** Atualização de `types.ts` e `constants.ts`.
- **Por que:** 
  - **Erro evitado:** Inicialmente, as atividades estavam soltas no módulo. Isso não reflete a realidade de um curso (onde atividades são ligadas a aulas).
  - A nova estrutura permite renderizar listas de aulas detalhadas e agrupar atividades logicamente.

### 2.4. Navegação e Fluxo de Atividades
- **O que mudou:** 
  - Criação de `ModulesList.tsx` (estilo *accordion*) para navegação detalhada.
  - Criação de `ActivityView.tsx` para execução da atividade.
  - Lógica inteligente no `DashboardHome` para o botão "Continuar".
- **Como:** O Dashboard agora itera sobre a árvore de módulos para encontrar a *primeira atividade não concluída* (`find(!isCompleted)`) e gera o link direto.
- **Por que:** 
  - **UX TDAH:** Pessoas com TDAH podem ter dificuldade em decidir "o que fazer agora" (paralisia de análise). O botão "Continuar" remove essa fricção, levando a aluna direto para a ação.

### 2.5. UI/UX e Micro-interações
- **O que mudou:** Adição de animações (`fade-in`, `slide-up`) e feedback visual (ícones de check verde, barras de progresso).
- **Como:** Configuração estendida do Tailwind no `index.html` com `keyframes`.
- **Por que:** Uma interface estática parece "dura". Animações suaves tornam a experiência mais acolhedora e moderna. O feedback visual de progresso é crucial para a motivação (dopamina) do público-alvo.

## 3. Lições Aprendidas e Próximos Passos

- **Lição:** A estrutura de dados deve ser definida com precisão antes de construir componentes de lista complexos. Tivemos que refatorar o `Dashboard` quando mudamos de `Module->Activity` para `Module->Lesson->Activity`.
- **Atenção Futura:** Atualmente, o estado de "Concluído" é local e volátil. Precisaremos persistir isso em `localStorage` ou Backend em breve para que o progresso não se perca ao recarregar (F5).
- **Melhoria Necessária:** Os componentes de atividade (`text_reflection`, `quiz`) estão "hardcoded" dentro do `ActivityView`. Futuramente, devemos criar uma *Factory* de componentes (`ActivityRenderer`) para escalar novos tipos de atividades sem poluir a view principal.