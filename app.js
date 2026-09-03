// App State
let currentLang = 'ar';
let currentCategory = 'tchad';
const translationCache = JSON.parse(localStorage.getItem('trans_cache') || '{}');

// RSS Feeds Configuration (Optimized fast feeds)
const FEEDS = {
  tchad: [
    "https://tchadinfos.com/feed/",
    "https://tchadone.com/feed/",
    "https://www.alwihdainfo.com/xml/rss2.xml"
  ],
  africa: [
    "https://www.africanews.com/feed/rss?lang=fr",
    "https://www.rfi.fr/fr/afrique/rss"
  ],
  world: [
    "https://www.france24.com/fr/rss",
    "https://arabic.rt.com/rss/"
  ]
};

// UI Translations & Titles
const UI_TEXT = {
  ar: { name: "تشاد24نيوز", breaking: "عاجل", offline: "وضع عدم الاتصال", tchad: "🇹🇩 تشاد", africa: "🌍 إفريقيا", world: "🌐 العالم", opinion: "✍️ مقالات الرأي", addArticle: "أنشر مقالك الآن", comments: "التعليقات" },
  fr: { name: "Tchad24News", breaking: "DERNIÈRE HEURE", offline: "Mode hors ligne", tchad: "🇹🇩 Tchad", africa: "🌍 Afrique", world: "🌐 Monde", opinion: "✍️ Articles", addArticle: "Publier un article", comments: "Commentaires" },
  en: { name: "Tchad24News", breaking: "BREAKING NEWS", offline: "Offline Mode", tchad: "🇹🇩 Chad", africa: "🌍 Africa", world: "🌐 World", opinion: "✍️ Articles", addArticle: "Publish Article", comments: "Comments" }
};

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  setupLanguage();
  setupEventListeners();
  loadCategory(currentCategory);
}

function setupLanguage() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentLang = e.target.dataset.lang;
      
      // Update HTML attributes
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      
      // Update Name & Navigation
      document.getElementById("appName").textContent = UI_TEXT[currentLang].name;
      document.getElementById("offlineBar").textContent = UI_TEXT[currentLang].offline;
      document.getElementById("breakingLabel").textContent = UI_TEXT[currentLang].breaking;
      
      loadCategory(currentCategory);
    });
  });
}

function setupEventListeners() {
  // Category switching
  document.getElementById("categories").addEventListener("click", (e) => {
    if (e.target.classList.contains("cat-btn")) {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentCategory = e.target.dataset.cat;
      loadCategory(currentCategory);
    }
  });

  // Refresh Button
  document.getElementById("refreshBtn").addEventListener("click", () => {
    loadCategory(currentCategory);
  });
}

async function loadCategory(cat) {
  const container = document.getElementById("newsList");
  container.innerHTML = `<div class="loading">جاري التحميل...</div>`;

  if (cat === 'opinion') {
    renderOpinionSection(container);
    return;
  }

  try {
    const urls = FEEDS[cat] || FEEDS.tchad;
    const fetchPromises = urls.map(url => 
      fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
        .then(res => res.json())
        .catch(() => ({ items: [] }))
    );

    const results = await Promise.all(fetchPromises);
    let allItems = [];
    results.forEach(res => {
      if (res.items) allItems = allItems.concat(res.items);
    });

    // Sort by Date
    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    if (allItems.length === 0) {
      container.innerHTML = `<p style="text-align:center; padding:20px;">لا توجد أخبـار حالياً.</p>`;
      return;
    }

    renderNewsList(allItems.slice(0, 25), container);
  } catch (err) {
    container.innerHTML = `<p style="text-align:center;">حدث خطأ أثناء تحميل الأخبار.</p>`;
  }
}

async function renderNewsList(items, container) {
  container.innerHTML = "";
  
  for (const item of items) {
    const card = document.createElement("article");
    card.className = "news-card";

    let title = item.title;
    let description = item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 130) + '...' : '';

    // Fast Translation Mechanism via local caching
    if (currentLang === 'ar' && !isArabic(title)) {
      title = await translateText(title, 'ar');
    }

    card.innerHTML = `
      <h3><a href="${item.link}" target="_blank" rel="noopener">${title}</a></h3>
      <p>${description}</p>
      <div class="meta">
        <span>${new Date(item.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        <a href="${item.link}" target="_blank">المزيد ↗</a>
      </div>
    `;
    container.appendChild(card);
  }
}

// Lightweight Translation Service with local Cache
async function translateText(text, targetLang) {
  const cacheKey = `${targetLang}_${text}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey];

  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 100))}&langpair=autodetect|${targetLang}`);
    const data = await res.json();
    if (data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      translationCache[cacheKey] = translated;
      localStorage.setItem('trans_cache', JSON.stringify(translationCache));
      return translated;
    }
  } catch (e) {
    return text;
  }
  return text;
}

function isArabic(text) {
  const pattern = /[\u0600-\u06FF]/;
  return pattern.test(text);
}

// Open Writer Platform & Comment Section
function renderOpinionSection(container) {
  const articles = JSON.parse(localStorage.getItem("user_articles") || "[]");
  
  let html = `
    <div class="opinion-form" style="background:#fff; padding:15px; border-radius:8px; margin-bottom:20px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin-top:0;">${UI_TEXT[currentLang].addArticle}</h3>
      <input type="text" id="authorName" placeholder="اسم الكاتب / Nom" style="width:100%; padding:8px; margin-bottom:10px; box-sizing:border-box;">
      <input type="text" id="articleTitle" placeholder="عنوان المقال / Titre" style="width:100%; padding:8px; margin-bottom:10px; box-sizing:border-box;">
      <textarea id="articleContent" rows="4" placeholder="اكتب مقالك هنا..." style="width:100%; padding:8px; margin-bottom:10px; box-sizing:border-box;"></textarea>
      <button onclick="publishArticle()" style="background:#002664; color:#fff; border:none; padding:10px 15px; border-radius:4px; cursor:pointer;">نشر المقال</button>
    </div>
    <div id="articlesList"></div>
  `;

  container.innerHTML = html;
  displayUserArticles();
}

window.publishArticle = function() {
  const author = document.getElementById("authorName").value.trim();
  const title = document.getElementById("articleTitle").value.trim();
  const content = document.getElementById("articleContent").value.trim();

  if (!author || !title || !content) {
    alert("يرجى ملء جميع الحقول المطلوبة.");
    return;
  }

  const articles = JSON.parse(localStorage.getItem("user_articles") || "[]");
  const newArticle = {
    id: Date.now(),
    author,
    title,
    content,
    date: new Date().toLocaleDateString(),
    comments: []
  };

  articles.unshift(newArticle);
  localStorage.setItem("user_articles", JSON.stringify(articles));
  renderOpinionSection(document.getElementById("newsList"));
};

function displayUserArticles() {
  const listContainer = document.getElementById("articlesList");
  const articles = JSON.parse(localStorage.getItem("user_articles") || "[]");

  if (articles.length === 0) {
    listContainer.innerHTML = `<p style="text-align:center; color:#666;">لا توجد مقالات منشورة بعد. كن أول من يكتب!</p>`;
    return;
  }

  listContainer.innerHTML = articles.map(art => `
    <article class="news-card" style="background:#fff; margin-bottom:15px; padding:15px; border-radius:8px;">
      <h3 style="margin:0 0 5px 0;">${art.title}</h3>
      <small style="color:#002664;">بقلم: <strong>${art.author}</strong> - ${art.date}</small>
      <p style="margin:10px 0;">${art.content}</p>
      
      <hr style="border:0; border-top:1px solid #eee; margin:10px 0;">
      
      <!-- Comments Section -->
      <div class="comments-section">
        <h4 style="margin:5px 0;">${UI_TEXT[currentLang].comments} (${art.comments ? art.comments.length : 0})</h4>
        <div id="comments-${art.id}">
          ${(art.comments || []).map(c => `<div style="background:#f9f9f9; padding:5px 8px; border-radius:4px; margin-bottom:5px;"><strong>${c.user}:</strong> ${c.text}</div>`).join('')}
        </div>
        <div style="display:flex; gap:5px; margin-top:8px;">
          <input type="text" id="input-comment-${art.id}" placeholder="اكتب تعليقاً..." style="flex:1; padding:5px;">
          <button onclick="addComment(${art.id})" style="background:#28a745; color:#fff; border:none; padding:5px 10px; border-radius:3px;">تعليق</button>
        </div>
      </div>
    </article>
  `).join('');
}

window.addComment = function(articleId) {
  const input = document.getElementById(`input-comment-${articleId}`);
  const text = input.value.trim();
  if (!text) return;

  const articles = JSON.parse(localStorage.getItem("user_articles") || "[]");
  const article = articles.find(a => a.id === articleId);
  
  if (article) {
    if (!article.comments) article.comments = [];
    article.comments.push({ user: "زائر", text: text });
    localStorage.setItem("user_articles", JSON.stringify(articles));
    displayUserArticles();
  }
};
