(() => {
  const STORAGE_KEY = "disc-test-v1";
  const N = ITEMS.length;
  const $ = (id) => document.getElementById(id);

  const store = {
    get() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; } },
    set(v) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {} },
    clear() { try { localStorage.removeItem(STORAGE_KEY); } catch {} },
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Ordem dos blocos e das opções é embaralhada uma vez por tentativa,
  // para que a posição na tela não revele o fator.
  const newState = () => ({
    order: shuffle([...Array(N).keys()]),
    optOrder: ITEMS.map(() => shuffle(FACTORS)),
    answers: Array(N).fill(null).map(() => ({ m: null, l: null })),
    pos: 0,
  });

  let state = null;
  const charts = [];

  // ---------- Tema ----------
  const root = document.documentElement;
  try { const t = localStorage.getItem("disc-theme"); if (t) root.dataset.theme = t; } catch {}
  $("theme-toggle").addEventListener("click", () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("disc-theme", root.dataset.theme); } catch {}
    if (!$("result").classList.contains("hidden")) renderCharts(lastResult);
  });

  // ---------- Navegação ----------
  const show = (id) => {
    ["intro", "quiz", "result"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
    document.body.classList.toggle("quizzing", id === "quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- Quiz ----------
  function renderBlock() {
    const idx = state.order[state.pos];
    const item = ITEMS[idx];
    const ans = state.answers[idx];
    $("progress-label").textContent = `Bloco ${state.pos + 1} de ${N}`;
    const done = state.answers.filter((a) => a.m && a.l).length;
    const pct = Math.round((done / N) * 100);
    $("progress-pct").textContent = `${pct}%`;
    $("progress-bar").style.width = `${pct}%`;
    $("quiz-error").classList.add("hidden");

    const box = $("options");
    box.innerHTML = "";
    state.optOrder[idx].forEach((f) => {
      const row = document.createElement("div");
      row.className = "opt" + (ans.m === f ? " is-most" : "") + (ans.l === f ? " is-least" : "");
      const id = `b${idx}-${f}`;
      row.innerHTML = `
        <span class="opt-label">${item[f]}</span>
        <span class="pick most"><input type="radio" name="most" id="${id}-m" value="${f}" ${ans.m === f ? "checked" : ""}><label for="${id}-m" title="Mais parecido" aria-label="Mais parecido: ${item[f]}">+</label></span>
        <span class="pick least"><input type="radio" name="least" id="${id}-l" value="${f}" ${ans.l === f ? "checked" : ""}><label for="${id}-l" title="Menos parecido" aria-label="Menos parecido: ${item[f]}">−</label></span>`;
      box.appendChild(row);
    });

    box.querySelectorAll("input").forEach((inp) => inp.addEventListener("change", () => {
      const f = inp.value;
      if (inp.name === "most") { ans.m = f; if (ans.l === f) ans.l = null; }
      else { ans.l = f; if (ans.m === f) ans.m = null; }
      store.set(state);
      renderBlock();
    }));

    $("prev").disabled = state.pos === 0;
    $("next").disabled = !(ans.m && ans.l);
    $("next").textContent = state.pos === N - 1 ? "Ver resultado" : "Próximo →";
  }

  $("start").addEventListener("click", () => {
    state = newState();
    store.set(state);
    show("quiz");
    renderBlock();
  });
  $("resume").addEventListener("click", () => { show("quiz"); renderBlock(); });
  $("prev").addEventListener("click", () => { if (state.pos > 0) { state.pos--; store.set(state); renderBlock(); } });
  $("next").addEventListener("click", () => {
    const ans = state.answers[state.order[state.pos]];
    if (!(ans.m && ans.l)) { $("quiz-error").classList.remove("hidden"); return; }
    if (state.pos < N - 1) { state.pos++; store.set(state); renderBlock(); return; }
    const missing = state.answers.findIndex((a) => !(a.m && a.l));
    if (missing >= 0) { state.pos = state.order.indexOf(missing); renderBlock(); return; }
    state.finished = true;
    store.set(state);
    location.hash = "r=" + encode(state.answers);
    showResult(state.answers);
  });

  // ---------- Codificação para link compartilhável ----------
  const encode = (answers) => answers.map((a) => a.m + a.l).join("");
  const decode = (s) => {
    if (typeof s !== "string" || s.length !== N * 2 || !/^[DISC]+$/.test(s)) return null;
    const out = [];
    for (let i = 0; i < N; i++) {
      const m = s[2 * i], l = s[2 * i + 1];
      if (m === l) return null;
      out.push({ m, l });
    }
    return out;
  };

  // ---------- Pontuação ----------
  function score(answers) {
    const M = { D: 0, I: 0, S: 0, C: 0 }, L = { D: 0, I: 0, S: 0, C: 0 };
    answers.forEach((a) => { M[a.m]++; L[a.l]++; });
    const diff = {}, pct = {};
    FACTORS.forEach((f) => {
      diff[f] = M[f] - L[f];
      pct[f] = Math.round(((diff[f] + N) / (2 * N)) * 100);
    });
    const ranked = FACTORS.slice().sort((a, b) => pct[b] - pct[a] || M[b] - M[a]);
    const [p, s] = ranked;
    let key = p, diagonal = null;
    if (pct[s] > 50 && pct[p] - pct[s] <= 15) {
      const pair = [p, s].sort().join("");
      if (pair === "DS" || pair === "CI") diagonal = pair === "DS" ? "DS" : "IC";
      else key = p + s;
    }
    return { M, L, diff, pct, ranked, primary: p, key, diagonal };
  }

  const level = (v) =>
    v >= 75 ? "Muito alto" : v >= 60 ? "Alto" : v > 50 ? "Moderado" : v === 50 ? "Na média" : v >= 40 ? "Abaixo da média" : v >= 25 ? "Baixo" : "Muito baixo";

  // ---------- Resultado ----------
  let lastResult = null;

  function showResult(answers) {
    const r = score(answers);
    lastResult = r;
    const pat = PATTERNS[r.key];
    const styleLabel = r.key.length === 2 ? `Estilo ${r.key[0]}${r.key[1].toLowerCase()}` : `Estilo ${r.key}`;
    $("r-title").textContent = pat.title;
    $("r-style").textContent = `${styleLabel} · ${r.key.split("").map((f) => FACTOR_INFO[f].name).join(" + ")}`;
    $("r-text").textContent = pat.text;
    $("r-team").textContent = pat.team;
    const diag = $("r-diagonal");
    diag.classList.toggle("hidden", !r.diagonal);
    if (r.diagonal) diag.textContent = DIAGONAL_NOTE[r.diagonal];

    $("score-row").innerHTML = FACTORS.map((f) => `
      <div class="score" style="--fc:${FACTOR_INFO[f].color}">
        <div class="letter">${f} · ${FACTOR_INFO[f].name}</div>
        <div class="num">${r.pct[f]}</div>
        <div class="lvl">${level(r.pct[f])}</div>
        <div class="bar"><i style="width:${r.pct[f]}%"></i></div>
      </div>`).join("");

    const list = (arr) => `<ul class="bullets">${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    $("factor-details").innerHTML = r.ranked.map((f) => {
      const info = FACTOR_INFO[f];
      const v = r.pct[f];
      const high = v > 50;
      const body = high ? `
        <p>${info.summary}</p>
        <div class="cols">
          <div><h3>Pontos fortes</h3>${list(info.strengths)}</div>
          <div><h3>Pontos de atenção</h3>${list(info.watch)}</div>
          <div><h3>O que te motiva</h3>${list(info.motivators)}</div>
          <div><h3>Como se comunicar com você</h3>${list(info.communicate)}</div>
        </div>
        <p class="kv"><b>Medos típicos:</b> ${info.fears}</p>
        <p class="kv"><b>Sob pressão:</b> ${info.pressure}</p>
        <p class="kv"><b>Ambiente ideal:</b> ${info.environment}</p>
        <h3>Para se desenvolver</h3>${list(info.develop)}` : `
        <p>${LOW_INFO[f]}</p>
        <details><summary>Ver a descrição completa do fator ${f}</summary>
          <p>${info.summary}</p>
          <div class="cols">
            <div><h3>Quem tem ${f} alto costuma...</h3>${list(info.strengths)}</div>
            <div><h3>Como se comunicar com perfis ${f}</h3>${list(info.communicate)}</div>
          </div>
        </details>`;
      return `
        <article class="card factor-detail" style="--fc:${info.color}">
          <header>
            <h2><b>${f}</b> · ${info.name} — ${v}</h2>
            <span class="badge">${level(v)}</span>
          </header>
          <p class="muted">${info.question}. Escolhido ${r.M[f]}× como “Mais” e ${r.L[f]}× como “Menos”.</p>
          ${body}
        </article>`;
    }).join("");

    show("result");
    renderCharts(r);
  }

  // ---------- Gráficos ----------
  function css(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }

  function renderCharts(r) {
    if (typeof Chart === "undefined") return;
    charts.splice(0).forEach((c) => c.destroy());
    const text = css("--text"), muted = css("--muted"), border = css("--border");
    const colors = FACTORS.map((f) => FACTOR_INFO[f].color);
    Chart.defaults.font.family = "Inter, system-ui, sans-serif";
    Chart.defaults.color = muted;
    const grid = { color: border };
    const labels = FACTORS.map((f) => `${f} · ${FACTOR_INFO[f].name}`);

    const midline = {
      id: "midline",
      afterDraw(chart) {
        const y = chart.scales.y.getPixelForValue(50);
        const { ctx, chartArea: a } = chart;
        ctx.save();
        ctx.strokeStyle = muted; ctx.setLineDash([5, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke();
        ctx.restore();
      },
    };

    charts.push(new Chart($("chart-profile"), {
      type: "bar",
      data: { labels: FACTORS, datasets: [{ data: FACTORS.map((f) => r.pct[f]), backgroundColor: colors, borderRadius: 6, maxBarThickness: 64 }] },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { title: (i) => labels[i[0].dataIndex], label: (i) => ` ${i.raw} — ${level(i.raw)}` } } },
        scales: { y: { min: 0, max: 100, ticks: { stepSize: 25 }, grid }, x: { grid: { display: false }, ticks: { color: text, font: { weight: 700, size: 14 } } } },
      },
      plugins: [midline],
    }));

    // Modelo circular: x = foco (tarefas ← → pessoas), y = ritmo (ponderado ↓ ↑ ativo)
    const x = (r.pct.I + r.pct.S - r.pct.D - r.pct.C) / 2;
    const y = (r.pct.D + r.pct.I - r.pct.S - r.pct.C) / 2;
    const quadrants = {
      id: "quadrants",
      beforeDatasetsDraw(chart) {
        const { ctx, chartArea: a, scales: { x: sx, y: sy } } = chart;
        const cx = sx.getPixelForValue(0), cy = sy.getPixelForValue(0);
        const q = [
          ["D", a.left, a.top, cx - a.left, cy - a.top],
          ["I", cx, a.top, a.right - cx, cy - a.top],
          ["C", a.left, cy, cx - a.left, a.bottom - cy],
          ["S", cx, cy, a.right - cx, a.bottom - cy],
        ];
        ctx.save();
        q.forEach(([f, qx, qy, w, h]) => {
          ctx.fillStyle = FACTOR_INFO[f].color + "1f";
          ctx.fillRect(qx, qy, w, h);
          ctx.fillStyle = FACTOR_INFO[f].color;
          ctx.font = "800 28px Inter, sans-serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(f, qx + w / 2, qy + h / 2);
        });
        ctx.restore();
      },
    };
    charts.push(new Chart($("chart-map"), {
      type: "scatter",
      data: { datasets: [{ data: [{ x, y }], pointRadius: 9, pointHoverRadius: 11, backgroundColor: text, borderColor: css("--surface"), borderWidth: 3 }] },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: () => " Você" } } },
        scales: {
          x: { min: -100, max: 100, grid, ticks: { display: false }, title: { display: true, text: "← Tarefas · Pessoas →" } },
          y: { min: -100, max: 100, grid, ticks: { display: false }, title: { display: true, text: "← Ponderado · Ativo →" } },
        },
      },
      plugins: [quadrants],
    }));

    charts.push(new Chart($("chart-ml"), {
      type: "bar",
      data: {
        labels: FACTORS,
        datasets: [
          { label: "Mais", data: FACTORS.map((f) => r.M[f]), backgroundColor: css("--s"), borderRadius: 4 },
          { label: "Menos", data: FACTORS.map((f) => r.L[f]), backgroundColor: css("--d"), borderRadius: 4 },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        scales: { y: { beginAtZero: true, suggestedMax: 14, ticks: { precision: 0 }, grid }, x: { grid: { display: false }, ticks: { color: text, font: { weight: 700 } } } },
      },
    }));

    const total = FACTORS.reduce((s, f) => s + r.pct[f], 0) || 1;
    charts.push(new Chart($("chart-dist"), {
      type: "doughnut",
      data: { labels, datasets: [{ data: FACTORS.map((f) => r.pct[f]), backgroundColor: colors, borderColor: css("--surface"), borderWidth: 3 }] },
      options: {
        maintainAspectRatio: false, cutout: "58%",
        plugins: {
          legend: { position: "bottom" },
          tooltip: { callbacks: { label: (i) => ` ${Math.round((i.raw / total) * 100)}%` } },
        },
      },
    }));
  }

  // ---------- Ações do resultado ----------
  $("print").addEventListener("click", () => window.print());
  $("share").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(location.href); $("share-msg").textContent = "Link copiado. Quem abrir verá este mesmo resultado."; }
    catch { $("share-msg").textContent = "Copie o endereço da barra do navegador para compartilhar."; }
  });
  $("restart").addEventListener("click", () => {
    store.clear();
    history.replaceState(null, "", location.pathname);
    state = null;
    $("resume").classList.add("hidden");
    show("intro");
  });

  // ---------- Inicialização ----------
  const fromHash = decode(new URLSearchParams(location.hash.slice(1)).get("r"));
  const saved = store.get();
  if (fromHash) {
    showResult(fromHash);
  } else if (saved && saved.answers && saved.answers.length === N) {
    state = saved;
    if (saved.finished && saved.answers.every((a) => a.m && a.l)) {
      location.hash = "r=" + encode(saved.answers);
      showResult(saved.answers);
    } else if (saved.answers.some((a) => a.m || a.l)) {
      $("resume").classList.remove("hidden");
    }
  }
})();
