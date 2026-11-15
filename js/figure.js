// הדמות כ"בובה" עם חלקים נפרדים: אגן, פלג גוף עליון, ראש, שתי ידיים.
// נבנית מתוך assets/woman.svg כך שכל חלק יכול לזוז בריקוד, והמים זזים יחד עם כל חלק.
// אם הטעינה נכשלת (למשל פתיחה מקובץ מקומי) – נשארת התמונה הרגילה עם שכבת המים הישנה.
const Figure = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const W = 483;
  const H = 780.998;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ready = false;
  let waterPath = null;
  let target = 0; // יעד מילוי (0..1)
  let level = 0;  // מילוי נוכחי (מונפש לעבר היעד)

  const el = (tag, attrs = {}, children = []) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    children.forEach((c) => c && n.appendChild(c));
    return n;
  };

  // פני המים: קו גלי שזז כל הזמן
  function drawWater(phase) {
    if (!waterPath) return;
    if (level <= 0.002) { waterPath.setAttribute("d", ""); return; }
    const y0 = (H + 24) * (1 - level) - 24; // ב-100% המים מכסים גם את קצות האצבעות
    const pts = [];
    for (let x = -40; x <= W + 40; x += 8) {
      const y = y0 + 5 * Math.sin(x / 34 + phase) + 2.5 * Math.sin(x / 17 - phase * 1.7);
      pts.push(`${x},${y.toFixed(1)}`);
    }
    waterPath.setAttribute("d", `M${pts.join("L")}L${W + 40},${H + 40}L-40,${H + 40}Z`);
  }

  function setLevel(frac) {
    target = Math.max(0, Math.min(1, frac));
    if (reduce || !ready) { level = target; drawWater(0); }
  }

  async function init() {
    const host = document.getElementById("dancer");
    if (!host) return;
    let bodyDoc, chestDoc;
    try {
      const [b, c] = await Promise.all(
        ["assets/woman.svg", "assets/woman-face.svg"].map((u) =>
          fetch(u).then((r) => (r.ok ? r.text() : Promise.reject(new Error(u))))
        )
      );
      const parse = (t) => new DOMParser().parseFromString(t, "image/svg+xml");
      bodyDoc = parse(b);
      chestDoc = parse(c);
    } catch {
      return; // fallback: static image + masked water
    }

    // מזהים ייחודיים בתוך הדף
    bodyDoc.querySelectorAll("[id]").forEach((n) => (n.id = `w-${n.id}`));
    const take = (id) => document.importNode(bodyDoc.getElementById(`w-${id}`), true);
    const group = (cls, ids, extra = []) => el("g", { class: `fig-part ${cls}` }, [...ids.map(take), ...extra]);

    // מים: צורה אחת ב-defs, ובכל שכבה <use> שגזור לפי צורת החלק
    waterPath = el("path", { id: "fig-water", class: "fig-water" });
    const clip = (id, shapeIds) =>
      el("clipPath", { id }, shapeIds.map((s) => el("use", { href: `#w-${s}` })));
    const water = (clipId) => el("use", { href: "#fig-water", "clip-path": `url(#${clipId})` });

    const defs = el("defs", {}, [
      waterPath,
      clip("cp-legs", ["Vector_7", "Vector_8", "Vector_9", "Vector"]),
      clip("cp-hair-back", ["Vector_2"]),
      clip("cp-arm-l", ["Vector_3"]),
      clip("cp-hair", ["Vector_10"]),
      clip("cp-neck", ["Vector_11"]),
      clip("cp-arm-r", ["Vector_12"]),
      clip("cp-neck-shadow", ["Vector_15"]),
      clip("cp-face", ["Vector_16", "Vector_17", "Vector_25", "Vector_26"]),
      clip("cp-suit", ["Vector_18"]),
    ]);


    const faceFeatures = [take("Vector_16"), take("Vector_17")];
    const smile = take("Vector_19");
    const features = take("Group_6");

    const chest = el("g", { class: "chest", transform: "translate(231.07 219)" },
      [...chestDoc.documentElement.children].map((n) => document.importNode(n, true)));

    // סדר הציור זהה למקור; כל חלק עטוף בקבוצה שזזה בריקוד
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "fig-rig", "aria-hidden": "true" }, [
      defs,
      el("g", { class: "fig-part hips" }, [
        group("legs", ["Vector_7", "Vector_8", "Vector_9", "Vector"], [water("cp-legs")]),
        el("g", { class: "fig-part upper" }, [
          group("head", ["Vector_2"], [water("cp-hair-back")]),
          group("arm-l", ["Group_2"], [water("cp-arm-l")]),
          group("head", ["Vector_10"], [water("cp-hair")]),
          group("neck", ["Vector_11"], [water("cp-neck")]),
          group("arm-r", ["Group_4"], [water("cp-arm-r")]),
          group("neck", ["Vector_15"], [water("cp-neck-shadow")]),
          el("g", { class: "fig-part head" }, [
            ...faceFeatures, smile, features,
            take("Vector_25"), take("Vector_26"), take("Vector_27"), take("Vector_28"),
            water("cp-face"),
          ]),
        ]),
        el("g", { class: "fig-part suit" }, [take("Vector_18"), water("cp-suit"), chest]),
      ]),
    ]);

    host.replaceChildren(svg);
    host.classList.add("rigged");
    ready = true;
    level = reduce ? target : 0;
    drawWater(0);

    if (!reduce) {
      d3.timer((ms) => {
        level += (target - level) * 0.06; // מילוי רך
        drawWater((ms / 1000) * 2.6);
      });
    }
  }

  init();
  return { setLevel };
})();
