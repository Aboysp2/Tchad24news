// ========== Translations (UI strings) ==========
const T = {
  fr: {
    appName: "Tchad24News",
    breaking: "DERNIÈRE HEURE",
    all: "Tous",
    politics: "Politique",
    economy: "Économie",
    society: "Société",
    sport: "Sport",
    international: "International",
    security: "Sécurité",
    health: "Santé",
    culture: "Culture",
    loading: "Chargement des actualités...",
    error: "Impossible de charger les actualités",
    retry: "Réessayer",
    noNews: "Aucune actualité pour le moment",
    offline: "Mode hors ligne – données en cache",
    justNow: "À l'instant",
    minAgo: "il y a {n} min",
    hAgo: "il y a {n} h",
  },
  ar: {
    appName: "تشاد24نيوز",
    breaking: "عاجل",
    all: "الكل",
    politics: "سياسة",
    economy: "اقتصاد",
    society: "مجتمع",
    sport: "رياضة",
    international: "دولي",
    security: "أمن",
    health: "صحة",
    culture: "ثقافة",
    loading: "جاري تحميل الأخبار...",
    error: "تعذر تحميل الأخبار",
    retry: "إعادة المحاولة",
    noNews: "لا توجد أخبار حالياً",
    offline: "وضع عدم الاتصال – بيانات مخزنة",
    justNow: "الآن",
    minAgo: "منذ {n} د",
    hAgo: "منذ {n} س",
  },
  en: {
    appName: "Tchad24News",
    breaking: "BREAKING",
    all: "All",
    politics: "Politics",
    economy: "Economy",
    society: "Society",
    sport: "Sport",
    international: "International",
    security: "Security",
    health: "Health",
    culture: "Culture",
    loading: "Loading news...",
    error: "Failed to load news",
    retry: "Retry",
    noNews: "No news at the moment",
    offline: "Offline mode – cached data",
    justNow: "Just now",
    minAgo: "{n} min ago",
    hAgo: "{n} h ago",
  },
};

const CATEGORIES = [
  { id: "all", key: "all" },
  { id: "politics", key: "politics" },
  { id: "economy", key: "economy" },
  { id: "society", key: "society" },
  { id: "security", key: "security" },
  { id: "health", key: "health" },
  { id: "sport", key: "sport" },
  { id: "international", key: "international" },
  { id: "culture", key: "culture" },
];

// ========== State ==========
let lang = localStorage.getItem("tn_lang") || "fr";
let theme = localStorage.getItem("tn_theme") || "system";
let stories = [];        // always stored in original (source) language: French
let activeCat = "all";
let isLoading = false;
let translationCache = loadTranslationCache(); // { "ar:<id>:title": "...", ... }
const inFlightTranslations = new Set();

// ========== RSS Sources (all publish in French) ==========
const SOURCE_LANG = "fr";
const SOURCES = [
  { name: "Tchadinfos", url: "https://tchadinfos.com/feed/" },
  { name: "Alwihda Info", url: "https://www.alwihdainfo.com/rss/" },
  { name: "Journal du Tchad", url: "https://journaldutchad.com/feed/" },
];

// CORS proxies tried in a race — whichever answers first wins, which keeps
// things fast even if one proxy is slow or temporarily down.
const PROXIES = [
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

function t(key) {
  return (T[lang] && T[lang][key]) || T.fr[key] || key;
}

function applyLang() {
  const isRTL = lang === "ar";
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";

  const nameEl = document.getElementById("appName");
  if (nameEl) nameEl.textContent = t("appName");

  const breakLabel = document.getElementById("breakingLabel");
  if (breakLabel) breakLabel.textContent = t("breaking");

  const offline = document.getElementById("offlineBar");
  if (offline) offline.textContent = t("offline");

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  document.title = t("appName");
  renderCategories();
  renderNews();
}

function applyTheme() {
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  const btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = isDark ? "☀️" : "🌙";
}

function relativeTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return t("justNow");
  if (mins < 60) return t("minAgo").replace("{n}", mins);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("hAgo").replace("{n}", hours);
  return new Date(iso).toLocaleDateString(lang === "ar" ? "ar" : lang);
}

function guessCategory(text) {
  const s = (text || "").toLowerCase();
  if (/politiqu|gouvernement|président|ministre|élection|assemblée|parti/.test(s)) return "politics";
  if (/économ|financ|budget|pétrole|banque|marché|commerce/.test(s)) return "economy";
  if (/sécurit|armée|attaque|terror|boko|militaire|défense/.test(s)) return "security";
  if (/santé|hôpital|épidémie|choléra|vaccin|médecin/.test(s)) return "health";
  if (/sport|football|match|équipe|champion/.test(s)) return "sport";
  if (/culture|art|musique|festival|cinéma/.test(s)) return "culture";
  if (/international|france|soudan|onu|afrique|niger|mali/.test(s)) return "international";
  return "society";
}

function decode(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html || "";
  return txt.value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseRSS(xml, sourceName) {
  const items = [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    if (doc.querySelector("parsererror")) return items;
    const nodes = doc.querySelectorAll("item");
    nodes.forEach((node) => {
      const title = node.querySelector("title")?.textContent?.trim();
      const link =
        node.querySelector("link")?.textContent?.trim() ||
        node.querySelector("guid")?.textContent?.trim();
      const desc = node.querySelector("description")?.textContent || "";
      const pub = node.querySelector("pubDate")?.textContent;
      let image = null;
      const enclosure = node.querySelector("enclosure");
      if (enclosure && enclosure.getAttribute("type")?.startsWith("image")) {
        image = enclosure.getAttribute("url");
      }
      if (!image) {
        const media = node.getElementsByTagName("media:content")[0];
        if (media) image = media.getAttribute("url");
      }
      if (!image) {
        const m = desc.match(/src=["']([^"']+)["']/i);
        if (m) image = m[1];
      }
      if (title && link) {
        const id = link;
        items.push({
          id,
          title: decode(title),
          description: decode(desc).slice(0, 180),
          url: link,
          image,
          source: sourceName,
          publishedAt: pub ? new Date(pub).toISOString() : new Date().toISOString(),
          category: guessCategory(title + " " + desc),
        });
      }
    });
  } catch (e) {
    console.warn("Parse error", sourceName, e);
  }
  return items;
}

// Races all proxies for one URL, returns the first successful response text.
function fetchViaProxyRace(url, timeoutMs = 9000) {
  const attempts = PROXIES.map((buildUrl) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(buildUrl(url), { signal: controller.signal })
      .then((res) => {
        clearTimeout(timer);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then((text) => {
        if (!text || text.length < 50) throw new Error("empty response");
        return text;
      })
      .catch((err) => {
        clearTimeout(timer);
        throw err;
      });
  });
  return Promise.any(attempts);
}

async function fetchNews() {
  if (isLoading) return;
  isLoading = true;
  setRefreshSpinning(true);

  const list = document.getElementById("newsList");
  if (stories.length === 0) {
    list.innerHTML = `<div class="loading"><div class="spinner"></div>${t("loading")}</div>`;
  }
  document.getElementById("offlineBar").classList.add("hidden");

  const promises = SOURCES.map(async (src) => {
    try {
      const xml = await fetchViaProxyRace(src.url);
      return parseRSS(xml, src.name);
    } catch (e) {
      console.warn("Failed", src.name, e && e.message);
      return [];
    }
  });

  const results = await Promise.allSettled(promises);
  let all = [];
  results.forEach((r) => {
    if (r.status === "fulfilled") all = all.concat(r.value);
  });

  const seen = new Set();
  const unique = [];
  all.forEach((item) => {
    const key = item.title.toLowerCase().replace(/[^\w\u0600-\u06FF]/g, "").slice(0, 40);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  });

  unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  if (unique.length > 0) {
    stories = unique;
    try {
      localStorage.setItem("tn_cache", JSON.stringify(unique.slice(0, 80)));
      localStorage.setItem("tn_cache_time", Date.now().toString());
    } catch (e) {}
    renderNews();
  } else if (stories.length === 0) {
    try {
      const cache = localStorage.getItem("tn_cache");
      if (cache) {
        stories = JSON.parse(cache);
        document.getElementById("offlineBar").classList.remove("hidden");
        renderNews();
      } else {
        list.innerHTML = `<div class="error">${t("error")}<br>
          <button onclick="fetchNews()" style="margin-top:12px;padding:8px 18px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">${t("retry")}</button></div>`;
      }
    } catch (e) {
      list.innerHTML = `<div class="error">${t("error")}</div>`;
    }
  }
  isLoading = false;
  setRefreshSpinning(false);
}

function setRefreshSpinning(spinning) {
  const btn = document.getElementById("refreshBtn");
  if (btn) btn.classList.toggle("spinning", spinning);
}

// ========== Live translation of news content (MyMemory API) ==========
function loadTranslationCache() {
  try {
    const raw = localStorage.getItem("tn_translations");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveTranslationCache() {
  try {
    // Keep the cache from growing forever.
    const keys = Object.keys(translationCache);
    if (keys.length > 1500) {
      const trimmed = {};
      keys.slice(keys.length - 1200).forEach((k) => (trimmed[k] = translationCache[k]));
      translationCache = trimmed;
    }
    localStorage.setItem("tn_translations", JSON.stringify(translationCache));
  } catch (e) {}
}

async function translateOne(text, targetLang) {
  if (!text) return text;
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${SOURCE_LANG}|${targetLang}`
  );
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (!translated || /INVALID|MYMEMORY WARNING/i.test(translated)) {
    throw new Error("bad translation");
  }
  return translated;
}

// Translates title+description for one story and updates the DOM/cache in place.
async function translateStoryIntoView(item) {
  if (lang === SOURCE_LANG) return; // nothing to do, source is already French
  const titleKey = `${lang}:${item.id}:title`;
  const descKey = `${lang}:${item.id}:desc`;
  const card = document.querySelector(`.card[data-id="${cssEscape(item.id)}"]`);

  if (translationCache[titleKey] && translationCache[descKey]) {
    if (card) {
      card.querySelector(".card-title").textContent = translationCache[titleKey];
      const d = card.querySelector(".card-desc");
      if (d) d.textContent = translationCache[descKey];
    }
    return;
  }

  const jobKey = titleKey;
  if (inFlightTranslations.has(jobKey)) return;
  inFlightTranslations.add(jobKey);
  if (card) card.classList.add("translating");

  try {
    const [title, desc] = await Promise.all([
      translateOne(item.title, lang),
      item.description ? translateOne(item.description, lang) : Promise.resolve(""),
    ]);
    translationCache[titleKey] = title;
    translationCache[descKey] = desc;
    saveTranslationCache();

    const stillActiveCard = document.querySelector(`.card[data-id="${cssEscape(item.id)}"]`);
    if (stillActiveCard && lang !== SOURCE_LANG) {
      stillActiveCard.querySelector(".card-title").textContent = title;
      const d = stillActiveCard.querySelector(".card-desc");
      if (d) d.textContent = desc;
    }
  } catch (e) {
    console.warn("Translation failed for", item.id, e && e.message);
  } finally {
    inFlightTranslations.delete(jobKey);
    if (card) card.classList.remove("translating");
  }
}

// Translates the currently visible batch with limited concurrency so the UI stays fast.
function translateVisible(items) {
  if (lang === SOURCE_LANG) return;
  const CONCURRENCY = 4;
  let idx = 0;
  function next() {
    if (idx >= items.length) return;
    const item = items[idx++];
    translateStoryIntoView(item).finally(next);
  }
  for (let i = 0; i < CONCURRENCY; i++) next();
}

function cssEscape(str) {
  return String(str).replace(/["\\]/g, "\\$&");
}

function displayTextFor(item, field) {
  if (lang === SOURCE_LANG) return item[field];
  const key = `${lang}:${item.id}:${field === "title" ? "title" : "desc"}`;
  return translationCache[key] || item[field];
}

function renderCategories() {
  const el = document.getElementById("categories");
  if (!el) return;
  el.innerHTML = CATEGORIES.map(
    (c) =>
      `<button class="cat-btn ${activeCat === c.id ? "active" : ""}" data-cat="${c.id}">${t(c.key)}</button>`
  ).join("");

  el.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.onclick = () => {
      activeCat = btn.dataset.cat;
      renderCategories();
      renderNews();
    };
  });
}

function renderNews() {
  const list = document.getElementById("newsList");
  if (!list) return;

  let data = activeCat === "all" ? stories : stories.filter((s) => s.category === activeCat);

  const breaking = document.getElementById("breaking");
  if (stories.length > 0) {
    document.getElementById("breakingTitle").textContent = displayTextFor(stories[0], "title");
    breaking.classList.remove("hidden");
  } else {
    breaking.classList.add("hidden");
  }

  if (data.length === 0) {
    list.innerHTML = `<div class="empty">${t("noNews")}</div>`;
    return;
  }

  list.innerHTML = data
    .map(
      (item) => `
    <a class="card" data-id="${cssEscape(item.id)}" href="${item.url}" target="_blank" rel="noopener">
      ${
        item.image
          ? `<img class="card-img" src="${item.image}" alt="" loading="lazy" onerror="this.outerHTML='<div class=\\'card-img\\'>🇹🇩</div>'" />`
          : `<div class="card-img">🇹🇩</div>`
      }
      <div class="card-body">
        <div class="card-title">${displayTextFor(item, "title")}</div>
        ${item.description ? `<div class="card-desc">${displayTextFor(item, "desc")}</div>` : ""}
        <div class="card-meta">
          <span class="card-source">${item.source}</span>
          <span class="card-time">${relativeTime(item.publishedAt)}</span>
        </div>
      </div>
    </a>`
    )
    .join("");

  // Translate the currently visible cards + the breaking headline in the background.
  translateVisible(data.slice(0, 40));
  if (stories.length > 0) translateStoryIntoView(stories[0]).then(() => {
    if (lang !== SOURCE_LANG) {
      const key = `${lang}:${stories[0].id}:title`;
      if (translationCache[key]) document.getElementById("breakingTitle").textContent = translationCache[key];
    }
  });
}

function setupEvents() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.onclick = () => {
      lang = btn.dataset.lang;
      localStorage.setItem("tn_lang", lang);
      applyLang();
    };
  });

  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.onclick = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      theme = isDark ? "light" : "dark";
      localStorage.setItem("tn_theme", theme);
      applyTheme();
    };
  }

  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.onclick = () => fetchNews();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  applyTheme();

  // Show cached stories instantly (fast first paint) while a fresh fetch runs in background.
  try {
    const cache = localStorage.getItem("tn_cache");
    if (cache) stories = JSON.parse(cache);
  } catch (e) {}

  applyLang();
  fetchNews();
});

setInterval(fetchNews, 12 * 60 * 1000);
