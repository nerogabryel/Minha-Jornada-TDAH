# 004 - Implementação do Quiz Interativo

**Data:** 27/05/2024
**Autor:** Senior Frontend Engineer

## 1. Contexto
A plataforma precisava de um método de avaliação de conhecimento que fosse engajador e oferecesse aprendizado instantâneo, fugindo do modelo tradicional de "prova". O formato Quiz foi escolhido para a Aula 03.

## 2. Mudanças Realizadas

### 2.1. Estrutura de Dados (Mock)
- **O que mudou:** Atualização da `Aula 03` em `constants.ts`.
- **Detalhes:** Inserido array de objetos `questions` contendo:
  - Pergunta
  - Opções (Mito/Verdade)
  - Índice da resposta correta
  - Explicação detalhada (feedback pedagógico)

### 2.2. Lógica do Componente `ActivityView`
- **Máquina de Estados:** Adicionados estados para controlar o fluxo do quiz:
  - `quizStep`: Controla qual pergunta está sendo exibida.
  - `selectedOption`: Bloqueia novas escolhas após o clique.
  - `quizScore`: Contador de acertos.
  - `quizFinished`: Flag para trocar a view de perguntas pela view de resultados.
  
- **Feedback Imediato:** 
  - Ao clicar em uma opção, a interface revela instantaneamente se está correta (Verde) ou errada (Vermelho).
  - Uma caixa de explicação (`explanation`) surge abaixo das opções para reforçar o aprendizado, independentemente se a usuária acertou ou errou.

- **Fluxo de Conclusão:**
  - O botão principal "Concluir Atividade" fica oculto durante o quiz e só aparece na tela de resultados, garantindo que a aluna passe por todas as questões.
  - Adicionada opção de "Refazer Quiz" (`ResetState`), permitindo que a aluna tente melhorar sua pontuação.

## 3. Justificativa de UX
- **Cor e Ícones:** Uso intenso de Verde/Check e Vermelho/X para reduzir a carga cognitiva. A aluna não precisa ler para saber se acertou.
- **Barra de Progresso:** Essencial para pessoas com TDAH saberem quanto falta para terminar a tarefa, reduzindo a ansiedade de abandono.

## 4. Próximos Passos
- Implementar tipos de atividade `Checklist` e `Timeline`.