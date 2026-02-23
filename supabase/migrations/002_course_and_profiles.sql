-- 002_course_and_profiles.sql
-- Create User Profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  big_five_trait TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create Course content tables
CREATE TABLE IF NOT EXISTS public.course_modules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration TEXT,
    "order" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_activities (
    id TEXT PRIMARY KEY,
    lesson_id TEXT NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    motivational_text TEXT,
    content JSONB,
    "order" INTEGER NOT NULL
);

-- Everyone can read the course content
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read modules" ON public.course_modules FOR SELECT USING (true);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lessons" ON public.course_lessons FOR SELECT USING (true);

ALTER TABLE public.course_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read activities" ON public.course_activities FOR SELECT USING (true);

-- Seed Initial Data from constants.ts

INSERT INTO public.course_modules (id, title, description, "order") VALUES
('mod-1', 'Módulo 1: Entendendo o TDAH', 'Compreenda o funcionamento do seu cérebro e desmistifique o transtorno.', 1),
('mod-2', 'Módulo 2: Diagnóstico e avaliação', 'Ferramentas para autoanálise e entendimento dos sintomas.', 2),
('mod-3', 'Módulo 3: TDAH nas fases da vida', 'Como o transtorno se manifesta da infância à vida adulta.', 3),
('mod-4', 'Módulo 4: Estratégias e relacionamentos', 'Técnicas de enfrentamento e impacto social.', 4),
('mod-5', 'Módulo 5: Somos o que queremos ser', 'Planejando o futuro e abraçando sua identidade.', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, duration, "order") VALUES
('lesson-1-1', 'mod-1', 'Aula 01: O que é ser TDAH?', '15 min', 1),
('lesson-1-3', 'mod-1', 'Aula 03: Mitos e verdades sobre o TDAH', '10 min', 2),
('lesson-1-5', 'mod-1', 'Aula 05: Genética e fatores ambientais', '20 min', 3),
('lesson-1-6', 'mod-1', 'Aula 06: Neuroplasticidade e TDAH', '12 min', 4),
('lesson-2-1', 'mod-2', 'Autoavaliação Guiada', '30 min', 1),
('lesson-3-9', 'mod-3', 'Aula 09: TDAH na infância', NULL, 1),
('lesson-3-10', 'mod-3', 'Aula 10: TDAH na adolescência', NULL, 2),
('lesson-3-11', 'mod-3', 'Aula 11: TDAH no adulto', NULL, 3),
('lesson-3-end', 'mod-3', 'Atividade de Encerramento', NULL, 4),
('lesson-4-15', 'mod-4', 'Aula 15: Estratégias de coping', NULL, 1),
('lesson-4-16', 'mod-4', 'Aula 16: Impacto familiar', NULL, 2),
('lesson-4-17', 'mod-4', 'Aula 17: TDAH e relacionamentos sociais', NULL, 3),
('lesson-4-18', 'mod-4', 'Aula 18: Criatividade', NULL, 4),
('lesson-5-final', 'mod-5', 'Exercício Final', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_activities (id, lesson_id, type, title, instructions, motivational_text, content, "order") VALUES
('act-1-1', 'lesson-1-1', 'text_reflection', 'Reflexão: O que é ser TDAH?', 'Reflita sobre as características do TDAH que você conhece e responda:', 'Viver com TDAH pode ser desafiador, mas também é uma oportunidade para explorar sua criatividade, energia e resiliência.', '{"prompts": ["Liste 3 características que você acredita que podem ser positivas em pessoas com TDAH."]}'::jsonb, 1),
('act-1-3', 'lesson-1-3', 'quiz', 'Quiz: Quebrando Mitos', 'Leia cada afirmação com atenção e identifique se é um Mito ou uma Verdade sobre o TDAH.', 'O conhecimento é a melhor ferramenta contra o preconceito.', '{"questions": [{"question": "TDAH é falta de disciplina.", "options": ["Mito", "Verdade"], "correctAnswerIndex": 0, "explanation": "TDAH é um transtorno neurobiológico com base genética, não é resultado de falta de esforço ou disciplina."}, {"question": "TDAH pode afetar adultos.", "options": ["Mito", "Verdade"], "correctAnswerIndex": 1, "explanation": "Embora frequentemente diagnosticado na infância, o TDAH persiste na vida adulta em muitos casos, mudando apenas a forma como se manifesta."}, {"question": "Pessoas com TDAH não conseguem se concentrar em nada.", "options": ["Mito", "Verdade"], "correctAnswerIndex": 0, "explanation": "Isso é falso. Pessoas com TDAH podem ter ''hiperfoco'' em atividades que consideram interessantes ou estimulantes, perdendo a noção do tempo."}, {"question": "O TDAH tem base genética.", "options": ["Mito", "Verdade"], "correctAnswerIndex": 1, "explanation": "Estudos mostram que fatores genéticos são responsáveis por 70-80% da variabilidade do TDAH, sendo altamente hereditário."}, {"question": "Medicação é a única forma de tratar TDAH.", "options": ["Mito", "Verdade"], "correctAnswerIndex": 0, "explanation": "O tratamento ideal é multimodal: combina medicação (quando necessário), terapia comportamental (TCC), mudanças no estilo de vida e estratégias de autogerenciamento."}]}'::jsonb, 1),
('act-1-5', 'lesson-1-5', 'text_reflection', 'Minha bagagem', 'Você identifica traços de TDAH em outros familiares? Como foi o ambiente em que você cresceu?', NULL, '{"prompts": ["Descreva suas observações sobre o histórico familiar."]}'::jsonb, 1),
('act-1-6', 'lesson-1-6', 'daily_log', 'Registro de Aprendizado: Neuroplasticidade', 'Escolha uma estratégia de estímulo à neuroplasticidade apresentada na aula e pratique por 7 dias. Anote suas percepções diárias.', 'Seu cérebro é capaz de mudar e se adaptar. Cada pequeno passo conta.', '{"totalDays": 7}'::jsonb, 1),
('act-2-1', 'lesson-2-1', 'checklist', 'Checklist de autoavaliação', 'Este checklist é uma ferramenta de reflexão. Ele NÃO substitui um diagnóstico profissional.', 'A honestidade consigo mesma é o primeiro passo para a mudança.', '{"items": ["Tenho dificuldade em manter a atenção em tarefas longas ou repetitivas", "Frequentemente perco objetos necessários para tarefas do dia a dia", "Tenho dificuldade em seguir instruções até o final", "Me sinto inquieta ou com dificuldade em ficar parada", "Frequentemente interrompo ou me intrometo em conversas", "Tenho dificuldade em organizar tarefas e gerenciar tempo", "Evito ou reluto em começar tarefas que exigem esforço mental prolongado", "Me distraio facilmente com estímulos externos", "Esqueço compromissos ou tarefas com frequência", "Tenho dificuldade em esperar minha vez"]}'::jsonb, 1),
('act-3-9', 'lesson-3-9', 'text_reflection', 'Minha criança interior', 'Como você era na escola? Tente lembrar de um momento marcante.', NULL, NULL, 1),
('act-3-10', 'lesson-3-10', 'text_reflection', 'Turbulência adolescente', 'Reflita sobre os desafios emocionais e sociais dessa fase.', NULL, NULL, 1),
('act-3-11', 'lesson-3-11', 'text_reflection', 'Desafios atuais', 'Quais são as maiores barreiras que o TDAH impõe na sua vida adulta hoje?', NULL, NULL, 1),
('act-3-end', 'lesson-3-end', 'timeline', 'Linha do tempo do TDAH', 'Crie uma linha do tempo representando as quatro fases da vida. Para cada fase, registre seus desafios, momentos de superação e conquistas.', 'Olhar para trás nos ajuda a reconhecer o quanto já caminhamos.', '{"phases": [{"id": "childhood", "title": "Infância", "subtitle": "0 a 12 anos"}, {"id": "adolescence", "title": "Adolescência", "subtitle": "13 a 19 anos"}, {"id": "adulthood", "title": "Vida Adulta", "subtitle": "20 a 59 anos"}, {"id": "senior", "title": "Terceira Idade", "subtitle": "60+ anos"}], "fields": [{"key": "challenges", "label": "Principais Desafios", "placeholder": "Ex: Dificuldade na escola, impulsividade..."}, {"key": "strategies", "label": "Momentos de Superação", "placeholder": "Ex: Professores que ajudaram, esportes, hobbies..."}, {"key": "achievements", "label": "Conquistas", "placeholder": "Ex: Aprender a ler, fazer amigos, primeiro emprego..."}]}'::jsonb, 1),
('act-4-15', 'lesson-4-15', 'daily_log', 'Diário de estratégias', 'Registre quais estratégias você tentou hoje e se funcionaram.', NULL, NULL, 1),
('act-4-16', 'lesson-4-16', 'text_reflection', 'Dinâmica familiar', 'Como o TDAH afeta a convivência em casa?', NULL, NULL, 1),
('act-4-17', 'lesson-4-17', 'text_reflection', 'Amizades e Amor', 'Você sente que o TDAH impacta na manutenção de amizades ou relacionamentos?', NULL, NULL, 1),
('act-4-18', 'lesson-4-18', 'daily_log', 'Momentos Criativos', 'Registre momentos onde sua mente TDAH gerou soluções criativas.', NULL, NULL, 1),
('act-5-1', 'lesson-5-final', 'action_plan', 'Meu plano de transformação', 'Identifique um ponto de autossabotagem ou zona de conforto e dê um pequeno, mas concreto, passo para a mudança.', 'Transformação começa com um único passo. Você já está mais perto do que imagina.', NULL, 1)
ON CONFLICT (id) DO NOTHING;

-- Trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_user_profiles_updated_at();
