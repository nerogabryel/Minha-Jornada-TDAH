# 005 - Implementação do Checklist de Autoavaliação

**Data:** 27/05/2024
**Autor:** Senior Frontend Engineer

## 1. Contexto
O Módulo 2 do curso foca em diagnóstico e autoanálise. A ferramenta principal é um checklist de sintomas. É crucial que a interface seja clara, fácil de usar e, principalmente, contenha avisos de responsabilidade médica para evitar autodiagnósticos errôneos.

## 2. Mudanças Realizadas

### 2.1. Componente `ActivityView` (Checklist)
- **Novo Estado:** Adicionado `checklistAnswers`, um objeto (Record) que mapeia o índice da pergunta para `true` (Sim) ou `false` (Não).
- **Interface de Lista:** Renderização de cada item do checklist em um card individual com botões de toggle (Sim/Não).
- **Feedback Visual:** Botões mudam de cor (Verde/Vermelho) quando selecionados, facilitando a revisão visual.
- **Painel de Resumo:** Ao final da lista, um card exibe a contagem total de "Sim" em tempo real e uma mensagem fixa de orientação.

### 2.2. Disclaimer e Segurança
- Adicionado um banner amarelo (`bg-amber-50`) no topo da atividade com um ícone de alerta, reforçando que a ferramenta é apenas para reflexão, não diagnóstico clínico.

### 2.3. Dados Mockados
- Preenchimento da atividade `act-2-1` com 10 sintomas clássicos de TDAH em adultos, conforme especificação.

## 3. Justificativa de UX
- **Botões Grandes:** Facilita o toque em dispositivos móveis.
- **Toggle Explícito:** Optamos por botões "Sim/Não" lado a lado ao invés de um checkbox simples, pois obriga a usuária a tomar uma decisão consciente sobre cada item, aumentando a precisão da autoavaliação.
- **Contagem Automática:** Remove a necessidade da aluna somar manualmente seus pontos, o que seria uma barreira para usuárias com discalculia ou dificuldades de atenção.

## 4. Próximos Passos
- Implementar `timeline` e `action_plan`.