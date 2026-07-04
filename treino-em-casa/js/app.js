/*
 * app.js — lógica do "Treino em Casa"
 * Sem dependências externas. Salva perfil e histórico no localStorage.
 */

(function () {
  "use strict";

  const CHAVE_HISTORICO = "treinoEmCasa.historico";

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

  // Guarda os planos gerados (personalizado) para conseguir iniciá-los depois.
  const ROTINAS_DINAMICAS = {};
  function acharRotina(id) {
    return ROTINAS_DINAMICAS[id] || ROTINAS.find((r) => r.id === id);
  }

  /* ============ Navegação por abas ============ */

  function trocarAba(nome) {
    $$(".aba").forEach((b) => b.classList.toggle("aba--ativa", b.dataset.aba === nome));
    $$(".tela").forEach((t) => t.classList.toggle("tela--ativa", t.id === "tela-" + nome));
    if (nome === "historico") renderHistorico();
    if (nome === "rotinas") {
      renderResumoSemana();
      renderPersonalizado();
    }
  }

  /* ============ Tela: Rotinas ============ */

  function renderResumoSemana() {
    const historico = lerHistorico();
    const seteDiasAtras = new Date(Date.now() - 7 * 864e5);
    const naSemana = historico.filter((h) => new Date(h.data) >= seteDiasAtras);
    $("#resumo-semana").innerHTML = `
      <div class="resumo-semana__num">${naSemana.length}</div>
      <div class="resumo-semana__txt">
        ${naSemana.length === 1 ? "treino nos últimos 7 dias" : "treinos nos últimos 7 dias"}
        ${naSemana.length === 0 ? " — bora começar! 💪" : " — mandou bem! 🔥"}
      </div>`;
  }

  // Cartão do treino personalizado (ou convite para fazer a anamnese).
  function renderPersonalizado() {
    const area = $("#area-personalizado");
    const perfil = lerPerfil();
    if (!perfil) {
      area.innerHTML = `
        <div class="cartao-convite">
          <div class="cartao-convite__titulo">✨ Monte seu treino ideal</div>
          <p class="cartao-convite__txt">Responda algumas perguntas rápidas e o app monta um treino sob medida para você.</p>
          <button class="btn-iniciar" id="btn-fazer-anamnese">Começar anamnese</button>
        </div>`;
      $("#btn-fazer-anamnese").addEventListener("click", iniciarAnamnese);
      return;
    }
    const plano = gerarPlano(perfil);
    ROTINAS_DINAMICAS[plano.id] = plano;
    area.innerHTML = `
      <div class="cartao-rotina cartao-rotina--destaque" data-rotina="${plano.id}">
        <div class="cartao-rotina__topo">
          <span class="cartao-rotina__nome">⭐ ${plano.nome}</span>
        </div>
        <p class="cartao-rotina__desc">${plano.descricao}</p>
        <p class="cartao-rotina__freq">${textoFrequencia(perfil)}</p>
        <div class="cartao-rotina__meta">
          <span class="tag tag--${plano.nivel}">${NIVEL_LABEL[plano.nivel]}</span>
          <span class="tag">⏱ ~${plano.duracaoAprox} min</span>
          <span class="tag">${plano.exercicios.length} exercícios</span>
        </div>
        <button class="btn-iniciar" data-iniciar="${plano.id}">▶ Iniciar treino</button>
        <button class="link-ajustar" id="btn-ajustar-perfil">Refazer anamnese</button>
      </div>`;
    area.querySelector("[data-iniciar]").addEventListener("click", (e) => {
      e.stopPropagation();
      iniciarTreino(plano);
    });
    $("#btn-ajustar-perfil").addEventListener("click", (e) => {
      e.stopPropagation();
      iniciarAnamnese();
    });
  }

  let filtroEquipRotina = "todos";
  function renderRotinas() {
    const container = $("#lista-rotinas");
    const lista = ROTINAS.filter(
      (r) => filtroEquipRotina === "todos" || r.equip === filtroEquipRotina
    );
    container.innerHTML = lista
      .map(
        (r) => `
        <div class="cartao-rotina" data-rotina="${r.id}">
          <div class="cartao-rotina__topo">
            <span class="cartao-rotina__nome">${r.nome}</span>
          </div>
          <p class="cartao-rotina__desc">${r.descricao}</p>
          <div class="cartao-rotina__meta">
            <span class="tag tag--${r.nivel}">${NIVEL_LABEL[r.nivel]}</span>
            <span class="tag">⏱ ~${r.duracaoAprox} min</span>
            <span class="tag">${r.exercicios.length} exercícios</span>
            ${r.equip === "halter" ? '<span class="tag tag--halter">🏋️ halter</span>' : ""}
          </div>
          <button class="btn-iniciar" data-iniciar="${r.id}">▶ Iniciar treino</button>
        </div>`
      )
      .join("");

    container.querySelectorAll("[data-iniciar]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        iniciarTreino(acharRotina(btn.dataset.iniciar));
      });
    });
  }

  /* ============ Tela: Exercícios ============ */

  function renderExercicios(filtroEquip = "todos") {
    const container = $("#lista-exercicios");
    const lista = EXERCICIOS.filter(
      (ex) => filtroEquip === "todos" || ex.equip === filtroEquip
    );
    container.innerHTML = lista
      .map(
        (ex) => `
        <div class="cartao-ex" data-ex="${ex.id}">
          <div class="cartao-ex__mini">${animacaoSVG(ex.anim, ex.equip === "halter")}</div>
          <div class="cartao-ex__txt">
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
    $("#modal-anim").innerHTML = animacaoSVG(ex.anim, ex.equip === "halter");
    $("#modal-titulo").textContent = ex.nome;
    let sub = ex.grupo + " · " + NIVEL_LABEL[ex.nivel];
    if (ex.equip === "halter") sub += " · Halter ~" + cargaEmKg(ex.carga) + "kg (" + ex.carga + ")";
    $("#modal-grupo").textContent = sub;
    $("#modal-descricao").textContent = ex.descricao;
    $("#modal-dica").innerHTML = "💡 <strong>Dica:</strong> " + ex.dicas;
    $("#modal-exercicio").hidden = false;
  }

  /* ============ Tela: Histórico ============ */

  function renderHistorico() {
    const historico = lerHistorico();
    const total = historico.length;
    const seteDias = historico.filter(
      (h) => new Date(h.data) >= new Date(Date.now() - 7 * 864e5)
    ).length;
    const sequencia = calcularSequencia(historico);

    $("#estatisticas").innerHTML = `
      <div class="estat"><div class="estat__num">${total}</div><div class="estat__label">Treinos totais</div></div>
      <div class="estat"><div class="estat__num">${seteDias}</div><div class="estat__label">Últimos 7 dias</div></div>
      <div class="estat"><div class="estat__num">${sequencia}</div><div class="estat__label">Dias seguidos</div></div>`;

    // Resumo do perfil, se existir.
    const perfil = lerPerfil();
    const pr = $("#perfil-resumo");
    if (perfil) {
      pr.innerHTML = `
        <div class="perfil-resumo__linha">
          <span>🎯 Objetivo: <strong>${LABEL_OBJETIVO[perfil.objetivo]}</strong> · Nível: <strong>${perfil.nivel}</strong></span>
          <button class="link-ajustar" id="btn-ajustar-perfil-2">Refazer anamnese</button>
        </div>`;
      $("#btn-ajustar-perfil-2").addEventListener("click", iniciarAnamnese);
    } else {
      pr.innerHTML = "";
    }

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

  function calcularSequencia(historico) {
    if (historico.length === 0) return 0;
    const dias = new Set(historico.map((h) => new Date(h.data).toDateString()));
    let sequencia = 0;
    let cursor = new Date();
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
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* ============ Anamnese (questionário) ============ */

  const anamneseEstado = { passo: 0, respostas: {} };

  function iniciarAnamnese() {
    anamneseEstado.passo = 0;
    anamneseEstado.respostas = Object.assign({ restricoes: [] }, lerPerfil() || {});
    if (!Array.isArray(anamneseEstado.respostas.restricoes)) {
      anamneseEstado.respostas.restricoes = [];
    }
    $("#anamnese").hidden = false;
    document.body.style.overflow = "hidden";
    renderPassoAnamnese();
  }

  function renderPassoAnamnese() {
    const p = PERGUNTAS[anamneseEstado.passo];
    const respostas = anamneseEstado.respostas;
    $("#anamnese-barra").style.width =
      ((anamneseEstado.passo + 1) / PERGUNTAS.length) * 100 + "%";

    const opcoes = p.opcoes
      .map((o) => {
        const selecionado = p.multi
          ? respostas[p.chave].includes(o.val)
          : respostas[p.chave] === o.val;
        return `
          <button class="opcao ${selecionado ? "opcao--sel" : ""}" data-val="${o.val}">
            ${o.icone ? `<span class="opcao__icone">${o.icone}</span>` : ""}
            <span class="opcao__texto">
              <span class="opcao__label">${o.label}</span>
              ${o.desc ? `<span class="opcao__desc">${o.desc}</span>` : ""}
            </span>
            ${p.multi ? `<span class="opcao__check">${selecionado ? "✓" : ""}</span>` : ""}
          </button>`;
      })
      .join("");

    $("#anamnese-corpo").innerHTML = `
      <p class="anamnese__passo">Pergunta ${anamneseEstado.passo + 1} de ${PERGUNTAS.length}</p>
      <h2 class="anamnese__titulo">${p.titulo}</h2>
      ${p.subtitulo ? `<p class="anamnese__sub">${p.subtitulo}</p>` : ""}
      <div class="anamnese__opcoes">${opcoes}</div>`;

    $$("#anamnese-corpo .opcao").forEach((btn) => {
      btn.addEventListener("click", () => selecionarOpcao(p, btn.dataset.val));
    });

    $("#anamnese-voltar").style.visibility = anamneseEstado.passo === 0 ? "hidden" : "visible";
    const ultimo = anamneseEstado.passo === PERGUNTAS.length - 1;
    $("#anamnese-avancar").textContent = ultimo ? "Montar meu treino ✓" : "Continuar";
    atualizarBotaoAvancar(p);
  }

  function selecionarOpcao(pergunta, valor) {
    const respostas = anamneseEstado.respostas;
    if (pergunta.multi) {
      const arr = respostas[pergunta.chave];
      const i = arr.indexOf(valor);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(valor);
    } else {
      respostas[pergunta.chave] = valor;
    }
    renderPassoAnamnese();
  }

  // Só habilita "Continuar" quando a pergunta atual (não opcional) foi respondida.
  function atualizarBotaoAvancar(pergunta) {
    const respostas = anamneseEstado.respostas;
    const respondido = pergunta.multi ? true : !!respostas[pergunta.chave];
    const btn = $("#anamnese-avancar");
    btn.disabled = !respondido;
    btn.classList.toggle("btn--desabilitado", !respondido);
  }

  function avancarAnamnese() {
    const p = PERGUNTAS[anamneseEstado.passo];
    if (!p.multi && !anamneseEstado.respostas[p.chave]) return;
    if (anamneseEstado.passo < PERGUNTAS.length - 1) {
      anamneseEstado.passo++;
      renderPassoAnamnese();
    } else {
      salvarPerfil(anamneseEstado.respostas);
      $("#anamnese").hidden = true;
      document.body.style.overflow = "";
      trocarAba("rotinas");
    }
  }

  function voltarAnamnese() {
    if (anamneseEstado.passo > 0) {
      anamneseEstado.passo--;
      renderPassoAnamnese();
    }
  }

  /* ============ Motor do treino em execução ============ */

  const treino = {
    rotina: null,
    indice: 0,
    fase: "preparar",
    tempoRestante: 0,
    intervalo: null,
    pausado: false,
  };
  const TEMPO_PREPARO = 5;

  function iniciarTreino(rotina) {
    if (!rotina) return;
    treino.rotina = rotina;
    treino.indice = 0;
    treino.pausado = false;
    $("#btn-pausar").hidden = false;
    $("#treino").hidden = false;
    document.body.style.overflow = "hidden";
    entrarFase("preparar");
  }

  function mostrarAnim(ex) {
    $("#treino-anim").innerHTML = animacaoSVG(ex.anim, ex.equip === "halter");
  }

  function metaComCarga(item, ex) {
    let txt = descreveMeta(item);
    if (ex.equip === "halter") txt += " · " + cargaEmKg(ex.carga) + "kg";
    return txt;
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
      mostrarAnim(ex);
      $("#treino-exercicio").textContent = ex.nome;
      $("#treino-descricao").textContent = ex.descricao;
      $("#treino-meta").textContent = metaComCarga(item, ex);
      iniciarContagem(TEMPO_PREPARO, () => entrarFase("exercicio"));
    } else if (fase === "exercicio") {
      $("#treino-fase").textContent = "Vai!";
      mostrarAnim(ex);
      $("#treino-exercicio").textContent = ex.nome;
      $("#treino-descricao").textContent = ex.descricao;
      $("#treino-meta").textContent = metaComCarga(item, ex);
      bip();
      if (item.duracao) iniciarContagem(item.duracao, () => avancarAposExercicio());
      else modoRepeticoes();
    } else if (fase === "descanso") {
      $("#treino-fase").textContent = "Descanso";
      const proxItem = treino.rotina.exercicios[treino.indice];
      const proxEx = EXERCICIOS_POR_ID[proxItem.ex];
      mostrarAnim(proxEx);
      $("#treino-exercicio").textContent = "Próximo: " + proxEx.nome;
      $("#treino-descricao").textContent = "Respire e prepare-se.";
      $("#treino-meta").textContent = metaComCarga(proxItem, proxEx);
      const anterior = treino.rotina.exercicios[treino.indice - 1];
      iniciarContagem(anterior.descanso, () => entrarFase("preparar"));
    }
  }

  function modoRepeticoes() {
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

  function avancarAposExercicio() {
    limparIntervalo();
    const item = treino.rotina.exercicios[treino.indice];
    if (treino.indice >= treino.rotina.exercicios.length - 1) {
      concluirTreino();
      return;
    }
    treino.indice++;
    if (item.descanso && item.descanso > 0) entrarFase("descanso");
    else entrarFase("preparar");
  }

  function concluirTreino() {
    limparIntervalo();
    salvarTreinoConcluido(treino.rotina);
    bip();
    $("#treino-anim").innerHTML = "";
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

  /* ============ Som (bip) ============ */
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
      /* silencioso */
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
      $$("#filtros-nivel .chip").forEach((c) => c.classList.toggle("chip--ativo", c === chip));
      renderExercicios(chip.dataset.nivel);
    });

    $("#filtros-equip").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      $$("#filtros-equip .chip").forEach((c) => c.classList.toggle("chip--ativo", c === chip));
      filtroEquipRotina = chip.dataset.equip;
      renderRotinas();
    });

    $("#lista-rotinas").addEventListener("click", (e) => {
      const cartao = e.target.closest(".cartao-rotina");
      if (cartao && !e.target.closest("[data-iniciar]")) {
        iniciarTreino(acharRotina(cartao.dataset.rotina));
      }
    });

    $("#btn-sair-treino").addEventListener("click", sairTreino);
    $("#btn-pausar").addEventListener("click", () => {
      treino.pausado = !treino.pausado;
      $("#btn-pausar").textContent = treino.pausado ? "Continuar" : "Pausar";
    });
    $("#btn-proximo").addEventListener("click", () => {
      if (treino.fase === "fim") sairTreino();
      else if (treino.fase === "exercicio") avancarAposExercicio();
      else {
        limparIntervalo();
        if (treino.fase === "preparar") entrarFase("exercicio");
        else entrarFase("preparar");
      }
    });

    $("#modal-fechar").addEventListener("click", () => ($("#modal-exercicio").hidden = true));
    $("#modal-exercicio").addEventListener("click", (e) => {
      if (e.target.id === "modal-exercicio") $("#modal-exercicio").hidden = true;
    });

    $("#anamnese-avancar").addEventListener("click", avancarAnamnese);
    $("#anamnese-voltar").addEventListener("click", voltarAnamnese);
  }

  /* ============ Início ============ */
  document.addEventListener("DOMContentLoaded", () => {
    renderResumoSemana();
    renderPersonalizado();
    renderRotinas();
    renderExercicios();
    ligarEventos();
    // Primeira visita: abre a anamnese automaticamente.
    if (!lerPerfil()) iniciarAnamnese();
  });
})();
