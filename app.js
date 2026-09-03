// ========== Translations ==========
const T = {
  fr: {
    appName: "Tchad24news",
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
    appName: "تنيوز",
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
    appName: "Tnews",
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
let lang = localStorage.getItem("tn_lang") || "ar";
let theme = localStorage.getItem("tn_theme") || "system";
let stories = [];
let activeCat = "all";
let isLoading = false;

// ========== RSS Sources ==========
const SOURCES = [
  { name: "Tchadinfos", url: "https://tchadinfos.com/feed/" },
  { name: "Alwihda Info", url: "https://www.alwihdainfo.com/rss/" },
  { name: "Journal du Tchad", url: "https://journaldutchad.com/feed/" },
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
        items.push({
          id: link,
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

async function fetchNews() {
  if (isLoading) return;
  isLoading = true;

  const list = document.getElementById("newsList");
  list.innerHTML = `<div class="loading">${t("loading")}</div>`;
  document.getElementById("offlineBar").classList.add("hidden");

  let all = [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const promises = SOURCES.map(async (src) => {
    try {
      const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(src.url)}`;
      const res = await fetch(proxy, { signal: controller.signal });
      if (!res.ok) throw new Error(res.status);
      const xml = await res.text();
      return parseRSS(xml, src.name);
    } catch (e) {
      console.warn("Failed", src.name, e.message);
      return [];
    }
  });

  try {
    const results = await Promise.allSettled(promises);
    clearTimeout(timeout);
    results.forEach((r) => {
      if (r.status === "fulfilled") all = all.concat(r.value);
    });
  } catch (e) {
    clearTimeout(timeout);
  }

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
      localStorage.setItem("tn_cache", JSON.stringify(unique.slice(0, 60)));
      localStorage.setItem("tn_cache_time", Date.now().toString());
    } catch (e) {}
    renderNews();
  } else {
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
    document.getElementById("breakingTitle").textContent = stories[0].title;
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
    <a class="card" href="${item.url}" target="_blank" rel="noopener">
      ${
        item.image
          ? `<img class="card-img" src="${item.image}" alt="" loading="lazy" onerror="this.outerHTML='<div class=\\'card-img\\'>🇹🇩</div>'" />`
          : `<div class="card-img">🇹🇩</div>`
      }
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        ${item.description ? `<div class="card-desc">${item.description}</div>` : ""}
        <div class="card-meta">
          <span class="card-source">${item.source}</span>
          <span class="card-time">${relativeTime(item.publishedAt)}</span>
        </div>
      </div>
    </a>`
    )
    .join("");
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
}

document.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  applyTheme();
  applyLang();
  fetchNews();
});

setInterval(fetchNews, 12 * 60 * 1000);

