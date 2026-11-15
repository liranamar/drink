(() => {
  const state = {
    date: new Date(),   // היום שנבחר
    period: "day",      // day | week | month
  };

  const el = {
    dateLabel: document.getElementById("date-label"),
    dateInput: document.getElementById("date-input"),
    period: document.getElementById("period"),
    drinkBtn: document.getElementById("drink-btn"),
    viz: d3.select("#viz"),
  };

  const weekday = new Intl.DateTimeFormat("he-IL", { weekday: "long" });
  const pad = (n) => String(n).padStart(2, "0");
  const fmtShort = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;
  const toInputValue = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // טווח הזמן לפי חתך הזמן שנבחר (שבוע מתחיל ביום ראשון)
  function range() {
    const d = state.date;
    switch (state.period) {
      case "week": {
        const start = d3.timeWeek.floor(d);
        return [start, d3.timeWeek.offset(start, 1)];
      }
      case "month": {
        const start = d3.timeMonth.floor(d);
        return [start, d3.timeMonth.offset(start, 1)];
      }
      default: {
        const start = d3.timeDay.floor(d);
        return [start, d3.timeDay.offset(start, 1)];
      }
    }
  }

  function renderDate() {
    const d = state.date;
    el.dateLabel.textContent = `${weekday.format(d)}   ${fmtShort(d)}`;
    el.dateInput.value = toInputValue(d);
  }

  // אזור ההדמיה – זמני: מציג את מספר הכוסות בטווח הנבחר.
  // כאן ייכנסו הגרפים לפי חתך הזמן.
  function renderViz() {
    const [start, end] = range();
    const events = DrinkStore.between(start, end);
    const caption = {
      day: "כוסות היום",
      week: `כוסות בשבוע ${fmtShort(start)}–${fmtShort(d3.timeDay.offset(end, -1))}`,
      month: "כוסות החודש",
    }[state.period];

    const wrap = el.viz.selectAll("div.viz-summary").data([events.length]);
    const enter = wrap.enter().append("div").attr("class", "viz-summary");
    enter.append("p").attr("class", "viz-count");
    enter.append("p").attr("class", "viz-caption");
    const merged = enter.merge(wrap);
    merged.select(".viz-count").text((n) => n);
    merged.select(".viz-caption").text(caption);
  }

  function render() {
    renderDate();
    renderViz();
  }

  el.period.addEventListener("change", (e) => {
    state.period = e.target.value;
    render();
  });

  el.dateInput.addEventListener("change", (e) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split("-").map(Number);
    state.date = new Date(y, m - 1, d);
    render();
  });

  el.drinkBtn.addEventListener("click", () => {
    DrinkStore.add(new Date());
    state.date = new Date(); // קפיצה חזרה להיום כדי לראות את הכוס שנוספה
    render();
  });

  render();
})();
