/*
 * dados.js
 * Base de exercícios e rotinas do app "Treino em Casa".
 *
 * Campos de cada exercício:
 *   id        -> identificador único
 *   nome      -> nome exibido
 *   grupo     -> grupo muscular principal
 *   nivel     -> iniciante | intermediario | avancado
 *   tipo      -> "reps" (repetições) ou "tempo" (segundos)
 *   equip     -> "nenhum" | "halter"
 *   anim      -> tipo de animação (ver animacoes.js)
 *   objetivo  -> tags de objetivo que este exercício atende
 *   contra    -> lista de restrições em que é melhor evitar (joelho, lombar, ombro, punho)
 *   carga     -> (só halter) "leve" | "medio" | "pesado"
 *   descricao -> como executar
 *   dicas     -> pontos de atenção
 */

// Cargas possíveis com 1 halter e discos 2x2kg + 2x4kg.
const HALTER = { leve: 4, medio: 8, pesado: 12 }; // kg totais no halter

function cargaEmKg(nivelCarga) {
  return HALTER[nivelCarga] || HALTER.leve;
}

const EXERCICIOS = [
  /* ============ PESO CORPORAL ============ */
  {
    id: "polichinelo",
    nome: "Polichinelo",
    grupo: "Corpo todo / Cardio",
    nivel: "iniciante",
    tipo: "tempo",
    equip: "nenhum",
    anim: "polichinelo",
    objetivo: ["emagrecer", "manter"],
    contra: [],
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
    equip: "nenhum",
    anim: "agachar",
    objetivo: ["forca", "manter", "emagrecer"],
    contra: ["joelho"],
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
    equip: "nenhum",
    anim: "flexao",
    objetivo: ["forca", "manter"],
    contra: ["ombro", "punho"],
    descricao:
      "Em prancha com mãos um pouco além da largura dos ombros, desça o peito em direção ao chão e empurre de volta.",
    dicas: "Mantenha o corpo reto (sem 'cair' o quadril).",
  },
  {
    id: "flexao-joelhos",
    nome: "Flexão apoiando os joelhos",
    grupo: "Peito / Tríceps",
    nivel: "iniciante",
    tipo: "reps",
    equip: "nenhum",
    anim: "flexao",
    objetivo: ["forca", "manter"],
    contra: ["punho"],
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
    equip: "nenhum",
    anim: "prancha",
    objetivo: ["forca", "manter", "flexibilidade"],
    contra: ["ombro"],
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
    equip: "nenhum",
    anim: "abdominal",
    objetivo: ["forca", "manter", "emagrecer"],
    contra: ["lombar"],
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
    equip: "nenhum",
    anim: "afundo",
    objetivo: ["forca", "manter", "emagrecer"],
    contra: ["joelho"],
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
    equip: "nenhum",
    anim: "ponte",
    objetivo: ["forca", "manter", "flexibilidade"],
    contra: [],
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
    equip: "nenhum",
    anim: "escalador",
    objetivo: ["emagrecer", "manter"],
    contra: ["ombro", "punho"],
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
    equip: "nenhum",
    anim: "agachar",
    objetivo: ["emagrecer"],
    contra: ["joelho", "ombro"],
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
    equip: "nenhum",
    anim: "panturrilha",
    objetivo: ["forca", "manter"],
    contra: [],
    descricao: "Em pé, eleve os calcanhares ficando na ponta dos pés e desça devagar.",
    dicas: "Segure em uma parede para equilíbrio, se precisar.",
  },
  {
    id: "superman",
    nome: "Superman",
    grupo: "Lombar / Costas",
    nivel: "iniciante",
    tipo: "tempo",
    equip: "nenhum",
    anim: "superman",
    objetivo: ["forca", "flexibilidade", "manter"],
    contra: ["lombar"],
    descricao:
      "Deitado de barriga para baixo, eleve braços e pernas ao mesmo tempo, contraindo a lombar, e segure.",
    dicas: "Movimento suave, sem forçar o pescoço para cima.",
  },

  /* ============ COM 1 HALTER ============ */
  {
    id: "rosca-direta",
    nome: "Rosca direta (bíceps)",
    grupo: "Bíceps",
    nivel: "iniciante",
    tipo: "reps",
    equip: "halter",
    anim: "rosca",
    carga: "medio",
    objetivo: ["forca", "manter"],
    contra: [],
    descricao:
      "Em pé, halter em uma das mãos, cotovelo junto ao corpo. Flexione o braço trazendo o halter até o ombro e desça devagar. Alterne os braços.",
    dicas: "Não balance o tronco; o movimento é só do antebraço.",
  },
  {
    id: "rosca-martelo",
    nome: "Rosca martelo",
    grupo: "Bíceps / Antebraço",
    nivel: "iniciante",
    tipo: "reps",
    equip: "halter",
    anim: "rosca",
    carga: "medio",
    objetivo: ["forca", "manter"],
    contra: [],
    descricao:
      "Como a rosca direta, mas com a palma virada para o corpo (pegada neutra, como quem segura um martelo). Alterne os braços.",
    dicas: "Mantenha o punho firme e alinhado com o antebraço.",
  },
  {
    id: "desenvolvimento",
    nome: "Desenvolvimento de ombro",
    grupo: "Ombros",
    nivel: "intermediario",
    tipo: "reps",
    equip: "halter",
    anim: "desenvolvimento",
    carga: "medio",
    objetivo: ["forca", "manter"],
    contra: ["ombro"],
    descricao:
      "Halter na altura do ombro. Empurre para cima até o braço esticar e desça controlando. Faça as repetições de um lado e depois troque.",
    dicas: "Não trave o cotovelo com força no topo; mantenha o core firme.",
  },
  {
    id: "elevacao-lateral",
    nome: "Elevação lateral",
    grupo: "Ombros",
    nivel: "iniciante",
    tipo: "reps",
    equip: "halter",
    anim: "elevacao-lateral",
    carga: "leve",
    objetivo: ["forca", "manter"],
    contra: ["ombro"],
    descricao:
      "Em pé, halter em uma das mãos ao lado do corpo. Eleve o braço lateralmente até a altura do ombro e desça devagar. Alterne os lados.",
    dicas: "Use carga leve; suba com o cotovelo, não com a mão.",
  },
  {
    id: "remada-unilateral",
    nome: "Remada unilateral",
    grupo: "Costas / Bíceps",
    nivel: "intermediario",
    tipo: "reps",
    equip: "halter",
    anim: "remada",
    carga: "pesado",
    objetivo: ["forca", "manter"],
    contra: ["lombar"],
    descricao:
      "Incline o tronco à frente com as costas retas (pode apoiar a mão livre numa cadeira). Puxe o halter em direção ao quadril, aproximando a escápula, e desça. Troque de lado.",
    dicas: "Costas sempre retas; puxe com o cotovelo, não só com a mão.",
  },
  {
    id: "agachamento-goblet",
    nome: "Agachamento goblet",
    grupo: "Pernas / Glúteos",
    nivel: "intermediario",
    tipo: "reps",
    equip: "halter",
    anim: "agachar",
    carga: "pesado",
    objetivo: ["forca", "manter", "emagrecer"],
    contra: ["joelho"],
    descricao:
      "Segure o halter junto ao peito com as duas mãos. Agache mantendo o tronco ereto e suba.",
    dicas: "Peito aberto e calcanhares no chão durante todo o movimento.",
  },
  {
    id: "afundo-halter",
    nome: "Afundo com halter",
    grupo: "Pernas / Glúteos",
    nivel: "avancado",
    tipo: "reps",
    equip: "halter",
    anim: "afundo",
    carga: "medio",
    objetivo: ["forca", "emagrecer"],
    contra: ["joelho"],
    descricao:
      "Segure o halter junto ao peito ou ao lado do corpo. Dê um passo à frente e desça o joelho de trás. Alterne as pernas.",
    dicas: "Desça na vertical; joelho da frente alinhado com o pé.",
  },
  {
    id: "rdl-unilateral",
    nome: "Peso morto romeno (1 perna)",
    grupo: "Posterior / Glúteos",
    nivel: "avancado",
    tipo: "reps",
    equip: "halter",
    anim: "terra",
    carga: "medio",
    objetivo: ["forca", "flexibilidade"],
    contra: ["lombar"],
    descricao:
      "Em pé sobre uma perna, halter na mão. Incline o tronco à frente levando o halter em direção ao chão enquanto a perna livre vai para trás, e volte. Troque de lado.",
    dicas: "Costas retas; sinta o alongamento no posterior da coxa. Comece com carga leve.",
  },
  {
    id: "triceps-frances",
    nome: "Tríceps francês",
    grupo: "Tríceps",
    nivel: "intermediario",
    tipo: "reps",
    equip: "halter",
    anim: "desenvolvimento",
    carga: "leve",
    objetivo: ["forca", "manter"],
    contra: ["ombro"],
    descricao:
      "Segure o halter com as duas mãos acima da cabeça. Flexione os cotovelos levando o halter atrás da nuca e estenda de volta para cima.",
    dicas: "Cotovelos apontando para cima e parados; só o antebraço se move.",
  },
  {
    id: "panturrilha-halter",
    nome: "Panturrilha com halter",
    grupo: "Panturrilha",
    nivel: "iniciante",
    tipo: "reps",
    equip: "halter",
    anim: "panturrilha",
    carga: "pesado",
    objetivo: ["forca", "manter"],
    contra: [],
    descricao:
      "Em pé segurando o halter ao lado do corpo, eleve os calcanhares ficando na ponta dos pés e desça devagar.",
    dicas: "Amplitude completa: suba bem e desça controlando.",
  },
];

// Mapa auxiliar para achar exercício por id rapidamente.
const EXERCICIOS_POR_ID = EXERCICIOS.reduce((mapa, ex) => {
  mapa[ex.id] = ex;
  return mapa;
}, {});

/* ============ ROTINAS PRONTAS ============ */
const ROTINAS = [
  {
    id: "corpo-todo-iniciante",
    nome: "Corpo todo — Iniciante",
    descricao: "Treino completo e leve para começar. Ideal para quem está voltando a se exercitar.",
    duracaoAprox: 15,
    nivel: "iniciante",
    equip: "nenhum",
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
    equip: "nenhum",
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
    equip: "nenhum",
    exercicios: [
      { ex: "prancha", duracao: 30, descanso: 25 },
      { ex: "abdominal", reps: 15, descanso: 25 },
      { ex: "escalador", duracao: 30, descanso: 25 },
      { ex: "superman", duracao: 25, descanso: 25 },
      { ex: "ponte-gluteo", reps: 15, descanso: 25 },
    ],
  },
  {
    id: "halter-corpo-todo",
    nome: "Halter — Corpo todo",
    descricao: "Treino de força usando 1 halter, trabalhando o corpo inteiro.",
    duracaoAprox: 20,
    nivel: "intermediario",
    equip: "halter",
    exercicios: [
      { ex: "agachamento-goblet", reps: 12, descanso: 40 },
      { ex: "remada-unilateral", reps: 12, descanso: 40 },
      { ex: "desenvolvimento", reps: 10, descanso: 40 },
      { ex: "afundo-halter", reps: 10, descanso: 40 },
      { ex: "rosca-direta", reps: 12, descanso: 30 },
      { ex: "panturrilha-halter", reps: 15, descanso: 30 },
    ],
  },
  {
    id: "halter-superior",
    nome: "Halter — Braços e ombros",
    descricao: "Foco em bíceps, tríceps e ombros com 1 halter.",
    duracaoAprox: 18,
    nivel: "iniciante",
    equip: "halter",
    exercicios: [
      { ex: "desenvolvimento", reps: 10, descanso: 35 },
      { ex: "rosca-direta", reps: 12, descanso: 30 },
      { ex: "triceps-frances", reps: 12, descanso: 30 },
      { ex: "elevacao-lateral", reps: 12, descanso: 30 },
      { ex: "rosca-martelo", reps: 12, descanso: 30 },
    ],
  },
];
