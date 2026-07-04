/*
 * animacoes.js
 * Gera animações de cada exercício em SVG (stick figure articulado).
 * Tudo é vetorial e animado por CSS (ver css/animacoes.css) — funciona offline.
 *
 * Uso:  animacaoSVG("agachar", true)  -> string com <svg> animado
 *
 * Exercícios "em pé" usam um esqueleto articulado comum; os de solo
 * usam figuras dedicadas. A classe .a-<tipo> no <svg> aciona a animação.
 */

const ANIM_SOLO = ["flexao", "prancha", "abdominal", "ponte", "escalador", "superman"];

// Haltere desenhado na mão (coordenadas locais do grupo do antebraço).
function halter(x, y) {
  return (
    `<g class="halter">` +
    `<rect x="${x - 2.5}" y="${y - 10}" width="5" height="20" rx="2"/>` +
    `<rect x="${x - 8}" y="${y - 11}" width="6" height="22" rx="2"/>` +
    `<rect x="${x + 2}" y="${y - 11}" width="6" height="22" rx="2"/>` +
    `</g>`
  );
}

// Esqueleto em pé (viewBox 0 0 200 250). Braços/pernas desenhados para baixo
// a partir da articulação, para o pivô de rotação cair exatamente na junta.
function figuraEmPe(comHalter) {
  const hE = comHalter ? halter(84, 162) : "";
  const hD = comHalter ? halter(116, 162) : "";
  return `
    <g class="fig">
      <g class="tronco">
        <circle class="cabeca" cx="100" cy="78" r="15"/>
        <line class="osso torso" x1="100" y1="96" x2="100" y2="166"/>
        <!-- braço esquerdo -->
        <g class="braco-e">
          <line class="osso" x1="84" y1="102" x2="84" y2="132"/>
          <g class="antebraco-e">
            <line class="osso" x1="84" y1="132" x2="84" y2="162"/>
            <circle class="mao" cx="84" cy="162" r="4"/>
            ${hE}
          </g>
        </g>
        <!-- braço direito -->
        <g class="braco-d">
          <line class="osso" x1="116" y1="102" x2="116" y2="132"/>
          <g class="antebraco-d">
            <line class="osso" x1="116" y1="132" x2="116" y2="162"/>
            <circle class="mao" cx="116" cy="162" r="4"/>
            ${hD}
          </g>
        </g>
      </g>
      <!-- quadril e pernas -->
      <line class="osso" x1="88" y1="166" x2="112" y2="166"/>
      <g class="coxa-e">
        <line class="osso" x1="88" y1="166" x2="88" y2="199"/>
        <g class="canela-e">
          <line class="osso" x1="88" y1="199" x2="88" y2="232"/>
          <line class="osso pe" x1="88" y1="232" x2="99" y2="232"/>
        </g>
      </g>
      <g class="coxa-d">
        <line class="osso" x1="112" y1="166" x2="112" y2="199"/>
        <g class="canela-d">
          <line class="osso" x1="112" y1="199" x2="112" y2="232"/>
          <line class="osso pe" x1="112" y1="232" x2="123" y2="232"/>
        </g>
      </g>
    </g>`;
}

// ---- Figuras de solo (cada uma com viewBox próprio) ----

function figuraFlexao() {
  return {
    vb: "0 0 240 150",
    svg: `
      <line class="chao" x1="10" y1="129" x2="230" y2="129"/>
      <g class="fx-corpo">
        <line class="osso" x1="34" y1="128" x2="96" y2="104"/>
        <line class="osso" x1="96" y1="104" x2="168" y2="84"/>
        <circle class="cabeca" cx="188" cy="76" r="13"/>
        <line class="osso" x1="168" y1="84" x2="168" y2="128"/>
      </g>`,
  };
}

function figuraPrancha() {
  return {
    vb: "0 0 240 150",
    svg: `
      <line class="chao" x1="10" y1="129" x2="230" y2="129"/>
      <g class="pk-corpo">
        <line class="osso" x1="34" y1="128" x2="96" y2="100"/>
        <line class="osso" x1="96" y1="100" x2="168" y2="82"/>
        <circle class="cabeca" cx="188" cy="74" r="13"/>
        <line class="osso" x1="168" y1="82" x2="168" y2="128"/>
        <line class="osso" x1="150" y1="88" x2="150" y2="128"/>
      </g>`,
  };
}

function figuraEscalador() {
  return {
    vb: "0 0 240 150",
    svg: `
      <line class="chao" x1="10" y1="129" x2="230" y2="129"/>
      <line class="osso" x1="96" y1="104" x2="168" y2="84"/>
      <circle class="cabeca" cx="188" cy="76" r="13"/>
      <line class="osso" x1="168" y1="84" x2="168" y2="128"/>
      <g class="mc-perna-e"><line class="osso" x1="96" y1="104" x2="42" y2="128"/></g>
      <g class="mc-perna-d"><line class="osso" x1="96" y1="104" x2="42" y2="128"/></g>`,
  };
}

function figuraAbdominal() {
  return {
    vb: "0 0 220 150",
    svg: `
      <line class="chao" x1="10" y1="121" x2="210" y2="121"/>
      <line class="osso" x1="140" y1="118" x2="118" y2="84"/>
      <line class="osso" x1="118" y1="84" x2="94" y2="118"/>
      <g class="ab-tronco">
        <line class="osso" x1="140" y1="118" x2="182" y2="110"/>
        <circle class="cabeca" cx="198" cy="106" r="13"/>
      </g>`,
  };
}

function figuraPonte() {
  return {
    vb: "0 0 220 150",
    svg: `
      <line class="chao" x1="10" y1="121" x2="210" y2="121"/>
      <circle class="cabeca" cx="34" cy="112" r="13"/>
      <line class="osso" x1="150" y1="90" x2="150" y2="118"/>
      <g class="pt-corpo">
        <line class="osso" x1="48" y1="118" x2="112" y2="118"/>
        <line class="osso" x1="112" y1="118" x2="150" y2="90"/>
      </g>`,
  };
}

function figuraSuperman() {
  return {
    vb: "0 0 240 150",
    svg: `
      <line class="chao" x1="10" y1="121" x2="230" y2="121"/>
      <line class="osso" x1="118" y1="108" x2="168" y2="108"/>
      <circle class="cabeca" cx="186" cy="104" r="13"/>
      <g class="sm-braco"><line class="osso" x1="168" y1="108" x2="210" y2="108"/></g>
      <g class="sm-perna"><line class="osso" x1="118" y1="108" x2="70" y2="108"/></g>`,
  };
}

const FIGURAS_SOLO = {
  flexao: figuraFlexao,
  prancha: figuraPrancha,
  escalador: figuraEscalador,
  abdominal: figuraAbdominal,
  ponte: figuraPonte,
  superman: figuraSuperman,
};

/**
 * Retorna o SVG animado para um tipo de movimento.
 * @param {string} anim - valor do campo `anim` do exercício
 * @param {boolean} comHalter - desenha o haltere na mão
 */
function animacaoSVG(anim, comHalter) {
  if (ANIM_SOLO.includes(anim)) {
    const f = FIGURAS_SOLO[anim]();
    return `<svg class="anim a-${anim}" viewBox="${f.vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${f.svg}</svg>`;
  }
  return `<svg class="anim a-${anim}" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${figuraEmPe(
    comHalter
  )}</svg>`;
}
