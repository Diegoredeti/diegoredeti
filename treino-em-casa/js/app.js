/*
 * app.js — lógica do "Treino em Casa"
 * Sem dependências externas. Salva o histórico no localStorage do aparelho.
 */

(function () {
  "use strict";

  const CHAVE_HISTORICO = "treinoEmCasa.historico";

  // Atalhos para pegar elementos.
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const NIVEL_LABEL = {
    iniciante: "Iniciante",
    intermediario: "Intermediário",
    avancado: "Avançado",
  };

  /* ============ Histórico (localStorage) ============ */

  function lerHistorico() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_HISTORICO)) || [];
    } catch (e) {
      return [];
    }
  }

  function salvarTreinoConcluido(rotina) {
    const historico = lerHistorico();
    historico.unshift({
      rotinaId: rotina.id,
      nome: rotina.nome,
      qtdExercicios: rotina.exercicios.length,
      data: new Date().toISOString(),
    });
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
  }

  /* ============ Navegação por abas ============ */

  function trocarAba(nome) {
    $$(".aba").forEach((b) =>
      b.classList.toggle("aba--ativa", b.dataset.aba === nome)
    );
    $$(".tela").forEach((t) =>
      t.classList.toggle("tela--ativa", t.id === "tela-" + nome)
    );
    if (nome === "historico") renderHistorico();
    if (nome === "rotinas") renderResumoSemana();
  }

  /* ============ Tela: Rotinas ============ */

  function renderResumoSemana() {
    const historico = lerHistorico();
    const agora = new Date();
    const seteDiasAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    const naSemana = historico.filter((h) => new Date(h.data) >= seteDiasAtras);
    const el = $("#resumo-semana");
    el.innerHTML = `
      <div class="resumo-semana__num">${naSemana.length}</div>
      <div class="resumo-semana__txt">
        ${naSemana.length === 1 ? "treino nos últimos 7 dias" : "treinos nos últimos 7 dias"}
        ${naSemana.length === 0 ? " — bora começar! 💪" : " — mandou bem! 🔥"}
      </div>`;
  }

  function renderRotinas() {
    const container = $("#lista-rotinas");
    container.innerHTML = ROTINAS.map((r) => {
      return `
        <div class="cartao-rotina" data-rotina="${r.id}">
          <div class="cartao-rotina__topo">
            <span class="cartao-rotina__nome">${r.nome}</span>
          </div>
          <p class="cartao-rotina__desc">${r.descricao}</p>
          <div class="cartao-rotina__meta">
            <span class="tag tag--${r.nivel}">${NIVEL_LABEL[r.nivel]}</span>
            <span class="tag">⏱ ~${r.duracaoAprox} min</span>
            <span class="tag">${r.exercicios.length} exercícios</span>
          </div>
          <button class="btn-iniciar" data-iniciar="${r.id}">▶ Iniciar treino</button>
        </div>`;
    }).join("");

    container.querySelectorAll("[data-iniciar]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const rotina = ROTINAS.find((r) => r.id === btn.dataset.iniciar);
        iniciarTreino(rotina);
      });
    });
  }

  /* ============ Tela: Exercícios ============ */

  function renderExercicios(nivel = "todos") {
    const container = $("#lista-exercicios");
    const lista = EXERCICIOS.filter(
      (ex) => nivel === "todos" || ex.nivel === nivel
    );
    container.innerHTML = lista
      .map(
        (ex) => `
        <div class="cartao-ex" data-ex="${ex.id}">
          <div>
            <div class="cartao-ex__nome">${ex.nome}</div>
            <div class="cartao-ex__grupo">${ex.grupo} · ${NIVEL_LABEL[ex.nivel]}</div>
          </div>
          <span class="cartao-ex__seta">›</span>
        </div>`
      )
      .join("");

    container.querySelectorAll("[data-ex]").forEach((el) => {
      el.addEventListener("click", () => abrirModalExercicio(el.dataset.ex));
    });
  }

  function abrirModalExercicio(id) {
    const ex = EXERCICIOS_POR_ID[id];
    if (!ex) return;
    $("#modal-titulo").textContent = ex.nome;
    $("#modal-grupo").textContent = ex.grupo + " · " + NIVEL_LABEL[ex.nivel];
    $("#modal-descricao").textContent = ex.descricao;
    $("#modal-dica").innerHTML = "💡 <strong>Dica:</strong> " + ex.dicas;
    $("#modal-exercicio").hidden = false;
  }

  /* ============ Tela: Histórico ============ */

  function renderHistorico() {
    const historico = lerHistorico();

    // Estatísticas
    const total = historico.length;
    const agora = new Date();
    const seteDias = historico.filter(
      (h) => new Date(h.data) >= new Date(agora - 7 * 864e5)
    ).length;
    const sequencia = calcularSequencia(historico);

    $("#estatisticas").innerHTML = `
      <div class="estat"><div class="estat__num">${total}</div><div class="estat__label">Treinos totais</div></div>
      <div class="estat"><div class="estat__num">${seteDias}</div><div class="estat__label">Últimos 7 dias</div></div>
      <div class="estat"><div class="estat__num">${sequencia}</div><div class="estat__label">Dias em sequência</div></div>`;

    const lista = $("#lista-historico");
    if (historico.length === 0) {
      lista.innerHTML = `<p class="vazio">Você ainda não concluiu nenhum treino.<br />Escolha uma rotina e comece! 🏃</p>`;
      return;
    }
    lista.innerHTML = historico
      .map(
        (h) => `
        <div class="hist-item">
          <div>
            <div class="hist-item__nome">${h.nome}</div>
            <div class="hist-item__data">${formatarData(h.data)}</div>
          </div>
          <span class="tag">${h.qtdExercicios} ex.</span>
        </div>`
      )
      .join("");
  }

  // Conta quantos dias seguidos (a partir de hoje/ontem) tiveram ao menos um treino.
  function calcularSequencia(historico) {
    if (historico.length === 0) return 0;
    const dias = new Set(
      historico.map((h) => new Date(h.data).toDateString())
    );
    let sequencia = 0;
    let cursor = new Date();
    // Se não treinou hoje, a sequência ainda pode contar a partir de ontem.
    if (!dias.has(cursor.toDateString())) {
      cursor.setDate(cursor.getDate() - 1);
      if (!dias.has(cursor.toDateString())) return 0;
    }
    while (dias.has(cursor.toDateString())) {
      sequencia++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return sequencia;
  }

  function formatarData(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* ============ Motor do treino em execução ============ */

  const treino = {
    rotina: null,
    indice: 0, // qual exercício
    fase: "preparar", // preparar | exercicio | descanso
    tempoRestante: 0,
    intervalo: null,
    pausado: false,
  };

  const TEMPO_PREPARO = 5; // segundos de contagem inicial

  function iniciarTreino(rotina) {
    treino.rotina = rotina;
    treino.indice = 0;
    treino.pausado = false;
    $("#treino").hidden = false;
    document.body.style.overflow = "hidden";
    entrarFase("preparar");
  }

  function entrarFase(fase) {
    limparIntervalo();
    treino.fase = fase;
    const item = treino.rotina.exercicios[treino.indice];
    const ex = EXERCICIOS_POR_ID[item.ex];
    const painel = $("#treino");

    painel.classList.toggle("treino--descanso", fase === "descanso");
    $("#treino-progresso").textContent =
      treino.indice + 1 + " / " + treino.rotina.exercicios.length;
    atualizarProximo();

    if (fase === "preparar") {
      $("#treino-fase").textContent = "Prepare-se";
      $("#treino-exercicio").textContent = ex.nome;
      $("#treino-descricao").textContent = ex.descricao;
      $("#treino-meta").textContent = descreveMeta(item);
      iniciarContagem(TEMPO_PREPARO, () => entrarFase("exercicio"));
    } else if (fase === "exercicio") {
      $("#treino-fase").textContent = "Vai!";
      $("#treino-exercicio").textContent = ex.nome;
      $("#treino-descricao").textContent = ex.descricao;
      $("#treino-meta").textContent = descreveMeta(item);
      bip();
      if (item.duracao) {
        // Exercício por tempo: cronometra e avança sozinho.
        iniciarContagem(item.duracao, () => avancarAposExercicio());
      } else {
        // Exercício por repetições: usuário controla, sem contagem regressiva.
        modoRepeticoes(item);
      }
    } else if (fase === "descanso") {
      $("#treino-fase").textContent = "Descanso";
      const proxItem = treino.rotina.exercicios[treino.indice];
      const proxEx = EXERCICIOS_POR_ID[proxItem.ex];
      $("#treino-exercicio").textContent = "Próximo: " + proxEx.nome;
      $("#treino-descricao").textContent = "Respire e prepare-se.";
      $("#treino-meta").textContent = descreveMeta(proxItem);
      const item0 = treino.rotina.exercicios[treino.indice - 1];
      iniciarContagem(item0.descanso, () => entrarFase("preparar"));
    }
  }

  // Exercício de repetições: mostra contador crescente e botão "Concluir".
  function modoRepeticoes(item) {
    $("#treino-cronometro").textContent = "0";
    let segundos = 0;
    $("#btn-proximo").textContent = "Concluir ✓";
    treino.intervalo = setInterval(() => {
      if (!treino.pausado) {
        segundos++;
        $("#treino-cronometro").textContent = formataMMSS(segundos);
      }
    }, 1000);
  }

  function descreveMeta(item) {
    if (item.duracao) return item.duracao + " segundos";
    if (item.reps) return item.reps + " repetições";
    return "";
  }

  function iniciarContagem(segundos, aoTerminar) {
    treino.tempoRestante = segundos;
    $("#treino-cronometro").textContent = formataMMSS(segundos);
    $("#btn-proximo").textContent = "Pular ➜";
    treino.intervalo = setInterval(() => {
      if (treino.pausado) return;
      treino.tempoRestante--;
      $("#treino-cronometro").textContent = formataMMSS(treino.tempoRestante);
      if (treino.tempoRestante <= 3 && treino.tempoRestante > 0) bip();
      if (treino.tempoRestante <= 0) {
        limparIntervalo();
        aoTerminar();
      }
    }, 1000);
  }

  // Chamado quando um exercício termina (por tempo ou pelo botão concluir).
  function avancarAposExercicio() {
    limparIntervalo();
    const item = treino.rotina.exercicios[treino.indice];
    const ehUltimo = treino.indice >= treino.rotina.exercicios.length - 1;

    if (ehUltimo) {
      concluirTreino();
      return;
    }
    treino.indice++;
    // Se o exercício anterior tinha descanso, entra em descanso; senão vai direto.
    if (item.descanso && item.descanso > 0) {
      entrarFase("descanso");
    } else {
      entrarFase("preparar");
    }
  }

  function concluirTreino() {
    limparIntervalo();
    salvarTreinoConcluido(treino.rotina);
    bip();
    $("#treino-fase").textContent = "Concluído! 🎉";
    $("#treino-exercicio").textContent = "Bom treino!";
    $("#treino-cronometro").textContent = "✓";
    $("#treino-meta").textContent = "";
    $("#treino-descricao").textContent =
      "Treino salvo no seu histórico. Parabéns pela dedicação!";
    $("#btn-proximo").textContent = "Voltar";
    $("#btn-pausar").hidden = true;
    treino.fase = "fim";
  }

  function atualizarProximo() {
    const prox = treino.rotina.exercicios[treino.indice + 1];
    $("#treino-proximo").textContent = prox
      ? "Depois: " + EXERCICIOS_POR_ID[prox.ex].nome
      : "Último exercício!";
  }

  function sairTreino() {
    limparIntervalo();
    $("#treino").hidden = true;
    $("#btn-pausar").hidden = false;
    treino.pausado = false;
    $("#btn-pausar").textContent = "Pausar";
    document.body.style.overflow = "";
    renderResumoSemana();
  }

  function limparIntervalo() {
    if (treino.intervalo) {
      clearInterval(treino.intervalo);
      treino.intervalo = null;
    }
  }

  function formataMMSS(seg) {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return (m > 0 ? String(m).padStart(2, "0") + ":" : "") + String(s).padStart(2, "0");
  }

  /* ============ Som (bip) via Web Audio ============ */
  let audioCtx = null;
  function bip() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      /* silencioso se o navegador bloquear áudio */
    }
  }

  /* ============ Eventos ============ */

  function ligarEventos() {
    $("#abas").addEventListener("click", (e) => {
      const btn = e.target.closest(".aba");
      if (btn) trocarAba(btn.dataset.aba);
    });

    $("#filtros-nivel").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      $$("#filtros-nivel .chip").forEach((c) =>
        c.classList.toggle("chip--ativo", c === chip)
      );
      renderExercicios(chip.dataset.nivel);
    });

    // Abrir rotina inteira ao clicar no cartão também inicia (fora do botão já tratado)
    $("#lista-rotinas").addEventListener("click", (e) => {
      const cartao = e.target.closest(".cartao-rotina");
      if (cartao && !e.target.closest("[data-iniciar]")) {
        const rotina = ROTINAS.find((r) => r.id === cartao.dataset.rotina);
        iniciarTreino(rotina);
      }
    });

    $("#btn-sair-treino").addEventListener("click", sairTreino);

    $("#btn-pausar").addEventListener("click", () => {
      treino.pausado = !treino.pausado;
      $("#btn-pausar").textContent = treino.pausado ? "Continuar" : "Pausar";
    });

    $("#btn-proximo").addEventListener("click", () => {
      if (treino.fase === "fim") {
        sairTreino();
      } else if (treino.fase === "exercicio") {
        avancarAposExercicio();
      } else {
        // preparar ou descanso: pular direto para a próxima fase
        limparIntervalo();
        if (treino.fase === "preparar") entrarFase("exercicio");
        else entrarFase("preparar");
      }
    });

    // Fechar modal
    $("#modal-fechar").addEventListener("click", () => {
      $("#modal-exercicio").hidden = true;
    });
    $("#modal-exercicio").addEventListener("click", (e) => {
      if (e.target.id === "modal-exercicio") $("#modal-exercicio").hidden = true;
    });
  }

  /* ============ Início ============ */
  document.addEventListener("DOMContentLoaded", () => {
    renderResumoSemana();
    renderRotinas();
    renderExercicios();
    ligarEventos();
  });
})();
