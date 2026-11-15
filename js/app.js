(() => {
  // יעד משרד הבריאות לנשים: כ-2.2 ליטר ביום
  const GOAL_ML = 2200;
  // כוס המים של לירן מכילה 800 מ״ל – כל רישום של מים = 800 מ״ל
  const WATER_CUP_ML = 800;
  const fmtL = (ml) => (ml / 1000).toFixed(1);

  // סוגי משקה – כל רישום = כוס אחת
  const DRINKS = [
    { key: "water", label: "מים" },
    { key: "soda", label: "סודה" },
    { key: "coffee", label: "קפה" },
    { key: "tea", label: "תה" },
    { key: "cola", label: "קולה" },
    { key: "juice", label: "מיץ" },
    { key: "other", label: "אחר" },
  ];
  const drinkLabel = (k) => (DRINKS.find((d) => d.key === k) || DRINKS[DRINKS.length - 1]).label;
  // רק מים (כולל סודה = מים מוגזים) ממלאים את הדמות ונספרים ליעד המים
  const WATER_KINDS = new Set(["water", "soda"]);
  const isWater = (e) => WATER_KINDS.has(e.drink);

  // כוסות מאוירות ומוגזמות לערימה (תא של 50×50 ביחידות viewBox)
  const INK = "#1d1033";
  const CUP_ART = {
    // קפה: ספל אדום עם עיניים פעורות מקפאין ואדים מטורפים
    coffee: `
      <path d="M15 11q-6-5 0-10t0-10M24 11q-6-5 0-10t0-10M33 11q-6-5 0-10t0-10" stroke="#c9bfd8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M40 22h4a9 9 0 0 1 0 18h-4" fill="none" stroke="#c94f38" stroke-width="5.5"/>
      <rect x="5" y="13" width="37" height="36" rx="9" fill="#e2603f"/>
      <ellipse cx="23.5" cy="14.5" rx="18.5" ry="4.5" fill="#5a3422"/>
      <circle cx="16" cy="28" r="7" fill="#fff"/><circle cx="31" cy="28" r="7" fill="#fff"/>
      <circle cx="17.5" cy="29.5" r="2.8" fill="${INK}"/><circle cx="29" cy="26.5" r="2.8" fill="${INK}"/>
      <path d="M14 39q9.5 7 19 0z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M17.5 39.5v3M21.5 40v4M25.5 40v4M29.5 39.5v3" stroke="${INK}" stroke-width="1.2"/>`,
    // תה: כוס ירוקה ישנונית על תחתית, עם תווית שקית ו-zZz
    tea: `
      <text x="36" y="6" font-size="11" font-weight="700" fill="#8a7f9c" font-family="sans-serif">z</text>
      <text x="43" y="-2" font-size="8" font-weight="700" fill="#8a7f9c" font-family="sans-serif">z</text>
      <ellipse cx="24" cy="47" rx="23" ry="4.5" fill="#e3dcf5"/>
      <path d="M40 25a8 8 0 0 1 0 14" stroke="#5fae8c" stroke-width="5" fill="none"/>
      <path d="M5 20h37l-3 17a11 11 0 0 1-11 9h-9a11 11 0 0 1-11-9z" fill="#74c7a5"/>
      <ellipse cx="23.5" cy="20" rx="18.5" ry="4" fill="#c88a3c"/>
      <path d="M12 30q3.5 3.5 7 0M27 30q3.5 3.5 7 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="11" cy="35" r="3" fill="#ff8fa3" opacity=".7"/><circle cx="36" cy="35" r="3" fill="#ff8fa3" opacity=".7"/>
      <path d="M20 37q3.5 2.5 7 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M33 20q7 9 5 19" stroke="#8a7f9c" stroke-width="1.2" fill="none"/>
      <rect x="34" y="37" width="9" height="9" rx="1.5" fill="#ffd166" transform="rotate(12 38.5 41.5)"/>`,
    // מיץ: כוס חגיגית עם קש מתעקל, פרוסת תפוז וחיוך ענק
    juice: `
      <path d="M33 -6l-4 12l-4 30" stroke="#ff5d73" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 10h36l-5 39h-26z" fill="#f3f6fb" stroke="#cfd8e6" stroke-width="2"/>
      <path d="M8 19h32l-4 29h-24z" fill="#ffa63d"/>
      <circle cx="42" cy="11" r="8" fill="#ffc15e" stroke="#ff8c1a" stroke-width="2.5"/>
      <path d="M42 3v16M34 11h16" stroke="#ff8c1a" stroke-width="1.2"/>
      <path d="M13 29l3.5-4l3.5 4M28 29l3.5-4l3.5 4" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 34q9 10 18 0z" fill="${INK}"/><path d="M20 38.5q4 3 8 0" fill="#ff6b8a"/>`,
    // קולה: כוס תוססת עם קרח, בועות מתפוצצות ועיניים היפראקטיביות
    cola: `
      <circle cx="12" cy="2" r="2.5" fill="none" stroke="#b9a48f" stroke-width="1.3"/>
      <circle cx="20" cy="-4" r="1.8" fill="none" stroke="#b9a48f" stroke-width="1.2"/>
      <circle cx="31" cy="0" r="3" fill="none" stroke="#b9a48f" stroke-width="1.3"/>
      <path d="M6 9h37l-5 40h-27z" fill="#f3f6fb" stroke="#cfd8e6" stroke-width="2"/>
      <path d="M7.5 15h34l-4.3 33h-25.4z" fill="#4a2316"/>
      <path d="M7 15q4-5 8 0t8 0t8 0t8 0t3.5 0l-.2 2h-35z" fill="#f2dcc0"/>
      <rect x="27" y="18" width="10" height="9" rx="2" fill="#dff3ff" opacity=".85" transform="rotate(-14 32 22.5)"/>
      <circle cx="16" cy="29" r="6.5" fill="#fff"/><circle cx="30" cy="31" r="5" fill="#fff"/>
      <circle cx="16" cy="27" r="2.6" fill="${INK}"/><circle cx="31" cy="29.5" r="2.2" fill="${INK}"/>
      <ellipse cx="23" cy="40.5" rx="4" ry="4.5" fill="${INK}"/>
      <circle cx="12" cy="44" r="1.4" fill="#f2dcc0" opacity=".8"/><circle cx="34" cy="42" r="1.2" fill="#f2dcc0" opacity=".8"/>`,
    // אחר: כוס חד-פעמית עם מכסה, קורצת ומוציאה לשון
    other: `
      <path d="M8 14h33l-5 35h-23z" fill="#b8a9e6"/>
      <rect x="4" y="8" width="41" height="8" rx="3.5" fill="#390a7b"/>
      <rect x="30" y="0" width="4" height="10" rx="2" fill="#390a7b"/>
      <circle cx="18" cy="28" r="3.2" fill="${INK}"/>
      <path d="M27 28h8" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M16 35q8.5 6 17 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M23 37.5q4 9 8 0" fill="#ff6b8a" stroke="${INK}" stroke-width="1.5"/>`,
  };


  const state = {
    date: new Date(),   // היום שנבחר
    period: "day",      // day | week | month
    editingId: null,    // רשומה בעריכה
  };
  let chartTimer = null; // אנימציית הגלים בגרף

  const el = {
    dateLabel: document.getElementById("date-label"),
    dateInput: document.getElementById("date-input"),
    period: document.getElementById("period"),
    drinkBtn: document.getElementById("drink-btn"),
    menu: document.getElementById("drink-menu"),
    options: document.getElementById("drink-options"),
    viz: d3.select("#viz"),
    water: document.getElementById("water"),
    level: document.getElementById("figure-level"),
    pile: d3.select("#cup-pile"),
    prev: document.getElementById("prev-btn"),
    next: document.getElementById("next-btn"),
  };

  const weekday = new Intl.DateTimeFormat("he-IL", { weekday: "long" });
  const timeFmt = d3.timeFormat("%H:%M");
  const pad = (n) => String(n).padStart(2, "0");
  const fmtShort = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;
  const toInputValue = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dayRange = (d) => {
    const start = d3.timeDay.floor(d);
    return [start, d3.timeDay.offset(start, 1)];
  };

  // טווח הזמן לפי חתך הזמן שנבחר (שבוע מתחיל ביום ראשון)
  function range() {
    const d = state.date;
    const interval = { week: d3.timeWeek, month: d3.timeMonth }[state.period] || d3.timeDay;
    const start = interval.floor(d);
    return [start, interval.offset(start, 1)];
  }

  function renderDate() {
    const d = state.date;
    el.dateLabel.textContent = `${weekday.format(d)}   ${fmtShort(d)}`;
    el.dateInput.value = toInputValue(d);
    const unit = STEP_NAME[state.period];
    el.prev.title = el.prev.ariaLabel = `${unit} קודם`;
    el.next.title = el.next.ariaLabel = `${unit} הבא`;
    // אין מעבר לעתיד
    const [, end] = range();
    el.next.disabled = end > d3.timeDay.floor(new Date()); // התקופה המוצגת כבר כוללת את היום
  }

  // חצים: יום אחורה / קדימה (בתצוגת שבוע / חודש – שבוע / חודש שלם)
  const STEP_NAME = { day: "יום", week: "שבוע", month: "חודש" };
  function step(dir) {
    const interval = { week: d3.timeWeek, month: d3.timeMonth }[state.period] || d3.timeDay;
    let next = interval.offset(state.date, dir);
    const today = new Date();
    if (next > today) next = today;
    state.date = next;
    state.editingId = null;
    render();
  }

  // ---------- תצוגה יומית: התקדמות + רשומות ----------
  function renderDay() {
    const events = DrinkStore.between(...dayRange(state.date));
    const cups = events.filter(isWater).length;
    const others = events.length - cups;
    const ml = cups * WATER_CUP_ML;
    const ratio = ml / GOAL_ML;
    const pct = Math.min(ratio, 1);
    const isToday = d3.timeDay.floor(state.date).getTime() === d3.timeDay.floor(new Date()).getTime();

    el.viz.html("").classed("is-day", true);

    const prog = el.viz.append("div").attr("class", "day-progress");
    prog.append("p").attr("class", "label")
      .text(`${isToday ? "מים שתית היום" : "מים ביום הזה"} · ${cups} ${cups === 1 ? "כוס" : "כוסות"} של ${WATER_CUP_ML} מ״ל`);
    prog.append("p").attr("class", "big")
      .html(`${fmtL(ml)} <small>/ ${fmtL(GOAL_ML)} ליטר</small>`);
    prog.append("div").attr("class", "progress-track")
      .attr("role", "progressbar")
      .attr("aria-valuemin", 0).attr("aria-valuemax", GOAL_ML).attr("aria-valuenow", ml)
      .append("div").attr("class", "progress-fill").style("width", `${pct * 100}%`);
    const leftMl = GOAL_ML - ml;
    const leftCups = Math.ceil(leftMl / WATER_CUP_ML);
    prog.append("p").attr("class", `status${leftMl <= 0 ? " done" : ""}`)
      .text(leftMl <= 0
        ? `הגעת ליעד! ${Math.round(ratio * 100)}% מהמומלץ`
        : `עוד ${leftMl} מ״ל · ${leftCups === 1 ? "כוס אחת" : `${leftCups} כוסות`}`);
    if (others) {
      prog.append("p").attr("class", "label")
        .text(`+ ${others} קפה / תה / קולה / אחר · לא נספרים ליעד`);
    }

    const log = el.viz.append("div").attr("class", "day-log");
    log.append("h3").text("מה שתיתי");
    if (!events.length) {
      log.append("p").attr("class", "log-empty")
        .text(isToday ? "עוד לא נרשמה שתייה היום. לחצו על \"שתיתי!\" כדי להוסיף כוס." : "אין רשומות ביום הזה.");
    } else {
      const items = log.append("ul").attr("class", "log-list")
        .selectAll("li").data(events.slice().reverse(), (d) => d.id)
        .join("li")
        .classed("editing", (d) => d.id === state.editingId);

      items.each(function (d) {
        const li = d3.select(this);
        if (d.id === state.editingId) renderEditRow(li, d);
        else renderLogRow(li, d);
      });
    }
  }

  function renderLogRow(li, d) {
    li.append("span").attr("class", "time").text(timeFmt(d.date));
    li.append("span").attr("class", "what")
      .text(isWater(d) ? `כוס ${drinkLabel(d.drink)} · ${WATER_CUP_ML} מ״ל` : `כוס ${drinkLabel(d.drink)}`);
    const actions = li.append("span").attr("class", "row-actions");
    actions.append("button").attr("class", "icon-btn").attr("type", "button")
      .attr("aria-label", `עריכת ${drinkLabel(d.drink)} מ-${timeFmt(d.date)}`)
      .attr("title", "עריכה")
      .text("✎")
      .on("click", () => { state.editingId = d.id; render(); });
    actions.append("button").attr("class", "icon-btn").attr("type", "button")
      .attr("aria-label", `מחיקת ${drinkLabel(d.drink)} מ-${timeFmt(d.date)}`)
      .attr("title", "מחיקה")
      .text("✕")
      .on("click", () => { DrinkStore.remove(d.id); render(); });
  }

  function renderEditRow(li, d) {
    const time = li.append("input").attr("type", "time").attr("class", "edit-time")
      .attr("id", `edit-time-${d.id}`).attr("aria-label", "שעה")
      .property("value", timeFmt(d.date));
    const sel = li.append("select").attr("class", "edit-drink")
      .attr("id", `edit-drink-${d.id}`).attr("aria-label", "סוג משקה");
    sel.selectAll("option").data(DRINKS).join("option")
      .attr("value", (o) => o.key).text((o) => o.label)
      .property("selected", (o) => o.key === d.drink);

    const save = () => {
      const [h, m] = (time.property("value") || timeFmt(d.date)).split(":").map(Number);
      const when = new Date(d.date);
      when.setHours(h, m, 0, 0);
      DrinkStore.update(d.id, { ts: when.toISOString(), drink: sel.property("value") });
      state.editingId = null;
      render();
    };
    const cancel = () => { state.editingId = null; render(); };

    const actions = li.append("span").attr("class", "row-actions");
    actions.append("button").attr("class", "icon-btn save").attr("type", "button")
      .attr("aria-label", "שמירה").attr("title", "שמירה").text("✓").on("click", save);
    actions.append("button").attr("class", "icon-btn").attr("type", "button")
      .attr("aria-label", "ביטול").attr("title", "ביטול").text("↩").on("click", cancel);

    li.on("keydown", (ev) => {
      if (ev.key === "Enter") { ev.preventDefault(); save(); }
      if (ev.key === "Escape") { ev.stopPropagation(); cancel(); }
    });
    requestAnimationFrame(() => time.node().focus());
  }

  // ---------- שבוע / חודש: גרף "מי בריכה" – ציר זמן מול כוסות ----------
  const DAY_SHORT = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const monthName = new Intl.DateTimeFormat("he-IL", { month: "long", year: "numeric" });
  let uid = 0;

  function renderChart() {
    stopChart();
    const [start, end] = range();
    const events = DrinkStore.between(start, end).filter(isWater); // הגרף מציג מים בלבד
    const days = d3.timeDay.range(start, end);
    const today = d3.timeDay.floor(new Date());
    const counts = d3.rollup(events, (v) => v.length, (e) => d3.timeDay.floor(e.date).getTime());
    // ליטרים ביום (כוס מים = 800 מ״ל)
    const data = days.map((d) => ({ date: d, cups: ((counts.get(d.getTime()) || 0) * WATER_CUP_ML) / 1000 }));
    // הקו נמשך רק עד היום (ימים עתידיים עוד לא קרו)
    // …ומתחיל רק מהיום הראשון שבו התחיל המעקב (ימים לפני כן אינם "0", אלא בלי נתונים)
    const firstEvent = d3.min(DrinkStore.all(), (e) => e.date);
    const trackStart = firstEvent ? d3.timeDay.floor(firstEvent) : today;
    const past = data.filter((d) => d.date >= trackStart && d.date <= today);

    const tracked = past.length;
    const total = d3.sum(past, (d) => d.cups);
    const avg = tracked ? total / tracked : 0;
    const GOAL_L = GOAL_ML / 1000;
    const hitGoal = past.filter((d) => d.cups >= GOAL_L).length;

    el.viz.html("").classed("is-day", false).classed("is-chart", true);

    const head = el.viz.append("div").attr("class", "chart-head");
    head.append("h3").text(state.period === "week"
      ? `שבוע ${fmtShort(start)}–${fmtShort(d3.timeDay.offset(end, -1))}`
      : monthName.format(start));
    const stats = head.append("p").attr("class", "chart-stats");
    stats.append("span").html(`ממוצע <b>${avg.toFixed(1)}</b> ליטר מים ביום`);
    stats.append("span").html(`<b>${hitGoal}</b> מתוך ${tracked} ימים ביעד`);
    stats.append("span").html(`סה״כ <b>${total.toFixed(1)}</b> ליטר`);

    const box = el.viz.append("div").attr("class", "chart-box");
    const tip = box.append("div").attr("class", "chart-tip").attr("hidden", true);
    const rect = box.node().getBoundingClientRect();
    const W = Math.max(Math.floor(rect.width), 200);
    const H = Math.max(Math.floor(rect.height), 90);
    const m = { top: 14, right: 20, bottom: 26, left: 34 };
    const iw = W - m.left - m.right;
    const ih = H - m.top - m.bottom;
    const id = `pool${++uid}`;

    const x = d3.scaleTime().domain([days[0], days[days.length - 1]]).range([0, iw]);
    const yMax = Math.max(GOAL_L * 1.5, d3.max(data, (d) => d.cups) + 0.6);
    const y = d3.scaleLinear().domain([0, yMax]).range([ih, 0]);

    const svg = box.append("svg")
      .attr("width", W).attr("height", H)
      .attr("role", "img")
      .attr("aria-label", `כוסות ביום: ממוצע ${avg.toFixed(1)}, ${hitGoal} ימים ביעד`);

    const defs = svg.append("defs");
    const grad = defs.append("linearGradient").attr("id", `${id}-water`).attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 1);
    grad.append("stop").attr("offset", "0%").attr("stop-color", "var(--pool-top)");
    grad.append("stop").attr("offset", "100%").attr("stop-color", "var(--pool-deep)");
    // אריחי בריכה ברקע
    const tile = defs.append("pattern").attr("id", `${id}-tile`)
      .attr("width", 22).attr("height", 22).attr("patternUnits", "userSpaceOnUse");
    tile.append("rect").attr("width", 22).attr("height", 22).attr("fill", "var(--pool-tile)");
    tile.append("path").attr("d", "M22 0H0V22").attr("fill", "none").attr("stroke", "var(--pool-grout)").attr("stroke-width", 1.5);
    defs.append("clipPath").attr("id", `${id}-clip`)
      .append("rect").attr("width", iw).attr("height", ih + 1);

    const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

    // y axis (liters)
    const yTicks = y.ticks(Math.min(6, Math.floor(ih / 28)));
    g.append("g").attr("class", "axis y-axis")
      .selectAll("text").data(yTicks).join("text")
      .attr("x", -8).attr("y", (d) => y(d)).attr("dy", "0.32em").attr("text-anchor", "end")
      .text((d) => d);

    // pool basin (tiles) behind the water
    g.append("rect").attr("class", "pool-basin")
      .attr("width", iw).attr("height", ih)
      .attr("rx", 10).attr("fill", `url(#${id}-tile)`);

    const water = g.append("g").attr("clip-path", `url(#${id}-clip)`);

    // ----- גלים: קו בסיס חלק דרך ערכי הימים + גלים סינוסיים שזזים כל הזמן -----
    let level = (px) => ih;   // גובה פני המים (בלי גלים) בנקודה px
    let draw = null;
    if (past.length) {
      const P = past.length === 1
        ? [past[0], { ...past[0], date: new Date(+past[0].date + 0.5 * 864e5) }] // נקודה בודדת → שלולית קטנה
        : past;
      const xs = P.map((d) => x(d.date));
      const ys = P.map((d) => y(d.cups));
      const x0 = xs[0], x1 = xs[xs.length - 1];
      level = (px) => {
        if (px <= xs[0]) return ys[0];
        const i = d3.bisectRight(xs, px) - 1;
        if (i >= xs.length - 1) return ys[ys.length - 1];
        const t = (px - xs[i]) / (xs[i + 1] - xs[i]);
        return ys[i] + (ys[i + 1] - ys[i]) * (1 - Math.cos(Math.PI * t)) / 2; // מעבר רך בין ימים
      };
      const AMP = state.period === "week" ? 11 : 8;   // גובה הגל
      const LEN = state.period === "week" ? 70 : 46;  // אורך הגל
      const wave = (px, ph, a, l) =>
        a * Math.sin((px / l) * 2 * Math.PI + ph) + a * 0.4 * Math.sin((px / (l * 0.47)) * 2 * Math.PI - ph * 1.6);
      const N = Math.max(8, Math.ceil((x1 - x0) / 3));
      const samples = d3.range(N + 1).map((i) => x0 + ((x1 - x0) * i) / N);
      const surf = (ph, a, l, dy = 0) => samples.map((px) => [px, Math.min(ih, level(px) + wave(px, ph, a, l) + dy)]);
      const toLine = (pts) => `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L")}`;
      const toArea = (pts) => `${toLine(pts)}L${x1},${ih}L${x0},${ih}Z`;

      const back = water.append("path").attr("class", "pool-back");
      const body = water.append("path").attr("class", "pool-water").attr("fill", `url(#${id}-water)`);
      const ripple = water.append("path").attr("class", "pool-ripple");
      const outline = water.append("path").attr("class", "pool-surface-outline");
      const foam = water.append("path").attr("class", "pool-surface");

      draw = (ph) => {
        const main = surf(ph, AMP, LEN);
        back.attr("d", toArea(surf(ph * 0.7 + 2.1, AMP * 1.25, LEN * 1.35, -7)));
        body.attr("d", toArea(main));
        ripple.attr("d", toLine(surf(-ph * 0.9 + 0.8, AMP * 0.55, LEN * 0.8, 16)));
        outline.attr("d", toLine(main));
        foam.attr("d", toLine(main));
        bubbles.attr("cy", (d) => Math.min(ih, level(x(d.date)) + wave(x(d.date), ph, AMP, LEN)));
      };
    }

    // goal line – pool edge marker
    const gy = y(GOAL_L);
    g.append("line").attr("class", "goal-line").attr("x1", 0).attr("x2", iw).attr("y1", gy).attr("y2", gy);
    g.append("text").attr("class", "goal-label").attr("x", iw - 4).attr("y", gy - 6).attr("text-anchor", "end")
      .text(`יעד ${GOAL_L} ליטר`);

    // x axis (time)
    const xData = state.period === "week" ? data : data.filter((d, i) => i % (iw < 500 ? 5 : 3) === 0 || i === data.length - 1);
    g.append("g").attr("class", "axis x-axis")
      .selectAll("text").data(xData).join("text")
      .attr("x", (d) => x(d.date)).attr("y", ih + 18)
      .attr("text-anchor", (d, i) => (i === 0 ? "start" : i === xData.length - 1 ? "end" : "middle"))
      .classed("is-today", (d) => d.date.getTime() === today.getTime())
      .text((d) => state.period === "week" ? `${DAY_SHORT[d.date.getDay()]} ${d.date.getDate()}` : d.date.getDate());

    // bubbles on each tracked day + hit areas (hover / click → daily view)
    const step = iw / Math.max(days.length - 1, 1);
    const pts = g.append("g").selectAll("g.day").data(past).join("g").attr("class", "day")
      .attr("transform", (d) => `translate(${x(d.date)},0)`);
    const bubbles = pts.append("circle").attr("class", (d) => `bubble${d.cups >= GOAL_L ? " is-goal" : ""}`)
      .attr("cy", (d) => level(x(d.date))).attr("r", state.period === "week" ? 6 : 4);
    pts.append("rect").attr("class", "hit")
      .attr("x", -step / 2).attr("width", step).attr("y", 0).attr("height", ih)
      .attr("tabindex", 0).attr("role", "button")
      .attr("aria-label", (d) => `${fmtShort(d.date)}: ${d.cups.toFixed(1)} ליטר מים. מעבר לתצוגה יומית`)
      .on("mouseenter focus", (ev, d) => {
        tip.attr("hidden", null)
          .html(`<b>${weekday.format(d.date)} ${fmtShort(d.date)}</b><br>${d.cups.toFixed(1)} ליטר מים${d.cups >= GOAL_L ? " · ביעד ✓" : ""}`)
          .style("left", `${m.left + x(d.date)}px`).style("top", `${m.top + y(d.cups)}px`);
      })
      .on("mouseleave blur", () => tip.attr("hidden", true))
      .on("click keydown", (ev, d) => {
        if (ev.type === "keydown" && ev.key !== "Enter" && ev.key !== " ") return;
        ev.preventDefault();
        state.date = d.date;
        state.period = "day";
        el.period.value = "day";
        render();
      });

    if (draw) {
      draw(0);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) chartTimer = d3.timer((ms) => draw(ms / 1000 * 2.4));
    }
  }

  function stopChart() {
    if (chartTimer) { chartTimer.stop(); chartTimer = null; }
  }

  // ---------- האיור מתמלא מים לפי היום הנבחר ----------
  // מים → ממלאים את הדמות; קפה / תה / אחר → ערימת כוסות לרגליה
  const PILE_ROWS = 4;            // שורה תחתונה של 4 כוסות, ומעליה 3, 2, 1
  const PILE_MAX = (PILE_ROWS * (PILE_ROWS + 1)) / 2;
  const CELL = 50;
  const ROW_H = 44;               // השורות נדחסות קצת אחת על השנייה
  function pileSlot(i) {
    let row = 0, idx = i;
    while (idx >= PILE_ROWS - row) { idx -= PILE_ROWS - row; row++; }
    return { x: row * (CELL / 2) + idx * CELL, y: 200 - CELL - row * ROW_H };
  }
  // הטיה "אקראית" קבועה לכל כוס – ערימה מבולגנת ומצחיקה
  const tilt = (id) => {
    let h = 0;
    for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) | 0;
    return ((Math.abs(h) % 25) - 12);
  };
  const slotTransform = (d, i, dy = 0) => {
    const s = pileSlot(i);
    return `translate(${s.x},${s.y + dy}) rotate(${tilt(d.id)},25,25)`;
  };

  function renderFigure() {
    const events = DrinkStore.between(...dayRange(state.date));
    const cups = events.filter(isWater).length;
    const ratio = (cups * WATER_CUP_ML) / GOAL_ML;
    el.water.style.height = `${Math.min(ratio, 1) * 100}%`;   // מתמלאת עד הסוף ביעד
    Figure.setLevel(Math.min(ratio, 1));                       // הדמות המונפשת (js/figure.js)
    el.water.classList.toggle("is-empty", cups === 0);
    el.level.textContent = `${Math.round(ratio * 100)}%`;      // יכול לעבור 100%

    const pile = events.filter((e) => !isWater(e));
    const shown = pile.slice(0, PILE_MAX);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.pile.selectAll("g.cup").data(shown, (d) => d.id)
      .join(
        (enter) => enter.append("g").attr("class", "cup")
          .html((d) => CUP_ART[d.drink] || CUP_ART.other)
          .attr("transform", (d, i) => slotTransform(d, i, reduce ? 0 : -180))
          .attr("opacity", reduce ? 1 : 0)
          .call((g) => g.transition().duration(reduce ? 0 : 750).ease(d3.easeBounceOut)
            .attr("opacity", 1)
            .attr("transform", (d) => slotTransform(d, shown.indexOf(d)))),
        (update) => update
          .html((d) => CUP_ART[d.drink] || CUP_ART.other)
          .call((g) => g.transition().duration(300)
            .attr("transform", (d, i) => slotTransform(d, i))),
        (exit) => exit.transition().duration(250).attr("opacity", 0).remove()
      );

    const extra = pile.length - shown.length;
    el.pile.selectAll("text.more").data(extra > 0 ? [extra] : [])
      .join("text").attr("class", "more")
      .attr("x", 100).attr("y", 200 - CELL - (PILE_ROWS - 1) * ROW_H - 10).attr("text-anchor", "middle")
      .text((n) => `+${n}`);
  }

  function render() {
    stopChart();
    renderDate();
    el.viz.classed("is-chart", false);
    if (state.period === "day") renderDay(); else renderChart();
    renderFigure();
  }

  // ציור מחדש של הגרף כשגודל החלון משתנה
  let resizeT;
  new ResizeObserver(() => {
    if (state.period === "day") return;
    clearTimeout(resizeT);
    resizeT = setTimeout(renderChart, 120);
  }).observe(document.getElementById("viz"));

  // ---------- תפריט "מה שתית?" ----------
  DRINKS.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "drink-option";
    b.setAttribute("role", "menuitem");
    b.textContent = d.label;
    b.addEventListener("click", () => logDrink(d.key));
    el.options.appendChild(b);
  });

  function openMenu() {
    el.menu.hidden = false;
    el.drinkBtn.setAttribute("aria-expanded", "true");
    el.options.querySelector("button").focus();
  }
  function closeMenu() {
    el.menu.hidden = true;
    el.drinkBtn.setAttribute("aria-expanded", "false");
  }

  function logDrink(kind) {
    // הרישום נכנס ליום שמוצג עכשיו. היום → השעה הנוכחית.
    // יום קודם → אותה שעה של עכשיו באותו יום, ושורת הרישום נפתחת לעריכה כדי לקבוע את השעה הנכונה.
    const now = new Date();
    const isToday = +d3.timeDay.floor(state.date) === +d3.timeDay.floor(now);
    const when = new Date(state.date);
    when.setHours(now.getHours(), now.getMinutes(), 0, 0);
    const id = DrinkStore.add(kind, isToday ? now : when);

    state.date = isToday ? now : when;
    state.period = "day";
    el.period.value = "day";
    state.editingId = isToday ? null : id;
    closeMenu();
    if (isToday) el.drinkBtn.focus();
    render();
    if (WATER_KINDS.has(kind)) happyDance();
  }

  // ריקוד שמח כשמוסיפים מים 💃 – קפיצות, נענועים, תווים וטיפות שעפים למעלה
  function happyDance() {
    const dancer = document.getElementById("dancer");
    const fx = document.getElementById("dance-fx");
    dancer.classList.remove("dancing");
    void dancer.offsetWidth; // restart the animation if already dancing
    dancer.classList.add("dancing");
    clearTimeout(happyDance.t);
    happyDance.t = setTimeout(() => dancer.classList.remove("dancing"), 2600);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bits = ["♪", "♫", "drop", "♪", "drop", "♫", "drop"];
    bits.forEach((b, i) => {
      const n = document.createElement("span");
      n.className = b === "drop" ? "fx drop" : "fx";
      if (b !== "drop") n.textContent = b;
      const left = i % 2 ? 62 + Math.random() * 30 : 2 + Math.random() * 30;   // around her raised hands
      n.style.left = `${left}%`;
      n.style.top = `${4 + Math.random() * 22}%`;
      n.style.setProperty("--dx", `${(i % 2 ? 1 : -1) * (10 + Math.random() * 30)}px`);
      n.style.animationDelay = `${i * 0.18}s`;
      fx.appendChild(n);
      n.addEventListener("animationend", () => n.remove(), { once: true });
    });
  }

  el.drinkBtn.addEventListener("click", () => (el.menu.hidden ? openMenu() : closeMenu()));
  document.addEventListener("click", (e) => {
    if (!el.menu.hidden && !e.target.closest(".drink-action")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !el.menu.hidden) { closeMenu(); el.drinkBtn.focus(); }
  });

  el.period.addEventListener("change", (e) => {
    state.period = e.target.value;
    render();
  });

  el.prev.addEventListener("click", () => step(-1));
  el.next.addEventListener("click", () => step(1));

  el.dateInput.addEventListener("change", (e) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split("-").map(Number);
    state.date = new Date(y, m - 1, d);
    render();
  });

  render();
})();
