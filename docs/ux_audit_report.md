# Relatório de Auditoria UX/UI - Minha Jornada TDAH

**Data:** 20/02/2026
**Autor:** Senior Product Designer

## 1. Visão Geral
A interface atual é funcional e limpa, utilizando bem o sistema de design do Tailwind CSS. No entanto, para um público com TDAH, a carga cognitiva visual pode ser otimizada. O uso de gradientes pesados e sombras padrão pode ser substituído por uma estética mais "calma" e focada, reduzindo distrações e aumentando a clareza.

## 2. Pontuação por Componente (0-100)

### Dashboard (72/100)
- **Pontos Fortes:** Saudação personalizada, visão clara do progresso.
- **Pontos Fracos:** O card "Em andamento" com gradiente forte (`from-indigo-600 to-indigo-800`) pode ser visualmente cansativo. A hierarquia entre "Progresso Geral" e "Ofensiva" compete por atenção.
- **Oportunidade:** Suavizar o card principal para algo mais orgânico e menos "gritante". Melhorar o espaçamento (whitespace) para dar respiro.

### Navegação / Sidebar (68/100)
- **Pontos Fortes:** Ícones claros, estrutura lógica.
- **Pontos Fracos:** O estado ativo é funcional mas genérico. A sidebar fixa ocupa espaço valioso em telas médias sem recolher elegantemente.
- **Oportunidade:** Criar um estado ativo mais sutil (pílula flutuante ou indicador lateral refinado). Melhorar a transição mobile.

### Lista de Módulos (75/100)
- **Pontos Fortes:** Accordion funciona bem para esconder complexidade. Indicadores de status são claros.
- **Pontos Fracos:** A lista pode parecer densa quando expandida. A distinção visual entre módulos bloqueados e desbloqueados é um pouco drástica (opacidade 60%).
- **Oportunidade:** Usar cards mais separados visualmente. Melhorar a tipografia dos títulos das lições.

### Visualização de Atividade (80/100)
- **Pontos Fortes:** Foco no conteúdo. Renderizadores específicos para cada tipo de atividade são excelentes.
- **Pontos Fracos:** O cabeçalho da atividade ocupa muito espaço vertical antes do conteúdo real.
- **Oportunidade:** Compactar o cabeçalho para trazer o conteúdo para "above the fold" mais rapidamente.

### Tipografia e Cores (70/100)
- **Pontos Fortes:** Legibilidade boa com Inter.
- **Pontos Fracos:** Contraste de cinzas (`gray-500` vs `gray-400`) às vezes é baixo. Falta de uma cor de destaque "calma" (ex: teal ou sage) para balancear o índigo corporativo.

## 3. Plano de Execução de Melhorias

### Objetivo: "Calm Focus" (Foco Calmo)
Transformar a interface em um ambiente que reduz a ansiedade e promove o foco, utilizando princípios de design neuroinclusivo.

1.  **Refinamento Global (CSS):**
    -   Introduzir animações mais suaves (`cubic-bezier`).
    -   Definir uma paleta de sombras mais difusa e natural.
    -   Melhorar a tipografia com `tracking-tight` em títulos para modernidade.

2.  **Dashboard Zen:**
    -   Redesenhar o card principal: remover o gradiente sólido pesado, usar um fundo sutil com borda colorida ou padrão suave.
    -   Simplificar os cards de estatísticas.

3.  **Navegação Refinada:**
    -   Polir a Sidebar para parecer menos "admin panel" e mais "jornada pessoal".

4.  **Módulos Claros:**
    -   Aumentar o espaçamento entre itens da lista.
    -   Melhorar o feedback visual de hover/focus.

---
*Este plano será executado imediatamente a seguir.*
