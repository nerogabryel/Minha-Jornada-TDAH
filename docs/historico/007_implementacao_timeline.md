# 007 - Implementação da Linha do Tempo (Timeline)

**Data:** 27/05/2024
**Autor:** Senior Frontend Engineer

## 1. Contexto
Para encerrar o Módulo 3 ("TDAH nas fases da vida"), foi solicitado um componente visual que permitisse à aluna reconstruir sua história sob a ótica do TDAH. O formato `timeline` ajuda a organizar memórias e identificar padrões de comportamento ao longo dos anos.

## 2. Mudanças Realizadas

### 2.1. Componente `ActivityView` (Timeline)
- **Visualização Vertical:** Implementada uma linha vertical conectando as fases (Infância, Adolescência, etc.), otimizada para telas mobile.
- **Cartões Expansíveis:** Cada fase é um "acordeão". Isso mantém a tela limpa, permitindo que a aluna foque em preencher uma fase por vez sem rolagem excessiva.
- **Indicadores de Status:** Um ponto (`dot`) na linha do tempo muda de cinza para roxo (`indigo-600`) assim que a aluna insere qualquer texto naquela fase, fornecendo feedback visual de progresso.
- **Campos Estruturados:** Ao invés de um texto livre gigante, cada fase tem 3 campos específicos (Desafios, Superação, Conquistas) para guiar a reflexão.

### 2.2. Dados Mockados
- Configurada a atividade `act-3-end` com as 4 fases da vida e os prompts de reflexão correspondentes.

### 2.3. Persistência de Rascunho
- Reutilizada a lógica de `handleSaveDraft` existente para permitir salvar o progresso da linha do tempo, já que é uma atividade longa que pode exigir mais de uma sessão.

## 3. Justificativa de UX
- **Linha Vertical:** Linhas horizontais quebram em telas pequenas (celulares). A vertical é nativa do scroll mobile.
- **Divisão por Fases:** Escrever sobre a vida toda de uma vez é intimidador. Dividir em blocos menores (Infância, Adolescência...) torna a tarefa gerenciável.

## 4. Próximos Passos
- Implementar o último tipo de atividade: `action_plan`.