// ========== Translations ==========
const T = {
  fr: {
    appName: "TchadNews",
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
    appName: "تشاد نيوز",
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
    appName: "TchadNews",
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
let stories = [];
let activeCat = "all";

// ========== RSS Sources ==========
const SOURCES = [
  { name: "Tchadinfos", url: "https://tchadinfos.com/feed/" },
  { name: "Alwihda Info", url: "https://www.alwihdainfo.com/rss/" },
  { name: "Journal du Tchad", url: "https://journaldutchad.com/feed/" },
];

// ========== Helpers ==========
function t(key) {
  return (T[lang] && T[lang][key]) || T.fr[key] || key;
}

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.getElementById("appName").textContent = t("appName");
  document.getElementById("breakingLabel").textContent = t("breaking");
  document.getElementById("offlineBar").textContent = t("offline");

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  renderCategories();
  renderNews();
}

function applyTheme() {
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.getElementById("themeBtn").textContent = isDark ? "☀️" : "🌙";
}

function relativeTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return t("justNow");
  if (mins < 60) return t("minAgo").replace("{n}", mins);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("hAgo").replace("{n}", hours);
  return new Date(iso).toLocaleDateString();
}

function guessCategory(text) {
  const s = (text || "").toLowerCase();
  if (/politiqu|gouvernement|président|ministre|élection/.test(s)) return "politics";
  if (/économ|financ|budget|pétrole|banque/.test(s)) return "economy";
  if (/sécurit|armée|attaque|terror|boko|militaire/.test(s)) return "security";
  if (/santé|hôpital|épidémie|choléra|vaccin/.test(s)) return "health";
  if (/sport|football|match|équipe/.test(s)) return "sport";
  if (/culture|art|musique|festival/.test(s)) return "culture";
  if (/international|france|soudan|onu|afrique/.test(s)) return "international";
  return "society";
}

function decode(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html || "";
  return txt.value.replace(/<[^>]+>/g, " ").trim();
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
      const media = node.querySelector("media\\:content, content");
      if (media) image = media.getAttribute("url");
      if (!image) {
        const m = desc.match(/src=["']([^"']+)["']/i);
        if (m) image = m[1];
      }
      if (title && link) {
        items.push({
          id: link,
          title: decode(title),
          description: decode(desc).slice(0, 200),
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

// ========== Fetch News ==========
async function fetchNews() {
  const list = document.getElementById("newsList");
  list.innerHTML = `<div class="loading">${t("loading")}</div>`;
  document.getElementById("offlineBar").classList.add("hidden");

  let all = [];
  const promises = SOURCES.map(async (src) => {
    try {
      const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(src.url)}`;
      const res = await fetch(proxy, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error(res.status);
      const xml = await res.text();
      return parseRSS(xml, src.name);
    } catch (e) {
      console.warn("Failed", src.name, e.message);
      return [];
    }
  });

  const results = await Promise.allSettled(promises);
  results.forEach((r) => {
    if (r.status === "fulfilled") all = all.concat(r.value);
  });

  // Dedup
  const seen = new Set();
  const unique = [];
  all.forEach((item) => {
    const key = item.title.toLowerCase().slice(0, 50);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  });

  unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  if (unique.length > 0) {
    stories = unique;
    localStorage.setItem("tn_cache", JSON.stringify(unique));
    localStorage.setItem("tn_cache_time", Date.now().toString());
    renderNews();
  } else {
    const cache = localStorage.getItem("tn_cache");
    if (cache) {
      stories = JSON.parse(cache);
      document.getElementById("offlineBar").classList.remove("hidden");
      renderNews();
    } else {
      list.innerHTML = `<div class="error">${t("error")}<br><button onclick="fetchNews()" style="margin-top:12px;padding:8px 16px;background:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer">${t("retry")}</button></div>`;
    }
  }
}

// ========== Render ==========
function renderCategories() {
  const el = document.getElementById("categories");
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

// ========== Events ==========
document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.onclick = () => {
    lang = btn.dataset.lang;
    localStorage.setItem("tn_lang", lang);
    applyLang();
  };
});

document.getElementById("themeBtn").onclick = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  theme = isDark ? "light" : "dark";
  localStorage.setItem("tn_theme", theme);
  applyTheme();
};

// ========== Init ==========
applyTheme();
applyLang();
fetchNews();

// Auto refresh every 10 minutes
setInterval(fetchNews, 10 * 60 * 1000);
