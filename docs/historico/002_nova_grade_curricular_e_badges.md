# 002 - Nova Grade Curricular e Badges de Status

**Data:** 27/05/2024
**Autor:** Senior Frontend Engineer

## 1. Contexto
A equipe de produto definiu o currículo real do curso, que é composto por 5 módulos específicos com atividades variadas. Além disso, foi solicitado que a interface de listagem de módulos (accordion) deixasse mais claro o status de cada aula ("Não iniciada", "Em andamento", "Concluída") ao invés de apenas um ícone simples.

## 2. Mudanças Realizadas

### 2.1. Dados Mockados (Curriculum)
- **O que mudou:** O arquivo `constants.ts` foi reescrito.
- **Como:** Inseridos Módulos 1 a 5, com aulas mapeadas 1-para-1 com atividades (reflexão, quiz, checklist, timeline, action plan).
- **Detalhe Técnico:** A estrutura `MOCK_MODULES` agora contém campos `motivational_text` (novo) e `duration` simulada.

### 2.2. Tipagem
- **O que mudou:** Interface `Activity` recebeu `motivational_text?: string`.
- **Por que:** Permitir mensagens de apoio específicas por atividade, essencial para o engajamento de alunas com TDAH (reforço positivo).

### 2.3. UI de Lista de Módulos (Status Badges)
- **O que mudou:** `ModulesList.tsx` agora renderiza "Cards" para cada aula/atividade.
- **Lógica de Status:**
  - `Concluída`: `activity.isCompleted === true`. (Verde)
  - `Em andamento`: A primeira atividade `!isCompleted` da lista. (Índigo/Destaque).
  - `Não iniciada`: Todas as atividades subsequentes. (Cinza).
- **Visual:** Adicionados badges coloridos (pílulas) ao lado do título da aula para rápida identificação visual.

### 2.4. Visualização de Atividade
- **O que mudou:** `ActivityView.tsx` agora exibe o `motivational_text` em destaque no topo, com ícone de brilho (`Sparkles`), se o campo existir.

## 3. Justificativa
A diferenciação visual entre "Em andamento" e "Não iniciada" ajuda a reduzir a ansiedade da aluna, mostrando claramente qual é o próximo passo sem sobrecarregá-la com todo o conteúdo futuro de uma vez (conceito de *chunking* visual).

## 4. Próximos Passos
- Implementar as interfaces específicas para `checklist`, `timeline` e `action_plan` que ainda estão com placeholders.
- Persistir o estado de conclusão (atualmente resetado ao recarregar a página).