/*
 * anamnese.js
 * Questionário de perfil + gerador de treino personalizado.
 * O perfil é salvo no localStorage e usado para montar "Seu treino".
 */

const CHAVE_PERFIL = "treinoEmCasa.perfil";
const ORDEM_NIVEL = { iniciante: 1, intermediario: 2, avancado: 3 };

// Perguntas da anamnese (usadas para montar o passo a passo na interface).
const PERGUNTAS = [
  {
    chave: "objetivo",
    titulo: "Qual é o seu objetivo principal?",
    opcoes: [
      { val: "emagrecer", label: "Perder peso e definir", icone: "🔥" },
      { val: "forca", label: "Ganhar força e músculo", icone: "💪" },
      { val: "manter", label: "Manter a forma e a saúde", icone: "❤️" },
      { val: "flexibilidade", label: "Mobilidade e flexibilidade", icone: "🧘" },
    ],
  },
  {
    chave: "nivel",
    titulo: "Qual é o seu nível hoje?",
    opcoes: [
      { val: "iniciante", label: "Iniciante", icone: "🌱", desc: "Estou começando agora" },
      { val: "intermediario", label: "Intermediário", icone: "⚡", desc: "Já treino de vez em quando" },
      { val: "avancado", label: "Avançado", icone: "🏆", desc: "Treino com frequência" },
    ],
  },
  {
    chave: "frequencia",
    titulo: "Quantas vezes por semana quer treinar?",
    opcoes: [
      { val: "2", label: "2x" },
      { val: "3", label: "3x" },
      { val: "4", label: "4x" },
      { val: "5", label: "5x ou mais" },
    ],
  },
  {
    chave: "tempo",
    titulo: "Quanto tempo você tem por treino?",
    opcoes: [
      { val: "10", label: "~10 min", icone: "⏱" },
      { val: "20", label: "~20 min", icone: "⏱" },
      { val: "30", label: "~30 min", icone: "⏱" },
    ],
  },
  {
    chave: "equip",
    titulo: "Qual equipamento você tem em casa?",
    opcoes: [
      { val: "nenhum", label: "Só o peso do corpo", icone: "🤸" },
      { val: "halter", label: "Tenho 1 halter", icone: "🏋️" },
    ],
  },
  {
    chave: "restricoes",
    titulo: "Tem alguma dor ou limitação?",
    subtitulo: "Opcional — vamos evitar exercícios que sobrecarreguem essa região.",
    multi: true,
    opcoes: [
      { val: "joelho", label: "Joelho" },
      { val: "lombar", label: "Lombar / coluna" },
      { val: "ombro", label: "Ombro" },
      { val: "punho", label: "Punho" },
    ],
  },
];

function lerPerfil() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_PERFIL));
  } catch (e) {
    return null;
  }
}

function salvarPerfil(perfil) {
  localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}

const LABEL_OBJETIVO = {
  emagrecer: "perder peso",
  forca: "ganho de força",
  manter: "manutenção da forma",
  flexibilidade: "mobilidade",
};

/**
 * Gera um treino personalizado a partir do perfil.
 * Retorna um objeto de rotina compatível com o resto do app.
 */
function gerarPlano(perfil) {
  const permiteHalter = perfil.equip === "halter";
  const nivelMax = ORDEM_NIVEL[perfil.nivel];
  const restricoes = perfil.restricoes || [];
  const tempo = parseInt(perfil.tempo, 10) || 20;

  // 1) Filtra exercícios elegíveis.
  let candidatos = EXERCICIOS.filter((ex) => {
    if (ex.equip === "halter" && !permiteHalter) return false;
    if (ORDEM_NIVEL[ex.nivel] > nivelMax) return false;
    if (restricoes.some((r) => ex.contra.includes(r))) return false;
    return true;
  });

  // 2) Prioriza os que combinam com o objetivo.
  const prioridade = candidatos.filter((ex) => ex.objetivo.includes(perfil.objetivo));
  const resto = candidatos.filter((ex) => !ex.objetivo.includes(perfil.objetivo));
  const ordenados = prioridade.concat(resto);

  // 3) Quantidade de exercícios conforme o tempo.
  const alvo = tempo >= 30 ? 8 : tempo >= 20 ? 6 : 4;

  // 4) Seleciona com diversidade de grupos musculares.
  const escolhidos = [];
  const usoPorGrupo = {};
  for (const ex of ordenados) {
    if (escolhidos.length >= alvo) break;
    const usos = usoPorGrupo[ex.grupo] || 0;
    if (usos < 2) {
      escolhidos.push(ex);
      usoPorGrupo[ex.grupo] = usos + 1;
    }
  }
  // Completa se faltou (poucos grupos disponíveis).
  if (escolhidos.length < alvo) {
    for (const ex of ordenados) {
      if (escolhidos.length >= alvo) break;
      if (!escolhidos.includes(ex)) escolhidos.push(ex);
    }
  }

  // 5) Define carga, repetições/tempo e descanso conforme objetivo e nível.
  const descanso =
    perfil.objetivo === "emagrecer" ? 18 : perfil.objetivo === "forca" ? 40 : 30;
  const repsPorNivel = { iniciante: 10, intermediario: 12, avancado: 15 };
  const tempoPorNivel = { iniciante: 20, intermediario: 30, avancado: 40 };

  const exercicios = escolhidos.map((ex) => {
    const item = { ex: ex.id, descanso };
    if (ex.tipo === "tempo") item.duracao = tempoPorNivel[perfil.nivel];
    else item.reps = repsPorNivel[perfil.nivel];
    return item;
  });

  return {
    id: "meu-treino",
    personalizado: true,
    nome: "Seu treino personalizado",
    descricao:
      "Montado para " +
      LABEL_OBJETIVO[perfil.objetivo] +
      ", nível " +
      perfil.nivel +
      (permiteHalter ? ", usando seu halter." : ", com peso do corpo."),
    nivel: perfil.nivel,
    equip: perfil.equip,
    duracaoAprox: tempo,
    frequencia: perfil.frequencia,
    exercicios: exercicios,
  };
}

// Texto de recomendação semanal para exibir no cartão do treino.
function textoFrequencia(perfil) {
  const f = perfil.frequencia;
  const dias =
    f === "2"
      ? "2 vezes por semana, com pelo menos 2 dias de descanso entre eles"
      : f === "3"
      ? "3 vezes por semana, em dias alternados"
      : f === "4"
      ? "4 vezes por semana"
      : "5 ou mais vezes por semana, variando a intensidade";
  return "Recomendado: treinar " + dias + ".";
}
