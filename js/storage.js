// שמירת אירועי שתייה ב-localStorage.
// כל אירוע: { ts: <ISO timestamp> }
const DrinkStore = (() => {
  const KEY = "drink.events.v1";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  let events = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(events));
    } catch {
      /* storage unavailable – keep in memory only */
    }
  }

  return {
    all: () => events.map((e) => ({ ...e, date: new Date(e.ts) })),
    add(date = new Date()) {
      events.push({ ts: date.toISOString() });
      save();
    },
    between(start, end) {
      return this.all().filter((e) => e.date >= start && e.date < end);
    },
  };
})();
