// שמירת אירועי שתייה ב-localStorage.
// כל אירוע: { id, ts: <ISO timestamp>, drink: <drink key> }
const DrinkStore = (() => {
  const KEY = "drink.events.v1";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      // רשומות ישנות ללא id / סוג משקה
      return arr.map((e, i) => ({ id: e.id || `${e.ts}-${i}`, ts: e.ts, drink: e.drink || "water" }));
    } catch {
      return [];
    }
  }

  let events = load();

  // ייבוא חד-פעמי של נתוני ההתחלה (data/seed.js) – רק רשומות שעוד לא קיימות
  function importSeed() {
    if (typeof SEED_DATA === "undefined") return;
    const FLAG = "drink.seed.imported";
    try {
      if (localStorage.getItem(FLAG) === SEED_VERSION) return;
    } catch { /* no storage – import into memory */ }
    const have = new Set(events.map((e) => e.id));
    for (const [day, rows] of Object.entries(SEED_DATA)) {
      const [y, m, d] = day.split("-").map(Number);
      rows.forEach(([time, drink], i) => {
        const id = `seed-${day}-${i}`;
        if (have.has(id)) return;
        const [hh, mm] = time.split(":").map(Number);
        events.push({ id, ts: new Date(y, m - 1, d, hh, mm).toISOString(), drink });
      });
    }
    save();
    try { localStorage.setItem(FLAG, SEED_VERSION); } catch { /* ignore */ }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(events));
    } catch {
      /* storage unavailable – keep in memory only */
    }
  }

  importSeed();

  return {
    all: () => events.map((e) => ({ ...e, date: new Date(e.ts) })),
    add(drink = "water", date = new Date()) {
      const id = `${date.getTime()}-${Math.random().toString(36).slice(2, 7)}`;
      events.push({ id, ts: date.toISOString(), drink });
      save();
    },
    update(id, changes) {
      events = events.map((e) => (e.id === id ? { ...e, ...changes } : e));
      save();
    },
    remove(id) {
      events = events.filter((e) => e.id !== id);
      save();
    },
    between(start, end) {
      return this.all()
        .filter((e) => e.date >= start && e.date < end)
        .sort((a, b) => a.date - b.date);
    },
  };
})();
