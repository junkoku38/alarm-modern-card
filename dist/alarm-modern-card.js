/**
 * Alarm Modern Card
 * Carte Lovelace moderne pour système d'alarme.
 * Anneau d'état, contrôle segmenté, couverture d'armement 24 h,
 * zones, catégories incendie et capteurs repliables.
 */

const CARD_VERSION = "1.3.0";

console.info(
  `%c ALARM-MODERN-CARD %c v${CARD_VERSION} `,
  "color:#eef1f6;background:#1d2430;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px",
  "color:#7fb3ff;background:#0f1218;border-radius:0 3px 3px 0;padding:2px 6px"
);

/* ------------------------------------------------------------------ */
/* Sécurité                                                            */
/* ------------------------------------------------------------------ */

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const I = {
  shieldCheck: `<path d="M12 1 3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4zm4.4 7.5-5.8 5.8-3-3 1.5-1.5 1.5 1.5 4.3-4.3 1.5 1.5z"/>`,
  shieldOpen: `<path d="M12 1 3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4zm0 2.2 7 3.1V11c0 4.5-2.9 8.7-7 9.9-4.1-1.2-7-5.4-7-9.9V6.3l7-3.1z"/>`,
  shieldLock: `<path d="M12 1 3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4zm0 6a2.6 2.6 0 0 1 2.6 2.6V11h.4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h.4V9.6A2.6 2.6 0 0 1 12 7zm0 1.6a1 1 0 0 0-1 1V11h2V9.6a1 1 0 0 0-1-1z"/>`,
  moon: `<path d="M12 3a9 9 0 1 0 9 9c0-.3 0-.6-.1-.9A6.5 6.5 0 0 1 12.9 3.1 9 9 0 0 0 12 3z"/>`,
  home: `<path d="M12 3 3 11h2.5v9h5v-6h3v6h5v-9H21L12 3z"/>`,
  bell: `<path d="M12 2a6 6 0 0 0-6 6v5l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm-2 17a2 2 0 0 0 4 0h-4z"/>`,
  door: `<path d="M11 3H5v18h6v-2H7V5h4V3zm2 0v18h6V3h-6zm3 8.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>`,
  motion: `<path d="M13.5 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9.8 8.9 7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3A7.3 7.3 0 0 0 19 13v-2c-1.8 0-3.4-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5 0-.8.2L6 8.3V13h2V9.6l1.8-.7z"/>`,
  glass: `<path d="M4 4h16v12H4V4zm2 2v8h12V6H6zm2 12h8v2H8v-2z"/>`,
  water: `<path d="M12 3s6 6.4 6 10a6 6 0 1 1-12 0c0-3.6 6-10 6-10z"/>`,
  smoke: `<path d="M12 2s6 5.5 6 10.5A6 6 0 0 1 6 12.5C6 7.5 12 2 12 2zm0 16a3.5 3.5 0 0 0 3.5-3.5c0-2-1.8-4.3-3.5-6-1.7 1.7-3.5 4-3.5 6A3.5 3.5 0 0 0 12 18z"/>`,
  co: `<path d="M6 8a4 4 0 1 0 0 8h2v-2H6a2 2 0 1 1 0-4h2V8H6zm7 0a4 4 0 0 0 0 8h1a4 4 0 0 0 0-8h-1zm0 2h1a2 2 0 0 1 0 4h-1a2 2 0 0 1 0-4z"/>`,
  caret: `<path d="M7 10l5 5 5-5z"/>`,
  window: `<path d="M4 3h16v18H4V3zm2 2v7h5V5H6zm7 0v7h5V5h-5zM6 14v5h5v-5H6zm7 0v5h5v-5h-5z"/>`,
  vibration: `<path d="M2 12h2.5l1.7-5 2.6 10 2.6-13 2.6 13 2.6-10 1.7 5H22v2h-3.9l-.9-2.6-2.6 9.9-2.6-13-2.6 13-2.6-9.9L5.9 14H2v-2z"/>`,
};

const ZONE_ICON = {
  door: I.door,
  window: I.window,
  opening: I.door,
  motion: I.motion,
  occupancy: I.motion,
  glass: I.glass,
  sound: I.glass,
  moisture: I.water,
  water: I.water,
  vibration: I.vibration,
  smoke: I.smoke,
  gas: I.co,
  carbon_monoxide: I.co,
};

const ARMED_TOTAL = ["armed_away", "armed_vacation", "armed_custom_bypass"];
const ARMED_PART = ["armed_home", "armed_night"];

const fireEvent = (node, type, detail = {}) => {
  const ev = new Event(type, { bubbles: true, cancelable: false, composed: true });
  ev.detail = detail;
  node.dispatchEvent(ev);
};

const domainOf = (id) => (id ? String(id).split(".")[0] : null);
const DEAD = ["unavailable", "unknown", "", null, undefined];
const isDead = (v) => DEAD.includes(v);

/* ------------------------------------------------------------------ */


async function ensureHaForm() {
  if (customElements.get("ha-form")) return true;
  try {
    const helpers = await window.loadCardHelpers();
    const card = helpers.createCardElement({ type: "entities", entities: [] });
    if (card?.constructor?.getConfigElement) await card.constructor.getConfigElement();
  } catch (err) { console.warn("alarm-modern-card : ha-form indisponible", err); }
  return !!customElements.get("ha-form");
}

class AlarmModernCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._built = false;
    this._els = {};
    this._history = null;
    this._fetchedAt = 0;
    this._busy = false;
    this._tick = null;
    this._fast = false;
    this._code = "";
    this._pending = null; // action en attente de code
  }

  setConfig(config) {
    if (!config) throw new Error("Configuration invalide");
    if (!config.alarm) throw new Error("« alarm » est obligatoire");
    this._config = {
      name: "Alarme",
      hours: 24,
      refresh: 300,
      exit_delay: 45,
      entry_delay: 30,
      show_coverage: true,
      show_zones: true,
      battery_warning: 30,
      auto_discover: false,
      links: [],
      zones: [],
      fire: [],
      sensors: [],
      modes: [
        { name: "Désarmé", service: "alarm_disarm", state: "disarmed", icon: "shieldOpen" },
        { name: "Nuit", service: "alarm_arm_night", state: "armed_night", icon: "moon" },
        { name: "Total", service: "alarm_arm_away", state: "armed_away", icon: "shieldLock" },
      ],
      ...config,
    };
    this._built = false;
    this._history = null;
    this._fetchedAt = 0;
    if (this.shadowRoot) this.shadowRoot.innerHTML = "";
  }

  static async getConfigElement() {
    await ensureHaForm();
    return document.createElement("alarm-modern-card-editor");
  }

  static getStubConfig(hass) {
    const stub = { type: "custom:alarm-modern-card", name: "Alarme" };
    if (!hass?.states) return { ...stub, alarm: "" };
    const panel = Object.keys(hass.states).find(
      (id) => id.startsWith("alarm_control_panel.") && !isDead(hass.states[id]?.state)
    );
    if (panel) stub.alarm = panel;
    return stub;
  }

  getCardSize() {
    return 12;
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (!this._built) this._build();
    this._update();
    if (first) this._fetchHistory();
  }

  connectedCallback() {
    this._startTick(false);
  }

  disconnectedCallback() {
    if (this._tick) clearInterval(this._tick);
    this._tick = null;
  }

  _startTick(fast) {
    if (this._tick && this._fast === fast) return;
    if (this._tick) clearInterval(this._tick);
    this._fast = fast;
    this._tick = setInterval(
      () => {
        this._update();
        if (!fast && Date.now() - this._fetchedAt > this._config.refresh * 1000)
          this._fetchHistory();
      },
      fast ? 1000 : 15000
    );
  }

  /* ---------- Helpers ---------- */

  _st(id) {
    return id && this._hass ? this._hass.states[id] : null;
  }

  _num(id) {
    if (typeof id === "number") return id;
    const s = this._st(id);
    if (!s) return null;
    const v = Number(s.state);
    return Number.isNaN(v) ? null : v;
  }

  _more(id) {
    if (id) fireEvent(this, "hass-more-info", { entityId: id });
  }

  _fmt(v, dec = 1) {
    if (v == null || Number.isNaN(v)) return "—";
    return new Intl.NumberFormat(this._hass?.locale?.language || "fr", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    }).format(v);
  }

  _hhmm(d) {
    return d.toLocaleTimeString(this._hass?.locale?.language || "fr", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  _ago(iso) {
    if (!iso) return "";
    const d = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (d < 60) return `${Math.round(d)} s`;
    if (d < 3600) return `${Math.round(d / 60)} min`;
    if (d < 86400) return `${Math.round(d / 3600)} h`;
    return `${Math.round(d / 86400)} j`;
  }

  _alarm() {
    return this._st(this._config.alarm);
  }

  _discover() {
    const c = this._config;
    if (!c.auto_discover || !c.alarm || !this._hass?.entities) return null;
    const alarmDev = this._hass.entities[c.alarm]?.device_id;
    if (!alarmDev) return null;
    const allIds = Object.keys(this._hass.states);
    const devOf = (id) => this._hass.entities?.[id]?.device_id;
    const sameDev = (id) => {
      const d = devOf(id);
      if (!d) return false;
      if (d === alarmDev) return true;
      const dev = this._hass.devices?.[d];
      const alarmDevice = this._hass.devices?.[alarmDev];
      return dev && alarmDevice &&
        (dev.manufacturer === alarmDevice.manufacturer ||
         (dev.config_entries || []).some((e) => (alarmDevice.config_entries || []).includes(e)));
    };
    const groups = {};
    for (const id of allIds) {
      if (!sameDev(id)) continue;
      const st = this._hass.states[id];
      if (!st || isDead(st.state)) continue;
      const dc = st.attributes?.device_class || "";
      const dom = id.split(".")[0];
      let prefix = null, kind = null;
      if (["door","opening","window"].includes(dc) && dom === "binary_sensor") {
        prefix = id.replace(/^binary_sensor\./, "").replace(/_porte$|_ouverture$/, "");
        kind = "zone";
      } else if (["motion","occupancy"].includes(dc) && dom === "binary_sensor") {
        prefix = id.replace(/^binary_sensor\./, "").replace(/_mouvement$/, "");
        kind = "motion";
      } else if (["smoke","heat","carbon_monoxide","gas"].includes(dc) && dom === "binary_sensor") {
        prefix = id.replace(/^binary_sensor\./, "").replace(/_fumee$|_fum\u00e9e$|_chaleur$|_monoxyde_de_carbone$|_vapeur$/, "");
        kind = "fire";
      } else if (dc === "tamper" && dom === "binary_sensor") {
        prefix = id.replace(/^binary_sensor\./, "").replace(/_sabotage_du_boitier$|_inclinaison$/, "");
        kind = "tamper";
      } else if (dc === "battery" && dom === "sensor") {
        prefix = id.replace(/^sensor\./, "").replace(/_batterie$/, "");
        kind = "battery";
      } else if (dc === "temperature" && dom === "sensor") {
        prefix = id.replace(/^sensor\./, "").replace(/_temperature$/, "");
        kind = "temperature";
      }
      if (prefix && kind) (groups[prefix] = groups[prefix] || {})[kind] = id;
    }
    const zones = [], fire = [], sensors = [];
    const allZones = c.zones || [], allFire = c.fire || [], allSensors = c.sensors || [];
    const knownZ = new Set(allZones.map((z) => z.entity));
    const knownF = new Set(allFire.map((f) => f.entity));
    const knownS = new Set(allSensors.map((s) => s.entity));
    for (const [prefix, g] of Object.entries(groups)) {
      const fn = (id) => this._hass.states[id]?.attributes?.friendly_name || prefix;
      const name = fn(g.zone || g.motion || g.fire || g.battery || g.temperature || prefix);
      if (g.zone && !knownZ.has(g.zone)) { const dc = this._hass.states[g.zone]?.attributes?.device_class; zones.push({entity:g.zone,name,type:dc==="window"?"window":"door"}); knownZ.add(g.zone); }
      if (g.motion && !knownZ.has(g.motion)) { zones.push({entity:g.motion,name,type:"motion"}); knownZ.add(g.motion); }
      if (g.fire && !knownF.has(g.fire)) { fire.push({entity:g.fire,name,temperature:g.temperature||undefined}); knownF.add(g.fire); }
      if (g.battery && !knownS.has(g.battery)) { sensors.push({entity:g.battery,name,temperature:g.temperature||undefined}); knownS.add(g.battery); }
    }
    return { zones: [...allZones, ...zones], fire: [...allFire, ...fire], sensors: [...allSensors, ...sensors] };
  }



  /** 'off' | 'exit' | 'armed' | 'alarm' */
  _mode() {
    const s = this._alarm();
    if (!s) return "off";
    if (s.state === "triggered") return "alarm";
    if (s.state === "arming") return "exit";
    if (s.state === "pending") return "alarm";
    if (ARMED_TOTAL.includes(s.state) || ARMED_PART.includes(s.state)) return "armed";
    return "off";
  }

  _countdown() {
    const s = this._alarm();
    if (!s) return null;
    const delay =
      s.state === "arming" ? this._config.exit_delay : this._config.entry_delay;
    const elapsed = (Date.now() - new Date(s.last_changed).getTime()) / 1000;
    return Math.max(0, Math.round(delay - elapsed));
  }

  _codeRequired(service) {
    const c = this._config;
    if (c.code_required === false) return false;
    const s = this._alarm();
    const fmt = s?.attributes?.code_format;
    if (!fmt) return c.code_required === true;
    if (service === "alarm_disarm") return true;
    return s?.attributes?.code_arm_required !== false;
  }

  /* ---------- Historique ---------- */

  async _fetchHistory() {
    const c = this._config;
    if (!c.show_coverage || this._busy || !this._hass) return;
    this._busy = true;
    try {
      const end = new Date();
      const start = new Date(end.getTime() - c.hours * 3600 * 1000);
      const res = await this._hass.callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        minimal_response: true,
        no_attributes: true,
        entity_ids: [c.alarm],
      });
      this._history = { data: res || {}, start: start.getTime(), end: end.getTime() };
    } catch (err) {
      console.warn("alarm-modern-card : historique indisponible", err);
      this._history = { data: {}, start: 0, end: 0 };
    } finally {
      this._busy = false;
      this._fetchedAt = Date.now();
      this._renderCoverage();
    }
  }

  _coverageSegments() {
    const c = this._config;
    const h = this._history;
    if (!h || !h.data[c.alarm]) return null;
    const span = h.end - h.start || 1;
    const rows = h.data[c.alarm];
    const segs = [];
    let cur = null;
    const kindOf = (st) =>
      ARMED_TOTAL.includes(st) ? "total" : ARMED_PART.includes(st) ? "nuit" : null;

    rows.forEach((p) => {
      const t = p.lu != null ? p.lu * 1000 : new Date(p.last_updated).getTime();
      const k = kindOf(p.s !== undefined ? p.s : p.state);
      if (cur && cur.kind !== k) {
        segs.push({ ...cur, end: (t - h.start) / span });
        cur = null;
      }
      if (k && !cur) cur = { kind: k, start: (t - h.start) / span };
    });
    if (cur) segs.push({ ...cur, end: 1 });
    const armed = segs.reduce((a, s) => a + (s.end - s.start), 0);
    return { segs: segs.filter((s) => s.end > 0 && s.start < 1), pct: armed };
  }

  /* ---------- Construction ---------- */

  _build() {
    this.shadowRoot.innerHTML = `<style>${AlarmModernCard.styles}</style>${this._template()}`;
    this._built = true;
    const $ = (s) => this.shadowRoot.querySelector(s);
    const e = this._els;
    const c = this._config;

    e.card = $("ha-card");
    e.sysName = $(".sys .nm");
    e.sysState = $(".sys b");
    e.dot = $(".sys .dl");
    e.links = $(".links");
    e.ringVal = $(".ring .val");
    e.icon = $(".center .sh");
    e.word = $(".word");
    e.sub = $(".sub");
    e.segw = $(".segw");
    e.pill = $(".pill");
    e.actions = $(".act");
    e.cov = $(".cov");
    e.covPct = $(".cov .pct");
    e.covSlot = $(".cov .slot");
    e.zones = $(".zones");
    e.accWrap = $(".accs-wrap");
    e.fireAcc = $(".acc-fire");
    e.fireSum = $(".acc-fire .accv .txt");
    e.fireBody = $(".acc-fire .accb");
    e.battAcc = $(".acc-batt");
    e.battSum = $(".acc-batt .accv .txt");
    e.battBody = $(".acc-batt .accb");
    e.ev = $(".ev .txt");
    e.pad = $(".padw");
    e.padDots = $(".dots");
    e.padTitle = $(".padt");

    $(".stage").addEventListener("click", () => this._more(c.alarm));

    /* Contrôle segmenté */
    e.segw.innerHTML =
      `<div class="pill"></div>` +
      c.modes
        .map(
          (m, i) =>
            `<div class="sgi" data-i="${i}"><svg viewBox="0 0 24 24">${
              I[m.icon] || I.shieldOpen
            }</svg><span>${esc(m.name)}</span></div>`
        )
        .join("");
    e.pill = this.shadowRoot.querySelector(".pill");
    e.segw.querySelectorAll(".sgi").forEach((el) => {
      el.addEventListener("click", () => {
        const m = c.modes[Number(el.dataset.i)];
        this._runService(m.service);
      });
    });

    /* Clavier */
    this.shadowRoot.querySelectorAll(".key").forEach((k) => {
      k.addEventListener("click", () => this._key(k.dataset.k));
    });
    $(".padclose").addEventListener("click", () => this._closePad());
  }

  _template() {
    const c = this._config;
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"];
    return `
      <ha-card>
        <div class="glow"></div>

        <div class="top">
          <div class="sys"><span class="dl"></span><span class="nm"></span> · <b>—</b></div>
          <div class="links"></div>
        </div>

        <div class="stage">
          <svg class="ring" viewBox="0 0 176 176">
            <circle class="trk" cx="88" cy="88" r="81" fill="none" stroke="rgba(255,255,255,.08)"
              stroke-width="7" stroke-linecap="round"/>
            <circle class="val" cx="88" cy="88" r="81" fill="none" stroke="#7ee0a4"
              stroke-width="7" stroke-linecap="round" transform="rotate(-90 88 88)"/>
          </svg>
          <div class="center">
            <svg class="sh" viewBox="0 0 24 24">${I.shieldOpen}</svg>
            <div class="word">—</div>
          </div>
        </div>
        <div class="sub">—</div>

        <div class="segw"></div>
        <div class="act"></div>

        ${
          c.show_coverage
            ? `<div class="cov">
                 <div class="covl"><span class="k">Couverture d'armement · ${Number(c.hours)||24} h</span>
                   <span class="covr"><i class="c1"></i>Total<i class="c2"></i>Nuit
                     <b class="pct">—</b></span></div>
                 <div class="slot"></div>
               </div>`
            : ""
        }

        ${c.show_zones && c.zones.length ? `<div class="zones"></div>` : ""}

        <div class="accs-wrap">
          ${
            c.fire.length
              ? `<details class="acc acc-fire">
                   <summary class="accs"><span class="k">Incendie et fumée</span>
                     <span class="accv"><span class="txt">—</span>
                       <svg class="car" viewBox="0 0 24 24">${I.caret}</svg></span></summary>
                   <div class="accb"></div>
                 </details>`
              : ""
          }
          ${
            c.sensors.length
              ? `<details class="acc acc-batt">
                   <summary class="accs"><span class="k">Capteurs · batterie et température</span>
                     <span class="accv"><span class="txt">—</span>
                       <svg class="car" viewBox="0 0 24 24">${I.caret}</svg></span></summary>
                   <div class="accb"></div>
                 </details>`
              : ""
          }
        </div>

        <div class="ev"><span class="evd"></span><span class="txt">—</span></div>

        <div class="padw hidden">
          <div class="padbg"></div>
          <div class="padc">
            <div class="padt">Saisissez votre code</div>
            <div class="dots"></div>
            <div class="pad">
              ${keys
                .map(
                  (k) =>
                    `<div class="key${k === "C" ? " ghost" : k === "OK" ? " ok" : ""}" data-k="${k}">${k}</div>`
                )
                .join("")}
            </div>
            <div class="padclose">Annuler</div>
          </div>
        </div>
      </ha-card>`;
  }

  /* ---------- Services et clavier ---------- */

  _runService(service, code) {
    const c = this._config;
    if (!service || !this._hass) return;
    if (code === undefined && this._codeRequired(service)) {
      this._pending = service;
      this._code = "";
      this._openPad(service);
      return;
    }
    const data = { entity_id: c.alarm };
    if (code) data.code = code;
    this._hass.callService("alarm_control_panel", service, data);
  }

  _openPad(service) {
    const e = this._els;
    e.padTitle.textContent =
      service === "alarm_disarm" ? "Code pour désarmer" : "Code pour armer";
    e.pad.classList.remove("hidden");
    this._renderDots();
  }

  _closePad() {
    this._els.pad.classList.add("hidden");
    this._code = "";
    this._pending = null;
  }

  _key(k) {
    if (k === "C") this._code = this._code.slice(0, -1);
    else if (k === "OK") {
      const service = this._pending;
      const code = this._code;
      this._closePad();
      this._runService(service, code);
      return;
    } else if (this._code.length < 8) this._code += k;
    this._renderDots();
  }

  _renderDots() {
    const n = Math.max(4, this._code.length);
    this._els.padDots.innerHTML = Array.from({ length: n })
      .map((_, i) => `<i class="${i < this._code.length ? "on" : ""}"></i>`)
      .join("");
  }

  /* ---------- Rendu ---------- */

  _renderCoverage() {
    const e = this._els;
    if (!e.covSlot) return;
    const W = 342;
    const H = 15;
    const cov = this._coverageSegments();
    const col = { total: "#7fb3ff", nuit: "#ffc76b" };
    const bars = cov
      ? cov.segs
          .map(
            (s) =>
              `<rect x="${(s.start * W).toFixed(1)}" y="0" width="${Math.max(
                3,
                (s.end - s.start) * W
              ).toFixed(1)}" height="${H}" rx="3" fill="${col[s.kind]}" opacity=".55"/>`
          )
          .join("")
      : "";
    const marks = this._history
      ? [0, 0.25, 0.5, 0.75, 1]
          .map((f) => {
            const d = new Date(
              this._history.start + f * (this._history.end - this._history.start)
            );
            const a = f === 0 ? "start" : f === 1 ? "end" : "middle";
            return `<text x="${(f * W).toFixed(1)}" y="${H + 12}" fill="rgba(255,255,255,.28)"
              font-size="8" text-anchor="${a}">${String(d.getHours()).padStart(2, "0")}h</text>`;
          })
          .join("")
      : "";
    e.covSlot.innerHTML = `<svg class="cvb" viewBox="0 0 ${W} ${H + 15}" preserveAspectRatio="none">
      <rect width="${W}" height="${H}" rx="3" fill="rgba(255,255,255,.05)"/>${bars}${marks}</svg>`;
    if (e.covPct) e.covPct.textContent = cov ? `${Math.round(cov.pct * 100)} %` : "—";
  }

  _effectiveZones() { const d = this._discover(); return d ? d.zones : (this._config.zones || []); }
  _effectiveFire() { const d = this._discover(); return d ? d.fire : (this._config.fire || []); }
  _effectiveSensors() { const d = this._discover(); return d ? d.sensors : (this._config.sensors || []); }

  _renderZones() {
    const c = this._config;
    const e = this._els;
    if (!e.zones) return;
    const zones = this._effectiveZones();
    e.zones.innerHTML = zones
      .map((z, i) => {
        const s = this._st(z.entity);
        const dc = z.type || s?.attributes?.device_class || "door";
        const on = s?.state === "on";
        const name = z.name || s?.attributes?.friendly_name || z.entity;
        const label = on ? z.open_label || "Ouvert" : z.closed_label || "Fermé";
        return `<div class="zc${on ? " alert" : ""}" data-i="${i}">
          <svg viewBox="0 0 24 24">${ZONE_ICON[dc] || I.door}</svg>
          <div class="zt"><b>${esc(name)}</b><span>${esc(label)}</span></div></div>`;
      })
      .join("");
    e.zones.querySelectorAll(".zc").forEach((el) => {
      el.addEventListener("click", () => this._more(zones[Number(el.dataset.i)].entity));
    });
  }

  _renderFire() {
    const c = this._config;
    const fireList = this._effectiveFire();
    const e = this._els;
    if (!e.fireBody) return;
    let warn = false;
    const rows = fireList
      .map((f) => {
        const s = this._st(f.entity);
        if (!s) return "";
        const alert = s.state === "on";
        if (alert) warn = true;
        const name = f.name || s.attributes?.friendly_name || f.entity;
        const temp = this._num(f.temperature);
        const co = this._num(f.co);
        const dc = s.attributes?.device_class;
        const icon = dc === "carbon_monoxide" || dc === "gas" ? I.co : I.smoke;
        const state = alert
          ? f.alert_label || "Détection en cours"
          : [
              dc === "carbon_monoxide" ? "CO nominal" : "Aucune fumée",
              co != null ? `${this._fmt(co, 0)} ppm` : null,
            ]
              .filter(Boolean)
              .join(" · ");
        const test = this._st(f.last_test);
        return `<div class="fr${alert ? " warn" : ""}" data-e="${esc(f.entity)}">
          <svg viewBox="0 0 24 24">${icon}</svg>
          <div class="ft2"><b>${esc(name)}</b><span>${esc(state)}</span></div>
          <div class="fm"><b>${temp != null ? `${this._fmt(temp, 1)} °C` : "—"}</b>
            <span>${test ? `test ${this._ago(test.last_changed)}` : ""}</span></div></div>`;
      })
      .join("");
    e.fireBody.innerHTML = rows;
    e.fireBody.querySelectorAll(".fr").forEach((el) =>
      el.addEventListener("click", () => this._more(el.dataset.e))
    );
    e.fireAcc.classList.toggle("warn", warn);
    e.fireSum.textContent = warn
      ? "Alerte en cours"
      : `${c.fire.length} détecteur${c.fire.length > 1 ? "s" : ""} · nominaux`;
    if (warn && !e.fireAcc._forced) {
      e.fireAcc.open = true;
      e.fireAcc._forced = true;
    }
    if (!warn) e.fireAcc._forced = false;
  }

  _renderSensors() {
    const c = this._config;
    const sensorList = this._effectiveSensors();
    const e = this._els;
    if (!e.battBody) return;
    const items = sensorList
      .map((x) => {
        const s = this._st(x.entity);
        if (!s) return null;
        const pct = Number(s.state);
        const temp = this._num(x.temperature);
        return {
          name: x.name || s.attributes?.friendly_name || x.entity,
          pct: Number.isNaN(pct) ? null : pct,
          temp,
          entity: x.entity,
          warning: x.warning ?? c.battery_warning,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a.pct ?? 999) - (b.pct ?? 999));

    let warn = false;
    e.battBody.innerHTML = items
      .map((it) => {
        const bad = it.pct != null && it.pct <= it.warning;
        if (bad) warn = true;
        const col = bad ? "#ffc76b" : "#9ec2ff";
        return `<div class="br${bad ? " warn" : ""}" data-e="${esc(it.entity)}">
          <span class="bn2">${esc(it.name)}</span>
          <span class="bb"><i style="width:${Math.max(
            0,
            Math.min(100, it.pct ?? 0)
          )}%;background:${col}"></i></span>
          <span class="bp">${it.pct != null ? `${Math.round(it.pct)} %` : "—"}</span>
          <span class="btp">${it.temp != null ? `${this._fmt(it.temp, 1)} °C` : ""}</span></div>`;
      })
      .join("");
    e.battBody.querySelectorAll(".br").forEach((el) =>
      el.addEventListener("click", () => this._more(el.dataset.e))
    );

    const mins = items.filter((i) => i.pct != null).map((i) => i.pct);
    const temps = items.filter((i) => i.temp != null).map((i) => i.temp);
    const min = mins.length ? Math.min(...mins) : null;
    const avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    e.battAcc.classList.toggle("warn", warn);
    e.battSum.textContent = [
      min != null ? `min ${Math.round(min)} %` : null,
      avg != null ? `${this._fmt(avg, 1)} °C` : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }

  _update() {
    const c = this._config;
    const e = this._els;
    if (!this._hass || !this._built) return;

    const s = this._alarm();
    const mode = this._mode();
    const cd = mode === "exit" ? this._countdown() : null;

    this._startTick(mode === "exit" || s?.state === "pending");

    /* Classe d'état */
    e.card.className = `s-${mode}`;

    /* Ligne du haut */
    const stateLabels = {
      disarmed: "Désarmé",
      arming: "Armement en cours",
      pending: "Délai d'entrée",
      triggered: "Alarme",
      armed_away: "Armé · total",
      armed_home: "Armé · maison",
      armed_night: "Armé · nuit",
      armed_vacation: "Armé · vacances",
      unavailable: "Indisponible",
    };
    e.sysName.textContent = c.name;
    e.sysState.textContent = stateLabels[s?.state] || s?.state || "—";
    const dotColor = { off: "#7ee0a4", exit: "#ffc76b", armed: "#7fb3ff", alarm: "#ff6b5c" }[mode];
    e.dot.style.background = dotColor;
    e.dot.style.boxShadow = `0 0 8px ${dotColor}99`;

    /* Liaisons */
    e.links.innerHTML = c.links
      .map((l) => {
        const st = this._st(l.entity);
        let txt = l.label || st?.attributes?.friendly_name || "";
        const v = Number(st?.state);
        if (!Number.isNaN(v) && st) txt = `${Math.round(v)} %`;
        const bad = st && (st.state === "off" || st.state === "unavailable" || v <= 20);
        return `<span class="lk${bad ? " bad" : ""}">${esc(txt)}</span>`;
      })
      .join("");

    /* Anneau */
    const C = 2 * Math.PI * 81;
    let pct = 1;
    if (mode === "exit" && cd != null) pct = Math.max(0, cd / c.exit_delay);
    e.ringVal.setAttribute("stroke-dasharray", `${(C * pct).toFixed(1)} ${C.toFixed(1)}`);
    e.ringVal.setAttribute("stroke", dotColor);

    /* Centre */
    const icons = {
      off: I.shieldCheck,
      exit: I.shieldLock,
      armed: I.shieldLock,
      alarm: I.bell,
    };
    e.icon.innerHTML = icons[mode];
    e.word.className = mode === "exit" ? "word big" : "word";
    if (mode === "exit") e.word.textContent = String(cd ?? "");
    else if (mode === "alarm") e.word.textContent = "Alarme";
    else if (mode === "armed") e.word.textContent = "Armé";
    else e.word.textContent = "Désarmé";

    /* Sous-titre */
    const zones = this._effectiveZones();
    const open = zones.filter((z) => this._st(z.entity)?.state === "on");
    if (mode === "off") {
      e.sub.textContent = open.length
        ? `${open.length} zone${open.length > 1 ? "s" : ""} ouverte${open.length > 1 ? "s" : ""}`
        : "Prêt à armer · toutes les zones fermées";
    } else if (mode === "exit") {
      e.sub.textContent = "Délai de sortie · quittez les lieux";
    } else if (mode === "armed") {
      e.sub.textContent = `${stateLabels[s.state]} · ${zones.length} zone${
        c.zones.length > 1 ? "s" : ""
      } surveillée${c.zones.length > 1 ? "s" : ""}`;
    } else {
      const z = open[0];
      e.sub.textContent = z
        ? `Intrusion · ${z.name || z.entity} depuis ${this._ago(
            this._st(z.entity).last_changed
          )}`
        : `Alarme déclenchée · ${this._ago(s.last_changed)}`;
    }

    /* Segmenté */
    let active = c.modes.findIndex((m) => m.state === s?.state);
    if (active < 0) {
      if (mode === "off") active = 0;
      else active = c.modes.length - 1;
    }
    e.pill.style.left = `calc(${active} * (100% - 8px) / ${c.modes.length} + 4px)`;
    e.pill.style.width = `calc((100% - 8px) / ${c.modes.length})`;
    e.segw.querySelectorAll(".sgi").forEach((el, i) => el.classList.toggle("on", i === active));

    /* Actions contextuelles */
    const acts = [];
    if (mode === "exit")
      acts.push({ label: "Annuler", main: true, run: () => this._runService("alarm_disarm") });
    if (mode === "alarm") {
      acts.push({ label: "Désarmer", main: true, run: () => this._runService("alarm_disarm") });
      if (c.call_action)
        acts.push({
          label: c.call_label || "Appeler",
          run: () => {
            const d = domainOf(c.call_action);
            if (d === "script" || d === "automation") return; // sécurité : rejeter
            this._hass.callService(d, d === "button" || d === "input_button" ? "press" : "turn_on", {
              entity_id: c.call_action,
            });
          },
        });
    }
    e.actions.innerHTML = acts
      .map((a, i) => `<div class="ab${a.main ? " main" : ""}" data-i="${i}">${esc(a.label)}</div>`)
      .join("");
    e.actions.querySelectorAll(".ab").forEach((el) =>
      el.addEventListener("click", () => acts[Number(el.dataset.i)].run())
    );
    e.actions.classList.toggle("hidden", !acts.length);

    this._renderZones();
    this._renderFire();
    this._renderSensors();
    if (!this._history) this._renderCoverage();

    /* Dernier événement */
    if (s) {
      const who = s.attributes?.changed_by;
      e.ev.textContent = `${stateLabels[s.state] || s.state}${
        who ? ` par ${esc(who)}` : ""
      } · ${this._hhmm(new Date(s.last_changed))}`;
    }
  }
}

/* ------------------------------------------------------------------ */

AlarmModernCard.styles = `
:host{
  --am-bg:#12151c;
  --am-ok:#7ee0a4; --am-warn:#ffc76b; --am-armed:#7fb3ff; --am-alarm:#ff6b5c;
  display:block;
}
*{box-sizing:border-box;}
.hidden{display:none !important;}

ha-card{
  border-radius:var(--ha-card-border-radius,26px);
  padding:20px 18px 16px;position:relative;overflow:hidden;
  border:1px solid rgba(255,255,255,.07);background:var(--am-bg);
  color:#eef1f6;font-family:var(--primary-font-family,"Inter","Segoe UI",Roboto,sans-serif);
  transition:border-color .4s;
}
ha-card::after{content:"";position:absolute;left:20px;right:20px;top:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);}
.glow{position:absolute;inset:0;pointer-events:none;transition:.5s;}
.s-off .glow{background:radial-gradient(85% 55% at 50% 8%,rgba(126,224,164,.16),transparent 62%);}
.s-exit .glow{background:radial-gradient(85% 55% at 50% 8%,rgba(255,199,107,.20),transparent 62%);}
.s-armed .glow{background:radial-gradient(85% 55% at 50% 8%,rgba(127,179,255,.18),transparent 62%);}
.s-alarm{border-color:rgba(255,107,92,.4);}
.s-alarm .glow{background:radial-gradient(90% 60% at 50% 8%,rgba(255,107,92,.28),transparent 64%);
  animation:am-pulse 1.5s ease-in-out infinite;}
@keyframes am-pulse{0%,100%{opacity:.65}50%{opacity:1}}

.top{display:flex;align-items:center;justify-content:space-between;gap:8px;
  position:relative;z-index:1;}
.sys{display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:500;
  color:rgba(255,255,255,.55);min-width:0;}
.sys .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sys b{color:#eef1f6;font-weight:600;white-space:nowrap;}
.dl{width:6px;height:6px;border-radius:50%;background:#7ee0a4;flex-shrink:0;}
.links{display:flex;gap:5px;flex-shrink:0;}
.lk{font-size:9px;font-weight:600;letter-spacing:.8px;color:rgba(255,255,255,.5);
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);
  border-radius:7px;padding:3px 7px;white-space:nowrap;}
.lk.bad{color:var(--am-alarm);border-color:rgba(255,107,92,.34);background:rgba(255,107,92,.10);}

.stage{position:relative;width:176px;margin:22px auto 0;z-index:1;cursor:pointer;}
.ring{display:block;width:176px;height:176px;}
.ring .val{transition:stroke-dasharray .6s linear,stroke .4s;}
.center{position:absolute;inset:0;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:9px;pointer-events:none;}
.sh{width:26px;height:26px;fill:rgba(255,255,255,.72);}
.s-off .sh{fill:var(--am-ok);} .s-exit .sh{fill:var(--am-warn);}
.s-armed .sh{fill:var(--am-armed);} .s-alarm .sh{fill:var(--am-alarm);}
.word{font-size:29px;font-weight:300;letter-spacing:-1.2px;line-height:1;}
.word.big{font-size:52px;font-weight:200;letter-spacing:-3px;font-variant-numeric:tabular-nums;}
.sub{text-align:center;font-size:11.5px;color:rgba(255,255,255,.48);margin-top:14px;
  position:relative;z-index:1;}

.segw{position:relative;display:flex;margin-top:20px;padding:4px;border-radius:16px;
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);z-index:1;}
.pill{position:absolute;top:4px;bottom:4px;border-radius:13px;
  background:rgba(255,255,255,.13);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16),
  0 4px 14px rgba(0,0,0,.3);transition:left .32s cubic-bezier(.4,1.3,.5,1);}
.sgi{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;
  padding:11px 0 10px;cursor:pointer;transition:.2s;}
.sgi svg{width:16px;height:16px;fill:rgba(255,255,255,.42);transition:.2s;}
.sgi span{font-size:10px;font-weight:600;letter-spacing:.4px;color:rgba(255,255,255,.42);
  white-space:nowrap;}
.sgi.on svg{fill:#eef1f6;} .sgi.on span{color:#eef1f6;}

.act{display:flex;gap:8px;margin-top:10px;position:relative;z-index:1;}
.ab{flex:1;text-align:center;font-size:12.5px;font-weight:600;padding:13px 0;
  border-radius:14px;background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.10);color:rgba(255,255,255,.72);cursor:pointer;}
.ab.main{background:rgba(255,107,92,.16);border-color:rgba(255,107,92,.4);color:#ffb3aa;}
.s-exit .ab.main{background:rgba(255,199,107,.14);border-color:rgba(255,199,107,.36);
  color:#ffd9a0;}

.cov{margin-top:18px;position:relative;z-index:1;}
.covl{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:9px;}
.k{font-size:9px;letter-spacing:2px;text-transform:uppercase;
  color:rgba(255,255,255,.42);font-weight:600;}
.covr{display:flex;align-items:center;gap:5px;font-size:9px;color:rgba(255,255,255,.34);}
.covr i{width:9px;height:5px;border-radius:2px;display:inline-block;margin-left:4px;}
.covr .c1{background:var(--am-armed);} .covr .c2{background:var(--am-warn);}
.covr b{color:rgba(255,255,255,.62);font-weight:600;margin-left:5px;
  font-variant-numeric:tabular-nums;}
.cvb{display:block;width:100%;height:auto;}

.zones{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:17px;
  position:relative;z-index:1;}
.zc{display:flex;align-items:center;gap:9px;padding:10px 11px;border-radius:14px;
  background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07);
  min-width:0;cursor:pointer;transition:.15s;}
.zc:hover{background:rgba(255,255,255,.07);}
.zc svg{width:15px;height:15px;fill:rgba(255,255,255,.45);flex-shrink:0;}
.zt{min-width:0;}
.zt b{display:block;font-size:11.5px;font-weight:600;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.zt span{display:block;font-size:9.5px;color:rgba(255,255,255,.38);margin-top:1px;}
.zc.alert{background:rgba(255,107,92,.10);border-color:rgba(255,107,92,.34);}
.zc.alert svg{fill:var(--am-alarm);}
.zc.alert .zt span{color:#ff9b8f;}

.accs-wrap{display:flex;flex-direction:column;gap:7px;margin-top:14px;
  position:relative;z-index:1;}
.acc{border-radius:16px;background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.08);padding:0 13px;transition:.2s;}
.acc[open]{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);}
.acc.warn{background:rgba(255,199,107,.08);border-color:rgba(255,199,107,.26);}
.accs{display:flex;align-items:center;justify-content:space-between;gap:8px;
  padding:12px 0;cursor:pointer;list-style:none;}
.accs::-webkit-details-marker{display:none;}
.accv{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;
  color:rgba(255,255,255,.5);font-variant-numeric:tabular-nums;white-space:nowrap;}
.acc.warn .accv{color:var(--am-warn);}
.car{width:11px;height:11px;fill:rgba(255,255,255,.35);transition:transform .2s;}
.acc[open] .car{transform:rotate(180deg);}
.accb{padding:2px 0 12px;display:flex;flex-direction:column;gap:5px;}

.fr{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:12px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);cursor:pointer;}
.fr.warn{background:rgba(255,107,92,.10);border-color:rgba(255,107,92,.3);}
.fr svg{width:15px;height:15px;fill:rgba(255,255,255,.42);flex-shrink:0;}
.fr.warn svg{fill:var(--am-alarm);}
.ft2{flex:1;min-width:0;}
.ft2 b{display:block;font-size:11px;font-weight:600;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ft2 span{display:block;font-size:9.5px;color:rgba(255,255,255,.36);margin-top:1px;}
.fr.warn .ft2 span{color:#ff9b8f;}
.fm{text-align:right;flex-shrink:0;}
.fm b{display:block;font-size:12px;font-weight:600;font-variant-numeric:tabular-nums;}
.fm span{display:block;font-size:8.5px;color:rgba(255,255,255,.3);margin-top:2px;}

.br{display:flex;align-items:center;gap:9px;padding:6px 2px;cursor:pointer;}
.bn2{font-size:10.5px;color:rgba(255,255,255,.55);width:118px;flex-shrink:0;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.bb{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.09);overflow:hidden;}
.bb i{display:block;height:100%;border-radius:2px;opacity:.75;transition:width .3s;}
.bp{font-size:10px;font-weight:600;width:32px;text-align:right;
  color:rgba(255,255,255,.6);font-variant-numeric:tabular-nums;}
.br.warn .bp{color:var(--am-warn);}
.btp{font-size:10px;width:44px;text-align:right;color:rgba(255,255,255,.36);
  font-variant-numeric:tabular-nums;}

.ev{display:flex;align-items:center;gap:8px;margin-top:16px;padding-top:13px;
  border-top:1px solid rgba(255,255,255,.07);font-size:10.5px;
  color:rgba(255,255,255,.42);position:relative;z-index:1;}
.evd{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.3);flex-shrink:0;}

/* Clavier */
.padw{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;}
.padbg{position:absolute;inset:0;background:rgba(10,12,16,.86);backdrop-filter:blur(6px);}
.padc{position:relative;width:100%;padding:20px 18px;}
.padt{text-align:center;font-size:12.5px;font-weight:600;color:rgba(255,255,255,.7);}
.dots{display:flex;gap:11px;justify-content:center;margin-top:16px;}
.dots i{width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.16);transition:.15s;}
.dots i.on{background:#eef1f6;border-color:#eef1f6;box-shadow:0 0 12px rgba(238,241,246,.4);}
.pad{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:18px;}
.key{aspect-ratio:1.55;display:flex;align-items:center;justify-content:center;
  font-size:20px;border-radius:18px;cursor:pointer;transition:.15s;
  background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);
  color:#eef1f6;font-variant-numeric:tabular-nums;user-select:none;}
.key:hover{background:rgba(255,255,255,.1);}
.key:active{transform:scale(.96);}
.key.ghost{font-size:14px;color:rgba(255,255,255,.45);}
.key.ok{font-size:14px;font-weight:600;background:rgba(127,179,255,.16);
  border-color:rgba(127,179,255,.36);color:#bcd8ff;}
.padclose{margin-top:14px;text-align:center;font-size:11px;font-weight:600;
  color:rgba(255,255,255,.42);cursor:pointer;}
`;

/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/* Éditeur visuel                                                      */
/* ------------------------------------------------------------------ */

const FLAT_KEYS = [
  "name","alarm","auto_discover","hours","custom_zones","custom_fire","custom_sensors","refresh","exit_delay","entry_delay",
  "show_coverage","show_zones","battery_warning","code_required",
  "call_action","call_label",
];
const MANAGED_KEYS = [...FLAT_KEYS, "type", "zones", "fire", "sensors", "links", "modes", "custom_zones", "custom_fire", "custom_sensors"];

const LABELS = {
  name: "Nom", alarm: "Entité d'alarme",
  auto_discover: "Découverte automatique",
  hours: "Fenêtre de couverture", refresh: "Relecture",
  exit_delay: "Délai de sortie", entry_delay: "Délai d'entrée",
  show_coverage: "Afficher la couverture", show_zones: "Afficher les zones",
  battery_warning: "Seuil batterie faible",
  code_required: "Code requis pour armer",
  call_action: "Action d'appel (bouton)", call_label: "Libellé du bouton d'appel",
};

const HELPERS = {
  alarm: "Entité alarm_control_panel principale.",
  auto_discover: "Détecte automatiquement tous les capteurs rattachés au même appareil. La config explicite prime sur la découverte.",
  exit_delay: "Durée du délai de sortie en secondes, pour le compte à rebours de l'anneau.",
  entry_delay: "Durée du délai d'entrée en secondes.",
  code_required: "Si non défini, la carte détecte automatiquement via code_format et code_arm_required.",
  call_action: "Bouton ou script à déclencher en cas d'alarme. script.* et automation.* sont rejetés pour la sécurité.",
  custom_zones: "Entités d'ouvrants à ajouter aux zones (portillon, porte garage, volet, etc.). Découvertes automatiquement si auto_discover est activé, mais vous pouvez en ajouter d'autres ici.",
  custom_fire: "Détecteurs de fumée ou chaleur supplémentaires.",
  custom_sensors: "Capteurs de batterie supplémentaires à afficher dans le bloc repliable.",
};

const SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "alarm", selector: { entity: { filter: [{ domain: "alarm_control_panel" }] } } },
  { name: "auto_discover", selector: { boolean: {} } },
  {
    type: "grid", name: "",
    schema: [
      { name: "exit_delay", selector: { number: { min: 0, max: 300, mode: "box", unit_of_measurement: "s" } } },
      { name: "entry_delay", selector: { number: { min: 0, max: 300, mode: "box", unit_of_measurement: "s" } } },
      { name: "battery_warning", selector: { number: { min: 5, max: 90, mode: "box", unit_of_measurement: "%" } } },
      { name: "hours", selector: { number: { min: 1, max: 168, mode: "box", unit_of_measurement: "h" } } },
    ],
  },
  { name: "show_coverage", selector: { boolean: {} } },
  { name: "show_zones", selector: { boolean: {} } },
  {
    type: "expandable", name: "", title: "Ouvrants et capteurs supplémentaires", icon: "mdi:plus-circle-outline",
    schema: [
      { name: "custom_zones", selector: { entity: { multiple: true, filter: [{ domain: "binary_sensor", device_class: ["door", "window", "opening", "garage_door", "gate", "blind", "shutter", "awning"] }] } } },
      { name: "custom_fire", selector: { entity: { multiple: true, filter: [{ domain: "binary_sensor", device_class: ["smoke", "heat", "carbon_monoxide", "gas"] }] } } },
      { name: "custom_sensors", selector: { entity: { multiple: true, filter: [{ domain: "sensor", device_class: "battery" }] } } },
    ],
  },
  { name: "code_required", selector: { boolean: {} } },
  { name: "call_action", selector: { entity: { filter: [{ domain: ["button", "input_button", "script"] }] } } },
  { name: "call_label", selector: { text: {} } },
];

class AlarmModernCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
  }
  setConfig(config) { this._config = config ? { ...config } : {}; this._render(); }
  set hass(hass) { this._hass = hass; if (this._form) this._form.hass = hass; this._render(); }
  connectedCallback() { ensureHaForm().then(() => this._render()); }
  _data() {
    const c = this._config || {}; const d = {};
    FLAT_KEYS.forEach((k) => { if (c[k] !== undefined) d[k] = c[k]; });
    // Remplir custom_* avec les entity_id deja presentes dans zones/fire/sensors
    // pour que l'utilisateur voie ce qui est configure
    d.custom_zones = (c.zones || []).map((z) => z.entity);
    d.custom_fire = (c.fire || []).map((f) => f.entity);
    d.custom_sensors = (c.sensors || []).map((s) => s.entity);
    return d;
  }
  _merge(v) {
    const out = { ...this._config };
    FLAT_KEYS.forEach((k) => {
      const val = v[k];
      if (val === "" || val === undefined || val === null) delete out[k];
      else out[k] = val;
    });
    // Convertir les listes d'entity_id en entrees zones/fire/sensors
    const known = (key) => new Set((out[key] || []).map((x) => x.entity));
    if (Array.isArray(v.custom_zones)) {
      const existing = known("zones");
      const zones = [...(out.zones || [])];
      for (const id of v.custom_zones) {
        if (!existing.has(id)) {
          const st = this._hass?.states?.[id];
          const dc = st?.attributes?.device_class;
          zones.push({ entity: id, type: dc === "window" ? "window" : "door" });
          existing.add(id);
        }
      }
      out.zones = zones;
      delete out.custom_zones;
    }
    if (Array.isArray(v.custom_fire)) {
      const existing = known("fire");
      const fire = [...(out.fire || [])];
      for (const id of v.custom_fire) {
        if (!existing.has(id)) { fire.push({ entity: id }); existing.add(id); }
      }
      out.fire = fire;
      delete out.custom_fire;
    }
    if (Array.isArray(v.custom_sensors)) {
      const existing = known("sensors");
      const sensors = [...(out.sensors || [])];
      for (const id of v.custom_sensors) {
        if (!existing.has(id)) { sensors.push({ entity: id }); existing.add(id); }
      }
      out.sensors = sensors;
      delete out.custom_sensors;
    }
    return out;
  }
  _unmanaged() {
    const extra = Object.keys(this._config || {}).filter((k) => !MANAGED_KEYS.includes(k));
    if (Array.isArray(this._config.zones) && this._config.zones.length) extra.push("zones (noms et types)");
    if (Array.isArray(this._config.fire) && this._config.fire.length) extra.push("fire (noms et temp)");
    if (Array.isArray(this._config.sensors) && this._config.sensors.length) extra.push("sensors (noms et temp)");
    if (Array.isArray(this._config.links) && this._config.links.length) extra.push("links");
    if (Array.isArray(this._config.modes) && this._config.modes.length) extra.push("modes");
    return extra;
  }
  _render() {
    if (!this.shadowRoot) return;
    if (!customElements.get("ha-form")) {
      this.shadowRoot.innerHTML = `<style>${AlarmModernCardEditor.styles}</style>
        <div class="warn">Le composant <code>ha-form</code> n'a pas pu être chargé.</div>`;
      return;
    }
    if (!this._form) {
      this.shadowRoot.innerHTML = `<style>${AlarmModernCardEditor.styles}</style>
        <div class="wrap"></div><div class="note"></div>`;
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => LABELS[s.name] || s.name;
      this._form.computeHelper = (s) => HELPERS[s.name] || "";
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        fireEvent(this, "config-changed", { config: this._merge(ev.detail.value) });
      });
      this.shadowRoot.querySelector(".wrap").appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = SCHEMA;
    this._form.data = this._data();
    const extra = this._unmanaged();
    const note = this.shadowRoot.querySelector(".note");
    if (extra.length) {
      note.innerHTML = `<div class="keep">Conservé sans être éditable ici : <b></b>. Passez par l'éditeur YAML.</div>`;
      note.querySelector("b").textContent = extra.join(", ");
    } else note.innerHTML = "";
  }
}

AlarmModernCardEditor.styles = `
:host{display:block;}
.warn{padding:10px;border-radius:8px;background:var(--warning-color,#dfb37a);color:#1c1c1c;font-size:12px;}
.keep{margin-top:12px;padding:10px;border-radius:8px;background:rgba(143,176,201,.16);border:1px solid rgba(143,176,201,.4);font-size:12px;}
code{font-family:monospace;}
`;

if (!customElements.get("alarm-modern-card-editor")) {
  customElements.define("alarm-modern-card-editor", AlarmModernCardEditor);
}

if (!customElements.get("alarm-modern-card")) {
  customElements.define("alarm-modern-card", AlarmModernCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "alarm-modern-card",
  name: "Alarm Modern Card",
  description:
    "Carte d'alarme moderne : anneau d'état, couverture d'armement, zones et catégories repliables.",
  preview: true,
  documentationURL: "https://github.com/junkoku38/alarm-modern-card",
});