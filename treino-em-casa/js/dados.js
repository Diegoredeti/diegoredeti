/*
 * dados.js
 * Base de exercícios e rotinas prontas do app "Treino em Casa".
 * Tudo é peso corporal / sem equipamento, pensado para treinar em casa.
 *
 * Cada exercício tem:
 *   id        -> identificador único
 *   nome      -> nome exibido
 *   grupo     -> grupo muscular principal
 *   nivel     -> iniciante | intermediario | avancado
 *   tipo      -> "reps" (repetições) ou "tempo" (segundos, ex.: prancha)
 *   descricao -> como executar
 *   dicas     -> pontos de atenção para não se machucar
 */

const EXERCICIOS = [
  {
    id: "polichinelo",
    nome: "Polichinelo",
    grupo: "Corpo todo / Cardio",
    nivel: "iniciante",
    tipo: "tempo",
    descricao:
      "Em pé, salte abrindo pernas e levando os braços acima da cabeça, depois volte à posição inicial. Mantenha um ritmo constante.",
    dicas: "Aterrisse com os joelhos levemente flexionados para poupar as articulações.",
  },
  {
    id: "agachamento",
    nome: "Agachamento livre",
    grupo: "Pernas / Glúteos",
    nivel: "iniciante",
    tipo: "reps",
    descricao:
      "Pés na largura dos ombros, desça empurrando o quadril para trás como se fosse sentar, até as coxas ficarem paralelas ao chão, e suba.",
    dicas: "Mantenha os calcanhares no chão e os joelhos alinhados com os pés.",
  },
  {
    id: "flexao",
    nome: "Flexão de braço",
    grupo: "Peito / Tríceps",
    nivel: "intermediario",
    tipo: "reps",
    descricao:
      "Em prancha com mãos um pouco além da largura dos ombros, desça o peito em direção ao chão e empurre de volta.",
    dicas: "Mantenha o corpo reto (sem 'cair' o quadril). Pode apoiar os joelhos no chão para facilitar.",
  },
  {
    id: "flexao-joelhos",
    nome: "Flexão apoiando os joelhos",
    grupo: "Peito / Tríceps",
    nivel: "iniciante",
    tipo: "reps",
    descricao:
      "Igual à flexão, mas com os joelhos apoiados no chão. Ótima versão para começar a ganhar força.",
    dicas: "Mantenha o tronco alinhado dos joelhos até a cabeça.",
  },
  {
    id: "prancha",
    nome: "Prancha isométrica",
    grupo: "Core / Abdômen",
    nivel: "iniciante",
    tipo: "tempo",
    descricao:
      "Apoie os antebraços e as pontas dos pés no chão, mantendo o corpo reto e firme como uma tábua.",
    dicas: "Contraia o abdômen e os glúteos. Não deixe o quadril subir nem afundar.",
  },
  {
    id: "abdominal",
    nome: "Abdominal supra",
    grupo: "Core / Abdômen",
    nivel: "iniciante",
    tipo: "reps",
    descricao:
      "Deitado de costas, joelhos dobrados, suba o tronco em direção aos joelhos contraindo o abdômen e desça devagar.",
    dicas: "Não puxe o pescoço com as mãos; o esforço vem do abdômen.",
  },
  {
    id: "afundo",
    nome: "Afundo (avanço)",
    grupo: "Pernas / Glúteos",
    nivel: "intermediario",
    tipo: "reps",
    descricao:
      "Dê um passo à frente e desça o joelho de trás em direção ao chão, formando 90° nas duas pernas. Alterne as pernas.",
    dicas: "O joelho da frente não deve ultrapassar muito a ponta do pé.",
  },
  {
    id: "ponte-gluteo",
    nome: "Ponte de glúteo",
    grupo: "Glúteos / Lombar",
    nivel: "iniciante",
    tipo: "reps",
    descricao:
      "Deitado de costas, joelhos dobrados e pés no chão, eleve o quadril contraindo os glúteos e desça devagar.",
    dicas: "Segure 1 segundo no topo apertando bem os glúteos.",
  },
  {
    id: "escalador",
    nome: "Escalador (mountain climber)",
    grupo: "Core / Cardio",
    nivel: "intermediario",
    tipo: "tempo",
    descricao:
      "Em posição de prancha alta, traga um joelho de cada vez em direção ao peito, alternando rápido como se estivesse correndo.",
    dicas: "Mantenha o quadril baixo e o abdômen firme.",
  },
  {
    id: "burpee",
    nome: "Burpee",
    grupo: "Corpo todo / Cardio",
    nivel: "avancado",
    tipo: "reps",
    descricao:
      "Agache, apoie as mãos, jogue as pernas para trás em prancha, faça uma flexão, volte e salte com os braços para cima.",
    dicas: "Exercício intenso — controle o ritmo e faça pausas se precisar.",
  },
  {
    id: "elevacao-panturrilha",
    nome: "Elevação de panturrilha",
    grupo: "Panturrilha",
    nivel: "iniciante",
    tipo: "reps",
    descricao: "Em pé, eleve os calcanhares ficando na ponta dos pés e desça devagar.",
    dicas: "Segure em uma parede para equilíbrio, se precisar.",
  },
  {
    id: "superman",
    nome: "Superman",
    grupo: "Lombar / Costas",
    nivel: "iniciante",
    tipo: "tempo",
    descricao:
      "Deitado de barriga para baixo, eleve braços e pernas ao mesmo tempo, contraindo a lombar, e segure.",
    dicas: "Movimento suave, sem forçar o pescoço para cima.",
  },
];

/*
 * Rotinas prontas. Cada item da lista de exercícios referencia um id de EXERCICIOS
 * e define a "carga": repeticoes OU duracao (segundos), além do descanso em segundos.
 */
const ROTINAS = [
  {
    id: "corpo-todo-iniciante",
    nome: "Corpo todo — Iniciante",
    descricao: "Treino completo e leve para começar. Ideal para quem está voltando a se exercitar.",
    duracaoAprox: 15,
    nivel: "iniciante",
    exercicios: [
      { ex: "polichinelo", duracao: 30, descanso: 20 },
      { ex: "agachamento", reps: 12, descanso: 30 },
      { ex: "flexao-joelhos", reps: 8, descanso: 30 },
      { ex: "ponte-gluteo", reps: 12, descanso: 30 },
      { ex: "prancha", duracao: 20, descanso: 30 },
      { ex: "elevacao-panturrilha", reps: 15, descanso: 20 },
    ],
  },
  {
    id: "hiit-rapido",
    nome: "HIIT rápido — 10 min",
    descricao: "Treino intervalado de alta intensidade para queimar energia em pouco tempo.",
    duracaoAprox: 10,
    nivel: "intermediario",
    exercicios: [
      { ex: "polichinelo", duracao: 40, descanso: 15 },
      { ex: "agachamento", reps: 15, descanso: 15 },
      { ex: "escalador", duracao: 40, descanso: 15 },
      { ex: "afundo", reps: 10, descanso: 15 },
      { ex: "burpee", reps: 8, descanso: 20 },
    ],
  },
  {
    id: "core-abdomen",
    nome: "Core & Abdômen",
    descricao: "Foco em abdômen, lombar e estabilidade do tronco.",
    duracaoAprox: 12,
    nivel: "iniciante",
    exercicios: [
      { ex: "prancha", duracao: 30, descanso: 25 },
      { ex: "abdominal", reps: 15, descanso: 25 },
      { ex: "escalador", duracao: 30, descanso: 25 },
      { ex: "superman", duracao: 25, descanso: 25 },
      { ex: "ponte-gluteo", reps: 15, descanso: 25 },
    ],
  },
  {
    id: "pernas-gluteos",
    nome: "Pernas & Glúteos",
    descricao: "Fortalece a parte inferior do corpo sem equipamento.",
    duracaoAprox: 15,
    nivel: "intermediario",
    exercicios: [
      { ex: "agachamento", reps: 20, descanso: 30 },
      { ex: "afundo", reps: 12, descanso: 30 },
      { ex: "ponte-gluteo", reps: 15, descanso: 30 },
      { ex: "elevacao-panturrilha", reps: 20, descanso: 20 },
      { ex: "agachamento", reps: 15, descanso: 30 },
    ],
  },
];

// Mapa auxiliar para achar exercício por id rapidamente.
const EXERCICIOS_POR_ID = EXERCICIOS.reduce((mapa, ex) => {
  mapa[ex.id] = ex;
  return mapa;
}, {});
