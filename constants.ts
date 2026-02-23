import { Module, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Ana Silva',
  email: 'ana.silva@exemplo.com',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const MOCK_MODULES: Module[] = [
  {
    id: 'mod-1',
    title: 'Módulo 1: Entendendo o TDAH',
    description: 'Compreenda o funcionamento do seu cérebro e desmistifique o transtorno.',
    progress: 25,
    locked: false,
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Aula 01: O que é ser TDAH?',
        duration: '15 min',
        activities: [
          {
            id: 'act-1-1',
            type: 'text_reflection',
            title: 'Reflexão: O que é ser TDAH?',
            instructions: 'Reflita sobre as características do TDAH que você conhece e responda:',
            motivational_text: 'Viver com TDAH pode ser desafiador, mas também é uma oportunidade para explorar sua criatividade, energia e resiliência.',
            isCompleted: false,
            content: {
                prompts: [
                    "Liste 3 características que você acredita que podem ser positivas em pessoas com TDAH."
                ]
            }
          }
        ]
      },
      {
        id: 'lesson-1-3',
        title: 'Aula 03: Mitos e verdades sobre o TDAH',
        duration: '10 min',
        activities: [
          {
            id: 'act-1-3',
            type: 'quiz',
            title: 'Quiz: Quebrando Mitos',
            instructions: 'Leia cada afirmação com atenção e identifique se é um Mito ou uma Verdade sobre o TDAH.',
            motivational_text: 'O conhecimento é a melhor ferramenta contra o preconceito.',
            isCompleted: false,
            content: {
                questions: [
                    {
                        question: "TDAH é falta de disciplina.",
                        options: ["Mito", "Verdade"],
                        correctAnswerIndex: 0,
                        explanation: "TDAH é um transtorno neurobiológico com base genética, não é resultado de falta de esforço ou disciplina."
                    },
                    {
                        question: "TDAH pode afetar adultos.",
                        options: ["Mito", "Verdade"],
                        correctAnswerIndex: 1,
                        explanation: "Embora frequentemente diagnosticado na infância, o TDAH persiste na vida adulta em muitos casos, mudando apenas a forma como se manifesta."
                    },
                    {
                        question: "Pessoas com TDAH não conseguem se concentrar em nada.",
                        options: ["Mito", "Verdade"],
                        correctAnswerIndex: 0,
                        explanation: "Isso é falso. Pessoas com TDAH podem ter 'hiperfoco' em atividades que consideram interessantes ou estimulantes, perdendo a noção do tempo."
                    },
                    {
                        question: "O TDAH tem base genética.",
                        options: ["Mito", "Verdade"],
                        correctAnswerIndex: 1,
                        explanation: "Estudos mostram que fatores genéticos são responsáveis por 70-80% da variabilidade do TDAH, sendo altamente hereditário."
                    },
                    {
                        question: "Medicação é a única forma de tratar TDAH.",
                        options: ["Mito", "Verdade"],
                        correctAnswerIndex: 0,
                        explanation: "O tratamento ideal é multimodal: combina medicação (quando necessário), terapia comportamental (TCC), mudanças no estilo de vida e estratégias de autogerenciamento."
                    }
                ]
            }
          }
        ]
      },
      {
        id: 'lesson-1-5',
        title: 'Aula 05: Genética e fatores ambientais',
        duration: '20 min',
        activities: [
          {
            id: 'act-1-5',
            type: 'text_reflection',
            title: 'Minha bagagem',
            instructions: 'Você identifica traços de TDAH em outros familiares? Como foi o ambiente em que você cresceu?',
            isCompleted: false,
            content: {
                prompts: ["Descreva suas observações sobre o histórico familiar."]
            }
          }
        ]
      },
      {
        id: 'lesson-1-6',
        title: 'Aula 06: Neuroplasticidade e TDAH',
        duration: '12 min',
        activities: [
          {
            id: 'act-1-6',
            type: 'daily_log',
            title: 'Registro de Aprendizado: Neuroplasticidade',
            instructions: 'Escolha uma estratégia de estímulo à neuroplasticidade apresentada na aula e pratique por 7 dias. Anote suas percepções diárias.',
            motivational_text: 'Seu cérebro é capaz de mudar e se adaptar. Cada pequeno passo conta.',
            isCompleted: false,
            content: {
                totalDays: 7
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod-2',
    title: 'Módulo 2: Diagnóstico e avaliação',
    description: 'Ferramentas para autoanálise e entendimento dos sintomas.',
    progress: 0,
    locked: false,
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Autoavaliação Guiada',
        duration: '30 min',
        activities: [
          {
            id: 'act-2-1',
            type: 'checklist',
            title: 'Checklist de autoavaliação',
            instructions: 'Este checklist é uma ferramenta de reflexão. Ele NÃO substitui um diagnóstico profissional.',
            motivational_text: 'A honestidade consigo mesma é o primeiro passo para a mudança.',
            isCompleted: false,
            content: {
                items: [
                    "Tenho dificuldade em manter a atenção em tarefas longas ou repetitivas",
                    "Frequentemente perco objetos necessários para tarefas do dia a dia",
                    "Tenho dificuldade em seguir instruções até o final",
                    "Me sinto inquieta ou com dificuldade em ficar parada",
                    "Frequentemente interrompo ou me intrometo em conversas",
                    "Tenho dificuldade em organizar tarefas e gerenciar tempo",
                    "Evito ou reluto em começar tarefas que exigem esforço mental prolongado",
                    "Me distraio facilmente com estímulos externos",
                    "Esqueço compromissos ou tarefas com frequência",
                    "Tenho dificuldade em esperar minha vez"
                ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod-3',
    title: 'Módulo 3: TDAH nas fases da vida',
    description: 'Como o transtorno se manifesta da infância à vida adulta.',
    progress: 0,
    locked: true,
    lessons: [
      {
        id: 'lesson-3-9',
        title: 'Aula 09: TDAH na infância',
        activities: [
            { id: 'act-3-9', type: 'text_reflection', title: 'Minha criança interior', instructions: 'Como você era na escola? Tente lembrar de um momento marcante.', isCompleted: false }
        ]
      },
      {
        id: 'lesson-3-10',
        title: 'Aula 10: TDAH na adolescência',
        activities: [
            { id: 'act-3-10', type: 'text_reflection', title: 'Turbulência adolescente', instructions: 'Reflita sobre os desafios emocionais e sociais dessa fase.', isCompleted: false }
        ]
      },
      {
        id: 'lesson-3-11',
        title: 'Aula 11: TDAH no adulto',
        activities: [
            { id: 'act-3-11', type: 'text_reflection', title: 'Desafios atuais', instructions: 'Quais são as maiores barreiras que o TDAH impõe na sua vida adulta hoje?', isCompleted: false }
        ]
      },
      {
        id: 'lesson-3-end',
        title: 'Atividade de Encerramento',
        activities: [
            { 
                id: 'act-3-end', 
                type: 'timeline', 
                title: 'Linha do tempo do TDAH', 
                instructions: 'Crie uma linha do tempo representando as quatro fases da vida. Para cada fase, registre seus desafios, momentos de superação e conquistas.', 
                motivational_text: 'Olhar para trás nos ajuda a reconhecer o quanto já caminhamos.',
                isCompleted: false,
                content: {
                    phases: [
                        { id: "childhood", title: "Infância", subtitle: "0 a 12 anos" },
                        { id: "adolescence", title: "Adolescência", subtitle: "13 a 19 anos" },
                        { id: "adulthood", title: "Vida Adulta", subtitle: "20 a 59 anos" },
                        { id: "senior", title: "Terceira Idade", subtitle: "60+ anos" }
                    ],
                    fields: [
                        { key: "challenges", label: "Principais Desafios", placeholder: "Ex: Dificuldade na escola, impulsividade..." },
                        { key: "strategies", label: "Momentos de Superação", placeholder: "Ex: Professores que ajudaram, esportes, hobbies..." },
                        { key: "achievements", label: "Conquistas", placeholder: "Ex: Aprender a ler, fazer amigos, primeiro emprego..." }
                    ]
                }
            }
        ]
      }
    ]
  },
  {
    id: 'mod-4',
    title: 'Módulo 4: Estratégias e relacionamentos',
    description: 'Técnicas de enfrentamento e impacto social.',
    progress: 0,
    locked: true,
    lessons: [
      {
        id: 'lesson-4-15',
        title: 'Aula 15: Estratégias de coping',
        activities: [
            { id: 'act-4-15', type: 'daily_log', title: 'Diário de estratégias', instructions: 'Registre quais estratégias você tentou hoje e se funcionaram.', isCompleted: false }
        ]
      },
      {
        id: 'lesson-4-16',
        title: 'Aula 16: Impacto familiar',
        activities: [
            { id: 'act-4-16', type: 'text_reflection', title: 'Dinâmica familiar', instructions: 'Como o TDAH afeta a convivência em casa?', isCompleted: false }
        ]
      },
      {
        id: 'lesson-4-17',
        title: 'Aula 17: TDAH e relacionamentos sociais',
        activities: [
            { id: 'act-4-17', type: 'text_reflection', title: 'Amizades e Amor', instructions: 'Você sente que o TDAH impacta na manutenção de amizades ou relacionamentos?', isCompleted: false }
        ]
      },
      {
        id: 'lesson-4-18',
        title: 'Aula 18: Criatividade',
        activities: [
            { id: 'act-4-18', type: 'daily_log', title: 'Momentos Criativos', instructions: 'Registre momentos onde sua mente TDAH gerou soluções criativas.', isCompleted: false }
        ]
      }
    ]
  },
  {
    id: 'mod-5',
    title: 'Módulo 5: Somos o que queremos ser',
    description: 'Planejando o futuro e abraçando sua identidade.',
    progress: 0,
    locked: true,
    lessons: [
      {
        id: 'lesson-5-final',
        title: 'Exercício Final',
        activities: [
          {
            id: 'act-5-1',
            type: 'action_plan',
            title: 'Meu plano de transformação',
            instructions: 'Identifique um ponto de autossabotagem ou zona de conforto e dê um pequeno, mas concreto, passo para a mudança.',
            motivational_text: 'Transformação começa com um único passo. Você já está mais perto do que imagina.',
            isCompleted: false,
          }
        ]
      }
    ]
  }
];