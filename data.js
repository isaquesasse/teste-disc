// Banco de itens original, baseado no modelo de Marston (1928).
// Cada bloco tem um descritor por fator, com desejabilidade social equilibrada
// dentro do bloco (formato de escolha forçada "Mais / Menos").
const ITEMS = [
  { D: "Direto(a) — vou direto ao ponto", I: "Entusiasmado(a) — contagio os outros", S: "Paciente — espero o tempo certo", C: "Preciso(a) — atento(a) aos detalhes" },
  { D: "Decidido(a)", I: "Comunicativo(a)", S: "Calmo(a)", C: "Analítico(a)" },
  { D: "Competitivo(a)", I: "Sociável", S: "Leal", C: "Cuidadoso(a)" },
  { D: "Ousado(a)", I: "Otimista", S: "Estável", C: "Sistemático(a)" },
  { D: "Assertivo(a)", I: "Persuasivo(a)", S: "Bom(boa) ouvinte", C: "Lógico(a)" },
  { D: "Exigente", I: "Expressivo(a)", S: "Cooperativo(a)", C: "Exato(a)" },
  { D: "Determinado(a)", I: "Espontâneo(a)", S: "Constante", C: "Organizado(a)" },
  { D: "Gosto de assumir o comando", I: "Gosto de conhecer pessoas novas", S: "Gosto de rotinas previsíveis", C: "Gosto de entender como as coisas funcionam" },
  { D: "Focado(a) em resultados", I: "Focado(a) em pessoas e conexões", S: "Focado(a) em harmonia", C: "Focado(a) em qualidade" },
  { D: "Ajo rápido", I: "Faço amizade rápido", S: "Prefiro mudanças graduais", C: "Prefiro checar antes de agir" },
  { D: "Corajoso(a)", I: "Inspirador(a)", S: "Prestativo(a)", C: "Criterioso(a)" },
  { D: "Independente", I: "Animado(a)", S: "Confiável", C: "Disciplinado(a)" },
  { D: "Firme", I: "Bem-humorado(a)", S: "Gentil", C: "Reservado(a)" },
  { D: "Gosto de desafios difíceis", I: "Gosto de reconhecimento", S: "Gosto de segurança", C: "Gosto de padrões claros" },
  { D: "Digo o que penso sem rodeios", I: "Convenço com entusiasmo", S: "Evito conflitos desnecessários", C: "Argumento com dados" },
  { D: "Me incomodo com lentidão", I: "Me incomodo com tédio", S: "Me incomodo com mudanças bruscas", C: "Me incomodo com erros" },
  { D: "Ambicioso(a)", I: "Carismático(a)", S: "Acolhedor(a)", C: "Meticuloso(a)" },
  { D: "Enfrento problemas de frente", I: "Vejo o lado bom das situações", S: "Mantenho a calma em crises", C: "Considero todos os riscos" },
  { D: "Pioneiro(a)", I: "Divertido(a)", S: "Moderado(a)", C: "Perfeccionista" },
  { D: "Vencer é importante para mim", I: "Ser querido(a) é importante para mim", S: "Estabilidade é importante para mim", C: "Fazer certo é importante para mim" },
  { D: "Enérgico(a)", I: "Falante", S: "Sossegado(a)", C: "Formal" },
  { D: "Decido rapidamente", I: "Decido pelo que sinto", S: "Decido após ouvir todos", C: "Decido após analisar" },
  { D: "Persistente", I: "Convincente", S: "Compreensivo(a)", C: "Metódico(a)" },
  { D: "Gosto de competir", I: "Gosto de celebrar", S: "Gosto de ajudar", C: "Gosto de planejar" },
  { D: "Autoconfiante", I: "Popular", S: "Equilibrado(a)", C: "Discreto(a)" },
  { D: "Em grupo, eu lidero", I: "Em grupo, eu animo", S: "Em grupo, eu apoio", C: "Em grupo, eu organizo" },
  { D: "Questiono regras que atrasam", I: "Sou aberto(a) a novidades", S: "Valorizo o que já funciona", C: "Sigo normas e procedimentos" },
  { D: "Objetivo(a)", I: "Extrovertido(a)", S: "Atento(a) às necessidades dos outros", C: "Racional" },
];

const FACTORS = ["D", "I", "S", "C"];

// Escala de concordância (Likert 1–5): 12 afirmações por fator, 3 delas invertidas (r: true)
// para controlar a tendência de concordar com tudo (aquiescência).
const STATEMENTS = [
  { f: "D", t: "Gosto de tomar decisões rapidamente, mesmo sem ter todas as informações." },
  { f: "D", t: "Quando vejo um problema, tomo a iniciativa de resolvê-lo." },
  { f: "D", t: "Fico confortável em assumir a liderança de um grupo." },
  { f: "D", t: "Digo o que penso de forma direta, mesmo que incomode." },
  { f: "D", t: "Situações competitivas me motivam." },
  { f: "D", t: "Gosto de enfrentar desafios difíceis." },
  { f: "D", t: "Fico impaciente quando as coisas andam devagar." },
  { f: "D", t: "Defendo minha posição com firmeza quando discordo de alguém." },
  { f: "D", t: "Prefiro ter controle sobre como meu trabalho é feito." },
  { f: "D", t: "Prefiro que outra pessoa tome as decisões importantes.", r: true },
  { f: "D", t: "Evito confrontar as pessoas, mesmo quando discordo delas.", r: true },
  { f: "D", t: "Prefiro seguir a liderança de alguém a liderar.", r: true },

  { f: "I", t: "Faço amizade com facilidade." },
  { f: "I", t: "Gosto de ser o centro das atenções em um grupo." },
  { f: "I", t: "Consigo animar as pessoas com minhas ideias." },
  { f: "I", t: "Converso com desconhecidos sem dificuldade." },
  { f: "I", t: "Costumo ver o lado positivo das situações." },
  { f: "I", t: "Gosto de trabalhar em contato com muitas pessoas." },
  { f: "I", t: "Sou bom(boa) em convencer os outros." },
  { f: "I", t: "Expresso minhas emoções abertamente." },
  { f: "I", t: "Gosto de ambientes animados e descontraídos." },
  { f: "I", t: "Prefiro trabalhar sozinho(a) a trabalhar em grupo.", r: true },
  { f: "I", t: "Em eventos sociais, costumo ficar mais na minha.", r: true },
  { f: "I", t: "Tenho dificuldade em puxar conversa com pessoas novas.", r: true },

  { f: "S", t: "Sou uma pessoa paciente." },
  { f: "S", t: "Prefiro uma rotina previsível a muitas surpresas." },
  { f: "S", t: "Gosto de ajudar os outros, mesmo sem ser solicitado(a)." },
  { f: "S", t: "Mantenho a calma quando os outros estão agitados." },
  { f: "S", t: "Valorizo relações longas e estáveis." },
  { f: "S", t: "Prefiro cooperar a competir." },
  { f: "S", t: "Escuto com atenção antes de dar minha opinião." },
  { f: "S", t: "Mudanças repentinas me deixam desconfortável." },
  { f: "S", t: "Procuro manter a harmonia no grupo." },
  { f: "S", t: "Fico entediado(a) rapidamente com rotina.", r: true },
  { f: "S", t: "Gosto de mudar de planos de última hora.", r: true },
  { f: "S", t: "Perco a paciência com facilidade.", r: true },

  { f: "C", t: "Presto muita atenção aos detalhes." },
  { f: "C", t: "Gosto de analisar os dados antes de tomar uma decisão." },
  { f: "C", t: "Sigo regras e procedimentos com cuidado." },
  { f: "C", t: "Confiro meu trabalho várias vezes antes de entregá-lo." },
  { f: "C", t: "Prefiro instruções claras e bem definidas." },
  { f: "C", t: "Gosto de planejar as coisas com antecedência." },
  { f: "C", t: "Mantenho minhas coisas organizadas." },
  { f: "C", t: "Questiono afirmações que não têm evidências." },
  { f: "C", t: "Prefiro fazer algo certo a fazer rápido." },
  { f: "C", t: "Costumo ignorar os detalhes e focar no todo.", r: true },
  { f: "C", t: "Tomo decisões pelo instinto, sem analisar muito.", r: true },
  { f: "C", t: "Acho que regras atrapalham mais do que ajudam.", r: true },
];

const SCALE = ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"];

const FACTOR_INFO = {
  D: {
    name: "Dominância",
    color: "#e5484d",
    question: "Como você lida com problemas e desafios",
    summary: "Pessoas com D alto são orientadas a resultados, gostam de controle sobre o próprio trabalho e agem rápido diante de obstáculos. Tendem a ser diretas, competitivas e confortáveis com riscos.",
    strengths: ["Decide rápido, mesmo com informação incompleta", "Assume responsabilidade e toma a frente", "Enfrenta obstáculos sem se intimidar", "Mantém o foco em metas e resultados", "Aceita riscos calculados"],
    watch: ["Impaciência com ritmos mais lentos", "Pode soar ríspido(a) ou insensível", "Tende a ouvir pouco quando está convicto(a)", "Pode atropelar detalhes e pessoas", "Dificuldade em abrir mão do controle"],
    motivators: ["Desafios e metas ambiciosas", "Autonomia e autoridade", "Resultados visíveis", "Competição e vitória", "Variedade e ritmo"],
    fears: "Perder o controle, ser aproveitado(a) pelos outros, parecer fraco(a).",
    pressure: "Fica mais autoritário(a), exigente e impaciente; pode impor decisões sem consultar.",
    environment: "Liberdade de ação, metas claras, poder de decisão, desafios constantes e pouca burocracia.",
    communicate: ["Seja breve e direto(a)", "Fale de resultados e próximos passos", "Ofereça opções, não ordens", "Evite rodeios e excesso de detalhes", "Discorde com fatos, não com emoção"],
    develop: ["Praticar escuta ativa antes de decidir", "Explicar o porquê das decisões", "Reconhecer as contribuições dos outros", "Desacelerar quando o tema exigir cuidado"],
  },
  I: {
    name: "Influência",
    color: "#f5a524",
    question: "Como você lida com pessoas e as influencia",
    summary: "Pessoas com I alto são entusiasmadas, sociáveis e persuasivas. Gostam de interagir, de inspirar os outros e de ambientes dinâmicos e otimistas.",
    strengths: ["Entusiasmo que motiva equipes", "Facilidade para persuadir e vender ideias", "Rede de contatos ampla", "Otimismo e criatividade", "Comunicação expressiva"],
    watch: ["Desorganização e dificuldade com prazos", "Otimismo excessivo sobre resultados", "Pouca atenção ao acompanhamento (follow-up)", "Pode falar mais do que ouve", "Decisões guiadas pela emoção"],
    motivators: ["Reconhecimento público", "Interação social", "Liberdade de expressão", "Ambiente leve e divertido", "Novidades e ideias"],
    fears: "Rejeição, perder prestígio, ser ignorado(a) ou excluído(a).",
    pressure: "Fica desorganizado(a), fala demais, reage emocionalmente e pode evitar fatos desagradáveis.",
    environment: "Colaborativo, dinâmico e flexível, com contato frequente com pessoas e visibilidade para o trabalho.",
    communicate: ["Seja amigável e caloroso(a)", "Deixe espaço para conversa e ideias", "Evite excesso de dados de uma vez", "Confirme combinados por escrito", "Reconheça as contribuições em público"],
    develop: ["Gestão de tempo e prioridades", "Concluir antes de começar algo novo", "Basear decisões em dados", "Ouvir com a mesma energia com que fala"],
  },
  S: {
    name: "Estabilidade",
    color: "#30a46c",
    question: "Como você lida com ritmo e mudanças",
    summary: "Pessoas com S alto são pacientes, leais e cooperativas. Valorizam segurança, harmonia e relações de confiança, e preferem ritmos constantes e mudanças planejadas.",
    strengths: ["Paciência e calma, inclusive em crises", "Lealdade e confiabilidade", "Escuta genuína", "Consistência e constância na entrega", "Excelente trabalho em equipe"],
    watch: ["Resistência a mudanças repentinas", "Evita conflitos, mesmo os necessários", "Dificuldade em dizer não", "Pode demorar para decidir", "Guarda insatisfações em vez de expressá-las"],
    motivators: ["Segurança e previsibilidade", "Ambiente harmonioso", "Reconhecimento sincero e pessoal", "Tempo para se adaptar", "Cooperação"],
    fears: "Perder a estabilidade, mudanças bruscas, conflitos abertos, decepcionar as pessoas.",
    pressure: "Cede para evitar atrito, mas pode acumular ressentimento e resistir de forma silenciosa.",
    environment: "Previsível, com processos claros, relações estáveis e pouca mudança inesperada.",
    communicate: ["Use um ritmo calmo e cordial", "Demonstre interesse genuíno", "Avise mudanças com antecedência e explique o motivo", "Pergunte a opinião diretamente", "Evite pressão por respostas imediatas"],
    develop: ["Assertividade para expressar desacordo", "Flexibilidade diante de mudanças", "Dizer não sem culpa", "Tomar decisões com mais agilidade"],
  },
  C: {
    name: "Conformidade",
    color: "#3e63dd",
    question: "Como você lida com regras, padrões e procedimentos",
    summary: "Pessoas com C alto são analíticas, precisas e orientadas à qualidade. Valorizam lógica, padrões claros e fazer as coisas do jeito certo, com cuidado e planejamento.",
    strengths: ["Precisão e atenção aos detalhes", "Pensamento analítico e lógico", "Alto padrão de qualidade", "Planejamento cuidadoso", "Objetividade diante de emoções"],
    watch: ["Perfeccionismo", "Excesso de análise antes de agir", "Pode soar crítico(a) ou distante", "Desconforto com ambiguidade", "Dificuldade em delegar"],
    motivators: ["Padrões e expectativas claros", "Tempo para fazer bem feito", "Lógica e evidências", "Ser reconhecido(a) pela expertise", "Autonomia técnica"],
    fears: "Críticas ao próprio trabalho, cometer erros, ser pego(a) despreparado(a).",
    pressure: "Retrai-se, fica excessivamente crítico(a) ou rígido(a) e se apega a regras e detalhes.",
    environment: "Organizado, com expectativas claras, em que a qualidade e a precisão são valorizadas.",
    communicate: ["Traga dados, fatos e exemplos", "Prefira comunicação por escrito e estruturada", "Dê tempo para pensar", "Seja preciso(a) e consistente", "Evite pressão emocional"],
    develop: ["Tolerar a imperfeição quando ela é aceitável", "Decidir com informação incompleta", "Expressar sentimentos e reconhecer os outros", "Flexibilizar regras quando faz sentido"],
  },
};

// O que um fator abaixo da média costuma indicar.
const LOW_INFO = {
  D: "Com D abaixo da média, você tende a buscar consenso antes de impor sua posição, evita confrontos desnecessários e pondera antes de agir. Costuma ser visto(a) como cooperativo(a) e moderado(a).",
  I: "Com I abaixo da média, você tende a ser mais reservado(a) e objetivo(a), prefere fatos a entusiasmo e se convence por lógica mais do que por carisma. Costuma ser visto(a) como sóbrio(a) e reflexivo(a).",
  S: "Com S abaixo da média, você tende a gostar de variedade e mudança, se adapta rápido e pode se impacientar com rotina. Costuma ser visto(a) como dinâmico(a) e inquieto(a).",
  C: "Com C abaixo da média, você tende a ser independente de regras, informal e confortável com ambiguidade, focando no todo mais que nos detalhes. Costuma ser visto(a) como flexível e espontâneo(a).",
};

// 12 padrões combinados (fator primário + secundário).
const PATTERNS = {
  D:  { title: "Executor(a)", text: "Seu perfil é claramente dominado por D. Você é movido(a) por resultados e desafios, age com rapidez e independência e tende a assumir o comando naturalmente. Funciona melhor quando tem autonomia e metas claras.", team: "Dá direção e velocidade ao time, destrava decisões e não foge de problemas difíceis." },
  DI: { title: "Impulsionador(a)", text: "Você combina a busca por resultados (D) com a energia social (I). É ousado(a), persuasivo(a) e gosta de mobilizar pessoas em torno de metas. Tende a preferir ação e novidade a rotina e análise.", team: "Inicia projetos, convence pessoas a embarcarem e mantém o ritmo alto." },
  DC: { title: "Desafiador(a)", text: "Você une o foco em resultados (D) ao rigor analítico (C). É exigente, objetivo(a) e questionador(a), com padrões altos para si e para os outros. Prefere lógica e eficiência a considerações emocionais.", team: "Eleva a régua de qualidade, encontra falhas nos planos e cobra entregas consistentes." },
  I:  { title: "Entusiasta", text: "Seu perfil é claramente dominado por I. Você é expressivo(a), otimista e sociável; gosta de conhecer pessoas, compartilhar ideias e ser reconhecido(a). Funciona melhor em ambientes dinâmicos e colaborativos.", team: "Cria clima positivo, conecta pessoas e gera entusiasmo por novas ideias." },
  ID: { title: "Persuasor(a)", text: "Você combina carisma (I) com assertividade (D). É confiante, convincente e gosta de influenciar decisões. Busca reconhecimento e resultados ao mesmo tempo, e se sai bem em papéis de negociação e liderança visível.", team: "Vende ideias, abre portas e lidera pela inspiração." },
  IS: { title: "Agregador(a)", text: "Você une sociabilidade (I) e cuidado com as pessoas (S). É caloroso(a), encorajador(a) e acessível; valoriza relações e harmonia, e costuma ser procurado(a) para conversar e apoiar.", team: "Fortalece vínculos, acolhe novos membros e media tensões com leveza." },
  S:  { title: "Apoiador(a)", text: "Seu perfil é claramente dominado por S. Você é paciente, leal e constante; prefere ambientes estáveis e relações de confiança, e entrega com consistência. Valoriza cooperação mais do que competição.", team: "Dá estabilidade, mantém o time unido e garante que o trabalho seja concluído." },
  SI: { title: "Colaborador(a)", text: "Você combina estabilidade (S) com calor humano (I). É gentil, prestativo(a) e agradável; gosta de trabalhar com pessoas em um ritmo sereno e evita confrontos.", team: "Cria um ambiente seguro e amigável e apoia os colegas de forma genuína." },
  SC: { title: "Especialista estável", text: "Você une constância (S) a cuidado e precisão (C). É metódico(a), confiável e previsível; prefere processos bem definidos e mudanças planejadas, e se orgulha de um trabalho bem feito.", team: "Garante qualidade, mantém processos funcionando e é uma referência de confiabilidade." },
  C:  { title: "Analista", text: "Seu perfil é claramente dominado por C. Você é preciso(a), lógico(a) e orientado(a) à qualidade; gosta de entender a fundo, seguir padrões e decidir com base em evidências.", team: "Antecipa riscos, garante precisão e embasa decisões com dados." },
  CD: { title: "Perfeccionista estratégico(a)", text: "Você combina rigor (C) e determinação (D). É crítico(a), independente e orientado(a) a padrões elevados; questiona premissas e quer resultados corretos, não apenas rápidos.", team: "Resolve problemas complexos, melhora sistemas e não aceita soluções superficiais." },
  CS: { title: "Planejador(a)", text: "Você une cautela (C) e estabilidade (S). É cuidadoso(a), consistente e diplomático(a); prefere planejar antes de agir e trabalha bem com tarefas que exigem precisão e paciência.", team: "Estrutura o trabalho, documenta processos e reduz erros." },
};

// Combinações em diagonal (fatores opostos no modelo circular) recebem uma nota.
const DIAGONAL_NOTE = {
  DS: "Seus dois fatores mais altos (D e S) ficam em lados opostos do modelo: você pode alternar entre firmeza e acomodação conforme o contexto. Vale observar em quais situações cada lado aparece.",
  IC: "Seus dois fatores mais altos (I e C) ficam em lados opostos do modelo: você pode alternar entre expressividade e reserva analítica conforme o contexto. Vale observar em quais situações cada lado aparece.",
};
