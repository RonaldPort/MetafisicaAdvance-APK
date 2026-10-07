/* Metafísica Advance · capa Android (2/2)
   · Código secreto con los botones de la consola:  ← → ← → A B A B ←
   · Despedida: desfile de lógicos y filósofos analíticos del siglo XX (también al vencer a Carnap)
   · Integración nativa: botón «atrás» = B, guardado al salir de la app, memoria de despedidas vistas */
(function () {
  'use strict';
  if (typeof GFX === 'undefined' || !window.MA) { console.warn('apk-extras: el juego no expuso GFX/MA'); return; }
  var AU = window.FAudio || { play: function () {}, sfx: {} };
  var stage = document.getElementById('stage');
  var legendEl = document.getElementById('legend');
  var XKEY = 'metafisica-advance-apk';

  /* ---------- memoria propia de la capa Android ---------- */
  function mem() { try { return Object.assign({ v: 1, seen: 0, code: 0, fin: 0 }, JSON.parse(localStorage.getItem(XKEY) || '{}')); } catch (e) { return { v: 1, seen: 0, code: 0, fin: 0 }; } }
  function memSave(m) { try { localStorage.setItem(XKEY, JSON.stringify(m)); } catch (e) { /* sin almacenamiento */ } }

  /* ---------- reparto: aspecto pixelado de cada figura ---------- */
  var SKN = (typeof SK !== 'undefined') ? SK : { a: '#f6d7b8', b: '#eebf94' };
  var HW = '#f0ecf6', HG = '#b9b4c8', HD = '#2a2a3a', HB = '#5a4038', HL = '#8a6a4a', HY = '#d9b45a', HK = '#1d1438', HR = '#9a4a2a';
  var SUITS = ['#3a3a4a', '#5a4a3a', '#2a3a5a', '#4a3a5a', '#3a4a3a', '#6a4a3a', '#2a2a3a', '#5a5a6a'];
  var TIES = ['#c92a26', '#33479e', '#2f9950', '#e0a020', '#8a5ad0', '#3ab0a0'];
  var n = 0;
  /* L(peinado, color de pelo, extras): b barba (1 corta, 2 poblada, 3 bigote), g gafas, prop objeto, f mujer */
  function L(hs, h, x) {
    x = x || {}; n++;
    var p = { sk: SKN.a, h: h, hs: hs, cl: SUITS[n % SUITS.length], cs: 'suit', tie: TIES[(n * 7) % TIES.length] };
    if (x.f) { p.cs = 'dress'; p.cl = ['#7a3fa0', '#2a6a8a', '#8a2a4a', '#3a6a4a'][n % 4]; p.inn = '#f4f4fa'; }
    for (var k in x) if (k !== 'f') p[k] = x[k];
    return p;
  }
  function C(key) { return (typeof CH !== 'undefined' && CH[key]) ? CH[key].p : L('part', HG); }

  var GROUPS = [
    { g: 'Los fundadores', d: 'Cambridge y Jena: la lógica nueva se vuelve método filosófico.', c: '#ffcf2e', who: [
      ['Gottlob Frege', '1848–1925', 'Conceptografía; sentido y referencia.', C('frege')],
      ['Bertrand Russell', '1872–1970', 'Teoría de las descripciones; Principia Mathematica.', L('wild', HW, { prop: 'pointer' })],
      ['Alfred N. Whitehead', '1861–1947', 'Principia Mathematica (con Russell); filosofía del proceso.', L('bald', HW, { prop: 'book' })],
      ['G. E. Moore', '1873–1958', '«Prueba de un mundo exterior»; la defensa del sentido común.', L('short', HG)],
      ['J. M. E. McTaggart', '1866–1925', 'La irrealidad del tiempo: series A y B.', C('mctaggart')],
      ['Ludwig Wittgenstein', '1889–1951', 'Tractatus; Investigaciones filosóficas.', L('curly', HB, { cs: 'coat', cl: '#4a5a6a', prop: 'duck' })],
      ['Frank P. Ramsey', '1903–1930', 'Oraciones de Ramsey; probabilidad subjetiva.', L('short', HD, { g: 1, fat: 1 })],
      ['L. Susan Stebbing', '1885–1943', 'A Modern Introduction to Logic; pensar con claridad.', L('bob', HG, { f: 1, prop: 'book' })],
      ['C. D. Broad', '1887–1971', 'Emergentismo: The Mind and its Place in Nature.', L('part', HG, { b: 3 })]
    ] },
    { g: 'Lógica matemática', d: 'Fundamentos, computabilidad y teoría de modelos.', c: '#8fd3ff', who: [
      ['David Hilbert', '1862–1943', 'Programa formalista; axiomática de la geometría.', L('hat', HG, { b: 1, g: 1, hat: '#e8dcb0', prop: 'square' })],
      ['Ernst Zermelo', '1871–1953', 'Axiomas de la teoría de conjuntos; axioma de elección.', L('part', HB, { b: 3 })],
      ['L. E. J. Brouwer', '1881–1966', 'Intuicionismo; teorema del punto fijo.', L('short', HG)],
      ['Thoralf Skolem', '1887–1963', 'Teorema de Löwenheim–Skolem.', L('part', HL, { g: 1 })],
      ['Abraham Fraenkel', '1891–1965', 'La teoría de conjuntos ZF.', L('short', HD, { b: 2, g: 1 })],
      ['Paul Bernays', '1888–1977', 'Grundlagen der Mathematik; teoría de clases.', L('bald', HG, { g: 1 })],
      ['Emil Post', '1897–1954', 'Completitud proposicional; problema de correspondencia.', L('short', HD, { g: 1 })],
      ['Arend Heyting', '1898–1980', 'Formalización de la lógica intuicionista.', L('part', HB)],
      ['Haskell B. Curry', '1900–1982', 'Lógica combinatoria; correspondencia de Curry–Howard.', L('short', HL)],
      ['Kurt Gödel', '1906–1978', 'Teoremas de incompletitud; completitud de primer orden.', L('part', HK, { g: 1, cs: 'coat', cl: '#3a3a4a', prop: 'book' })],
      ['Alonzo Church', '1903–1995', 'Cálculo lambda; indecidibilidad de la lógica de primer orden.', L('part', HB, { g: 1, fat: 1 })],
      ['Jacques Herbrand', '1908–1931', 'Teorema de Herbrand.', L('short', HD)],
      ['Gerhard Gentzen', '1909–1945', 'Deducción natural y cálculo de secuentes.', L('part', HD)],
      ['Stephen C. Kleene', '1909–1994', 'Teoría de la recursión; lógica trivalente fuerte.', L('short', HB, { g: 1 })],
      ['Alan Turing', '1912–1954', 'La máquina de Turing y el problema de la decisión.', L('short', HK, { cs: 'track', cl: '#2a6a8a', prop: 'abacus' })],
      ['Abraham Robinson', '1918–1974', 'Análisis no estándar; teoría de modelos.', L('bald', HD, { g: 1 })],
      ['Julia Robinson', '1919–1985', 'El décimo problema de Hilbert.', L('bob', HD, { f: 1 })],
      ['Hao Wang', '1921–1995', 'Demostración automática; conversaciones con Gödel.', L('short', HK, { sk: SKN.b, g: 1 })],
      ['Paul J. Cohen', '1934–2007', 'Forcing: independencia de la hipótesis del continuo.', L('short', HD)]
    ] },
    { g: 'Escuela de Lwów–Varsovia', d: 'La lógica polaca: rigor, claridad y ontología.', c: '#ff8a7a', who: [
      ['Kazimierz Twardowski', '1866–1938', 'Contenido y objeto de las representaciones.', L('part', HG, { b: 2 })],
      ['Jan Łukasiewicz', '1878–1956', 'Lógica trivalente; notación polaca.', L('bald', HG, { g: 1 })],
      ['Stanisław Leśniewski', '1886–1939', 'Mereología, prototética y ontología.', C('lesniewski')],
      ['Tadeusz Kotarbiński', '1886–1981', 'Reísmo: solo hay cosas.', L('part', HW, { b: 3 })],
      ['Kazimierz Ajdukiewicz', '1890–1963', 'Gramática categorial; convencionalismo radical.', L('short', HB, { g: 1 })],
      ['Alfred Tarski', '1901–1983', 'Definición semántica de la verdad; consecuencia lógica.', L('bald', HD, { b: 3, prop: 'pointer' })],
      ['Józef M. Bocheński', '1902–1995', 'Historia de la lógica formal.', L('bald', HG, { cs: 'robe', cl: '#f4f4fa' })]
    ] },
    { g: 'Círculo de Viena y Berlín', d: 'Empirismo lógico: la ciencia unificada y el análisis del lenguaje.', c: '#9be37a', who: [
      ['Moritz Schlick', '1882–1936', 'Fundador del Círculo de Viena.', L('part', HB)],
      ['Otto Neurath', '1882–1945', 'El barco de Neurath; enunciados protocolares.', L('bald', HR, { b: 2, fat: 1, prop: 'anchor' })],
      ['Rudolf Carnap', '1891–1970', 'La construcción lógica del mundo; marcos lingüísticos.', C('carnap')],
      ['Hans Reichenbach', '1891–1953', 'Probabilidad frecuencial; espacio y tiempo.', L('part', HG, { prop: 'hourglass' })],
      ['Kurt Grelling', '1886–1942', 'La paradoja heterológica (Grelling–Nelson).', L('short', HB, { g: 1 })],
      ['Friedrich Waismann', '1896–1959', 'La textura abierta de los conceptos.', L('part', HD)],
      ['Herbert Feigl', '1902–1988', 'Identidad mente-cerebro.', L('short', HG, { g: 1 })],
      ['Carl G. Hempel', '1905–1997', 'Paradoja de los cuervos; explicación nomológico-deductiva.', L('part', HW)],
      ['Karl Popper', '1902–1994', 'Falsacionismo: La lógica de la investigación científica.', L('bald', HW)],
      ['A. J. Ayer', '1910–1989', 'Lenguaje, verdad y lógica.', L('part', HD, { cs: 'coat', cl: '#3a3566' })]
    ] },
    { g: 'Oxford y Cambridge', d: 'Lenguaje ordinario, lógica filosófica y ética analítica.', c: '#c3bdf5', who: [
      ['Gilbert Ryle', '1900–1976', 'El concepto de lo mental: el «fantasma en la máquina».', L('bald', HG)],
      ['J. L. Austin', '1911–1960', 'Actos de habla: Cómo hacer cosas con palabras.', L('bald', HD)],
      ['H. P. Grice', '1913–1988', 'Implicaturas y máximas conversacionales.', L('short', HG)],
      ['Arthur N. Prior', '1914–1969', 'Lógica temporal.', L('short', HB, { b: 2, prop: 'hourglass' })],
      ['Peter Geach', '1916–2013', 'Identidad relativa; Reference and Generality.', L('bald', HW, { b: 2 })],
      ['J. L. Mackie', '1917–1981', 'La condición INUS; la teoría del error moral.', L('part', HD, { g: 1 })],
      ['G. E. M. Anscombe', '1919–2001', 'Intención; «La filosofía moral moderna».', L('bob', HB, { f: 1, cs: 'coat', cl: '#4a3a2a' })],
      ['P. F. Strawson', '1919–2006', 'Individuos; «Sobre el referir».', L('part', HG)],
      ['R. M. Hare', '1919–2002', 'Prescriptivismo universal.', L('short', HG, { g: 1 })],
      ['Iris Murdoch', '1919–1999', 'La soberanía del bien.', L('bob', HY, { f: 1 })],
      ['Philippa Foot', '1920–2010', 'El dilema del tranvía; naturalismo ético.', L('long', HG, { f: 1 })],
      ['Michael Dummett', '1925–2011', 'Antirrealismo semántico; la filosofía del lenguaje de Frege.', L('bald', HW, { b: 2 })],
      ['Bernard Williams', '1929–2003', 'Suerte moral; identidad personal.', L('part', HD)],
      ['Derek Parfit', '1942–2017', 'Razones y personas: la fisión y lo que importa.', L('wild', HW)],
      ['Gareth Evans', '1946–1980', 'Las variedades de la referencia.', L('curly', HD)]
    ] },
    { g: 'Norteamérica', d: 'Lógica modal, metafísica y filosofía del lenguaje y de la mente.', c: '#ffb0e0', who: [
      ['C. I. Lewis', '1883–1964', 'Implicación estricta; los sistemas modales S1–S5.', L('bald', HG, { b: 3 })],
      ['Nelson Goodman', '1906–1998', 'El nuevo enigma de la inducción («verdul»).', L('bald', HD, { prop: 'palette' })],
      ['W. V. O. Quine', '1908–2000', '«Dos dogmas del empirismo»; «Acerca de lo que hay».', L('bald', HW, { prop: 'razor' })],
      ['Max Black', '1909–1988', 'Las dos esferas: identidad de los indiscernibles.', L('part', HG, { g: 1 })],
      ['Wilfrid Sellars', '1912–1989', 'El mito de lo dado; imagen manifiesta y científica.', L('bald', HG, { g: 1 })],
      ['Roderick Chisholm', '1916–1999', 'Causalidad del agente; teoría del conocimiento.', L('part', HG)],
      ['Donald Davidson', '1917–2003', 'Monismo anómalo; semántica veritativa.', L('short', HW)],
      ['John Rawls', '1921–2002', 'Teoría de la justicia: el velo de ignorancia.', L('part', HL)],
      ['Ruth Barcan Marcus', '1921–2012', 'La fórmula de Barcan; lógica modal cuantificada.', L('bob', HD, { f: 1, prop: 'book' })],
      ['Hilary Putnam', '1926–2016', 'Tierra Gemela; el argumento de indispensabilidad.', L('bald', HW, { b: 2 })],
      ['Edmund Gettier', '1927–2021', 'Los casos de Gettier.', L('short', HG)],
      ['Jaakko Hintikka', '1929–2015', 'Lógica epistémica; semántica de juegos.', L('part', HY)],
      ['Richard Montague', '1930–1971', 'Gramática de Montague.', L('part', HD, { g: 1 })],
      ['John Searle', '1932–2025', 'La habitación china; actos de habla.', L('part', HG)],
      ['David Kaplan', 'n. 1933', 'La lógica de los demostrativos.', L('short', HW, { b: 2 })],
      ['Jerry Fodor', '1935–2017', 'El lenguaje del pensamiento.', L('short', HG, { b: 2, g: 1 })],
      ['Robert Nozick', '1938–2002', 'Anarquía, Estado y utopía; la máquina de experiencias.', L('curly', HD)],
      ['Saul Kripke', '1940–2022', 'El nombrar y la necesidad: designadores rígidos.', L('short', HD, { b: 2, g: 1, prop: 'book' })],
      ['David Lewis', '1941–2001', 'Realismo modal; superveniencia humeana.', C('lewis')]
    ] },
    { g: 'Australia', d: 'Materialismo australiano: mente, universales y leyes.', c: '#ffd27a', who: [
      ['J. J. C. Smart', '1920–2012', 'Teoría de la identidad; el universo en bloque.', L('bald', HG)],
      ['U. T. Place', '1924–2000', '«¿Es la conciencia un proceso cerebral?»', L('part', HB)],
      ['D. M. Armstrong', '1926–2014', 'Universales inmanentes y estados de cosas.', L('bald', HG, { prop: 'map' })]
    ] }
  ];

  /* desfile: cada grupo entra con su estandarte (hueco) y luego su gente */
  var ITEMS = [], PEOPLE = [];
  GROUPS.forEach(function (gr, gi) {
    ITEMS.push({ flag: 1, gi: gi });
    gr.who.forEach(function (w) { var it = { gi: gi, n: w[0], y: w[1], a: w[2], p: w[3], k: PEOPLE.length }; ITEMS.push(it); PEOPLE.push(it); });
  });
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  var sprites = null;
  function buildSprites() {
    if (sprites) return sprites;
    sprites = PEOPLE.map(function (it, i) {
      var a = GFX.cv(60, 76), b = GFX.cv(60, 76), c = GFX.cv(48, 48);
      try {
        GFX.drawFigure(a, 'adios' + i, it.p, 'neutral');
        GFX.drawFigure(b, 'adios' + i, it.p, 'alegre');
        GFX.drawPortrait(c, 'adios' + i, it.p, 'alegre');
      } catch (e) { console.warn('figura', it.n, e); }
      return { walk: a, glad: b, por: c };
    });
    sprites.ousia = GFX.cv(48, 48);
    try { GFX.drawPortrait(sprites.ousia, 'ousia', CH.ousia.p, 'alegre'); } catch (e) { /* sin Ousía */ }
    return sprites;
  }

  /* ---------- la despedida ---------- */
  var open = null;
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  function farewell(opts) {
    if (open) return open.done;
    opts = opts || {};
    var m = mem(); m.seen++; if (opts.fin) m.fin = 1; if (opts.code) m.code++; memSave(m);
    var S = window.MA.save ? window.MA.save() : { name: '' };
    var name = (S && S.name) || '';
    var prevSong = window.MA.song ? window.MA.song() : null;
    var prevLegend = legendEl ? legendEl.innerHTML : '';
    buildSprites();
    try { AU.play('adios'); } catch (e) { /* sin audio */ }

    var root = document.createElement('div');
    root.className = 'adios';
    root.innerHTML = '<canvas width="240" height="160"></canvas>' +
      '<div class="cap" hidden><div class="grp"></div><div class="nm"></div><div class="yr"></div><div class="ap"></div></div>' +
      '<div class="msg"></div><div class="hint"><b>A</b> ▶▶ · <b>B</b> saltar</div>';
    stage.appendChild(root);
    if (legendEl) legendEl.innerHTML = '<b>A</b> acelerar · <b>B</b> saltar · <b>START</b> salir';
    var cv = root.querySelector('canvas'), g = cv.getContext('2d');
    var cap = root.querySelector('.cap'), msg = root.querySelector('.msg'), hint = root.querySelector('.hint');
    var capG = cap.querySelector('.grp'), capN = cap.querySelector('.nm'), capY = cap.querySelector('.yr'), capA = cap.querySelector('.ap');

    var W = 240, H = 160, bg = null, stars = [];
    var SP = 46, V = 30, INTRO = 5.2;
    var phase = 'intro', t = 0, tp = 0, speed = 1, last = performance.now(), featured = -2, tOut = 0, raf = 0, outroReady = false;
    var resolveDone; var done = new Promise(function (r) { resolveDone = r; });

    function setMsg(html) { msg.innerHTML = html; msg.classList.remove('pop'); void msg.offsetWidth; msg.classList.add('pop'); }
    setMsg('<i>GRACIAS POR JUGAR' + (name ? ', ' + esc(name).toUpperCase() : '') + '</i>' +
      '<b>DESPEDIDA</b><span>Desfilan quienes hicieron de la lógica un oficio: lógicos y filósofos analíticos del siglo XX.</span>');

    function layout() {
      var tall = stage.classList.contains('tall');
      var w = tall ? 160 : 240, h = tall ? 240 : 160;
      if (w === W && h === H && bg) return;
      W = w; H = h; cv.width = W; cv.height = H; bg = GFX.cv(W, H);
      var b = bg.getContext('2d'), gr = b.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, '#0b0a1a'); gr.addColorStop(.6, '#2a2160'); gr.addColorStop(1, '#3a2f7a');
      b.fillStyle = gr; b.fillRect(0, 0, W, H);
      stars = [];
      for (var i = 0; i < W * H / 260; i++) stars.push([Math.floor(Math.random() * W), Math.floor(Math.random() * (H - 40)), Math.random() * 6.28]);
      /* ágora lejana */
      var base = H - 22, col = '#241f4a';
      b.fillStyle = col;
      var cx = W / 2, wd = Math.min(W - 20, 180);
      b.fillRect(cx - wd / 2, base - 6, wd, 6);
      for (var x = cx - wd / 2 + 6; x < cx + wd / 2 - 6; x += 22) b.fillRect(Math.round(x), base - 46, 8, 40);
      b.beginPath(); b.moveTo(cx - wd / 2 - 4, base - 46); b.lineTo(cx, base - 64); b.lineTo(cx + wd / 2 + 4, base - 46); b.fill();
      /* suelo */
      b.fillStyle = '#2b2850'; b.fillRect(0, H - 16, W, 16);
      b.fillStyle = '#4a4290'; b.fillRect(0, H - 16, W, 1);
      b.fillStyle = '#15132e'; for (var k = 0; k < W; k += 12) b.fillRect(k, H - 9, 6, 1);
    }

    function drawBase(now) {
      g.imageSmoothingEnabled = false;
      g.drawImage(bg, 0, 0);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i], a = .35 + .65 * Math.abs(Math.sin(now / 900 + s[2]));
        g.fillStyle = 'rgba(255,244,214,' + a.toFixed(2) + ')'; g.fillRect(s[0], s[1], 1, 1);
      }
    }
    function spotlight() {
      var cx = W / 2, fy = H - 14;
      g.fillStyle = 'rgba(255,230,150,.09)';
      g.beginPath(); g.moveTo(cx - 6, 0); g.lineTo(cx + 6, 0); g.lineTo(cx + 30, fy); g.lineTo(cx - 30, fy); g.fill();
      g.fillStyle = 'rgba(255,207,46,.28)';
      g.beginPath(); g.ellipse(cx, fy, 26, 4, 0, 0, 6.283); g.fill();
    }
    function itemX(i) { return W / 2 + 26 + i * SP - V * tp; }

    function showCaption(i) {
      if (i === featured) return;
      featured = i;
      if (i < 0) { cap.hidden = true; return; }
      var it = ITEMS[i], gr = GROUPS[it.gi];
      cap.hidden = false;
      cap.style.setProperty('--gc', gr.c);
      if (it.flag) {
        capG.textContent = ROMAN[it.gi] + ' de ' + ROMAN[GROUPS.length - 1];
        capN.textContent = gr.g; capY.textContent = gr.who.length + ' figuras'; capA.textContent = gr.d;
      } else {
        capG.textContent = ROMAN[it.gi] + ' · ' + gr.g;
        capN.textContent = it.n; capY.textContent = it.y; capA.textContent = it.a;
      }
      cap.classList.remove('pop'); void cap.offsetWidth; cap.classList.add('pop');
      if (!it.flag && AU.sfx && AU.sfx.tick) AU.sfx.tick();
    }

    function drawParade(now) {
      spotlight();
      var fy = H - 14, best = -1, bd = 1e9;
      for (var i = 0; i < ITEMS.length; i++) {
        var x = itemX(i);
        if (x < -40 || x > W + 40) continue;
        var d = Math.abs(x - W / 2);
        if (d < bd) { bd = d; best = i; }
        var it = ITEMS[i], gr = GROUPS[it.gi];
        if (it.flag) {
          var px = Math.round(x);
          g.fillStyle = '#8a6a4a'; g.fillRect(px, fy - 58, 2, 58);
          g.fillStyle = gr.c; g.fillRect(px + 2, fy - 58, 24, 14);
          g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(px + 2, fy - 46, 24, 2);
          g.fillStyle = '#1d1438'; g.font = '8px "Press Start 2P", monospace'; g.textBaseline = 'top';
          g.fillText(ROMAN[it.gi], px + 6, fy - 55);
          continue;
        }
        var spr = sprites[it.k], here = d < SP / 2;
        var bob = here ? 0 : Math.round(Math.abs(Math.sin(now / 130 + i)) * 2);
        g.drawImage(here ? spr.glad : spr.walk, Math.round(x - 30), fy - 74 - bob);
      }
      showCaption(bd < SP / 2 ? best : -1);
      return itemX(ITEMS.length - 1) < -40;
    }

    var outroStart = 0;
    function drawOutro(now) {
      var tall = H > W, cell = tall ? 15 : 16, cols = tall ? 10 : Math.max(6, Math.floor((W - 12) / cell)), rows = Math.ceil(PEOPLE.length / cols);
      var x0 = Math.round((W - cols * cell) / 2), y0 = H - rows * cell - 8;
      g.fillStyle = 'rgba(11,10,26,.55)'; g.fillRect(0, 0, W, H);
      g.imageSmoothingEnabled = true;
      var shown = Math.min(PEOPLE.length, Math.floor((tOut) / .035));
      for (var i = 0; i < shown; i++) {
        var cx = x0 + (i % cols) * cell, cy = y0 + Math.floor(i / cols) * cell;
        g.fillStyle = GROUPS[PEOPLE[i].gi].c; g.globalAlpha = .35; g.fillRect(cx, cy, cell - 1, cell - 1); g.globalAlpha = 1;
        g.drawImage(sprites[i].por, cx, cy, cell - 1, cell - 1);
      }
      g.imageSmoothingEnabled = false;
      if (shown >= PEOPLE.length) {
        var oy = Math.round(Math.sin(now / 400) * 2);
        g.drawImage(sprites.ousia, W - 38, y0 - 36 + oy, 32, 32);
        if (!outroReady) { outroReady = true; hint.innerHTML = '<b>A</b> volver al juego'; if (AU.sfx && AU.sfx.rank) AU.sfx.rank(); }
      }
    }

    function startOutro() {
      if (phase === 'outro') return;
      phase = 'outro'; tOut = 0; cap.hidden = true; speed = 1; hint.classList.remove('fast');
      var mm = mem();
      setMsg('<b>FIN</b><i>Gracias por jugar METAFÍSICA ADVANCE</i><span>Las preguntas no se acaban. · Despedidas vistas: ' + mm.seen + '</span>');
      msg.classList.remove('gone'); msg.classList.add('top');
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(.1, (now - last) / 1000); last = now;
      layout();
      t += dt * speed;
      drawBase(now);
      if (phase === 'intro') {
        if (t > INTRO) { phase = 'parade'; msg.classList.add('gone'); }
        drawParade(now); showCaption(-1);
        g.fillStyle = 'rgba(11,10,26,.6)'; g.fillRect(0, 0, W, H);
      } else if (phase === 'parade') {
        tp += dt * speed;
        if (drawParade(now)) startOutro();
      } else {
        tOut += dt;
        drawOutro(now);
      }
    }
    raf = requestAnimationFrame(frame);

    function close() {
      if (!open) return;
      cancelAnimationFrame(raf);
      root.remove();
      if (legendEl) legendEl.innerHTML = prevLegend;
      try { if (prevSong) AU.play(prevSong); } catch (e) { /* sin audio */ }
      open = null;
      resolveDone();
    }
    function onButton(b) {
      if (b === 'start') { close(); return; }
      if (phase === 'outro') { if ((b === 'A' && outroReady) || b === 'B') close(); return; }
      if (b === 'A') { speed = speed === 1 ? 4 : 1; hint.classList.toggle('fast', speed > 1); }
      else if (b === 'B') startOutro();
    }
    root.addEventListener('click', function (e) { e.stopPropagation(); onButton('A'); });
    open = { done: done, onButton: onButton, close: close };
    return done;
  }

  /* ---------- código secreto ← → ← → A B A B ← ---------- */
  var CODE = ['left', 'right', 'left', 'right', 'A', 'B', 'A', 'B', 'left'];
  var buf = [], lastT = 0;
  window.MA_HOOK = function (b) {
    if (open) { open.onButton(b); return true; }
    var now = Date.now();
    if (now - lastT > 3000) buf = [];
    lastT = now;
    buf.push(b); if (buf.length > CODE.length) buf.shift();
    if (buf.length === CODE.length && buf.every(function (x, i) { return x === CODE[i]; })) {
      buf = [];
      try { if (AU.sfx && AU.sfx.neu) AU.sfx.neu(); } catch (e) { /* sin audio */ }
      farewell({ code: true });
      return true;
    }
    return false;
  };
  window.MA_FAREWELL = farewell;

  /* ---------- integración con Android ---------- */
  function persist() { try { if (window.MA.persist) window.MA.persist(); } catch (e) { /* nada */ } }
  document.addEventListener('visibilitychange', function () { if (document.hidden) persist(); });
  window.addEventListener('pagehide', persist);

  var Cap = window.Capacitor;
  var App = Cap && Cap.isNativePlatform && Cap.isNativePlatform() && Cap.Plugins ? Cap.Plugins.App : null;
  if (App) {
    var lastBack = 0;
    App.addListener('pause', persist);
    App.addListener('backButton', function () {
      if (open) { open.onButton('B'); return; }
      var mode = window.MA.mode ? window.MA.mode() : '';
      var now = Date.now();
      if (mode === 'title') {
        if (now - lastBack < 1600) { persist(); App.exitApp(); return; }
        lastBack = now;
        var tip = document.createElement('div'); tip.className = 'adios-toast'; tip.textContent = 'Pulsa «atrás» otra vez para salir';
        stage.appendChild(tip); setTimeout(function () { tip.remove(); }, 1500);
        return;
      }
      /* en el juego, «atrás» es el botón B de la consola */
      window.MA.down('B'); setTimeout(function () { window.MA.up('B'); }, 60);
    });
  }
})();
