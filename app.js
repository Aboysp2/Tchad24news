// App State
let currentLang = localStorage.getItem('app_lang') || 'ar';
let currentCategory = 'tchad';
let isAdmin = localStorage.getItem('is_admin') === 'true';
const ADMIN_PASSWORD = "1234";

const translationCache = JSON.parse(localStorage.getItem('trans_cache') || '{}');

// RSS Feeds Configuration
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

// UI Translations
const UI_TEXT = {
  ar: { name: "تشاد24نيوز", breaking: "عاجل", offline: "وضع عدم الاتصال - بيانات مخزنة", tchad: "🇹🇩 تشاد", africa: "🌍 إفريقيا", world: "🌐 العالم", opinion: "✍️ مقالات الرأي", addArticle: "أنشر مقالك الآن", comments: "التعليقات", more: "المزيد" },
  fr: { name: "Tchad24News", breaking: "DERNIÈRE HEURE", offline: "Mode hors ligne - données en cache", tchad: "🇹🇩 Tchad", africa: "🌍 Afrique", world: "🌐 Monde", opinion: "✍️ Articles", addArticle: "Publier un article", comments: "Commentaires", more: "En savoir plus" },
  en: { name: "Tchad24News", breaking: "BREAKING", offline: "Offline mode - cached data", tchad: "🇹🇩 Chad", africa: "🌍 Africa", world: "🌐 World", opinion: "✍️ Articles", addArticle: "Publish Article", comments: "Comments", more: "Read more" }
};

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  setupTheme();
  setupLanguage();
  setupEventListeners();
  loadBreakingNews();
  loadCategory(currentCategory);
}

// 🌙 Night Mode Setup
function setupTheme() {
  const savedTheme = localStorage.getItem('app_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('app_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function setupLanguage() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    if (btn.dataset.lang === currentLang) btn.classList.add("active");
    else btn.classList.remove("active");

    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentLang = e.target.dataset.lang;
      localStorage.setItem('app_lang', currentLang);
      
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      
      document.getElementById("appName").textContent = UI_TEXT[currentLang].name;
      document.getElementById("offlineBar").textContent = UI_TEXT[currentLang].offline;
      document.getElementById("breakingLabel").textContent = UI_TEXT[currentLang].breaking;
      
      loadBreakingNews();
      loadCategory(currentCategory);
    });
  });

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById("appName").textContent = UI_TEXT[currentLang].name;
}

function setupEventListeners() {
  document.getElementById("categories").addEventListener("click", (e) => {
    if (e.target.classList.contains("cat-btn")) {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentCategory = e.target.dataset.cat;
      loadCategory(currentCategory);
    }
  });

  document.getElementById("refreshBtn").addEventListener("click", () => {
    loadBreakingNews();
    loadCategory(currentCategory);
  });
}

// 🚨 Fetch Breaking News from Tchad, Africa, & World
async function loadBreakingNews() {
  const breakingContainer = document.getElementById("breakingTitle");
  const breakingBanner = document.getElementById("breaking");
  if (!breakingContainer) return;

  const sampleUrls = [FEEDS.tchad[0], FEEDS.africa[0], FEEDS.world[0]];
  try {
    const promises = sampleUrls.map(url =>
      fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
        .then(res => res.json())
        .catch(() => ({ items: [] }))
    );

    const results = await Promise.all(promises);
    let breakingItems = [];

    results.forEach((res, index) => {
      if (res.items && res.items.length > 0) {
        const prefix = index === 0 ? "🇹🇩 " : index === 1 ? "🌍 " : "🌐 ";
        breakingItems.push(prefix + res.items[0].title);
        if (res.items[1]) breakingItems.push(prefix + res.items[1].title);
      }
    });

    if (breakingItems.length > 0) {
      breakingContainer.textContent = breakingItems.join("  ///  ");
      breakingBanner.classList.remove("hidden");
    }
  } catch (err) {
    console.log("Breaking news error:", err);
  }
}

async function loadCategory(cat) {
  const container = document.getElementById("newsList");
  container.innerHTML = `<div class="loading"><div class="spinner"></div>جاري التحميل...</div>`;

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
      if (res.items) {
        res.items.forEach(item => {
          item.sourceName = res.feed ? res.feed.title || "TchadNews" : "TchadNews";
        });
        allItems = allItems.concat(res.items);
      }
    });

    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    if (allItems.length === 0) {
      container.innerHTML = `<p class="empty">لا توجد أخبار حالياً.</p>`;
      return;
    }

    renderNewsList(allItems.slice(0, 25), container);
  } catch (err) {
    container.innerHTML = `<p class="error">حدث خطأ أثناء تحميل الأخبار.</p>`;
  }
}

// 📰 Formatted Card List Output
async function renderNewsList(items, container) {
  container.innerHTML = "";
  
  for (const item of items) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = item.link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    let title = item.title;
    let description = item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 110) + '...' : '';

    if (currentLang === 'ar' && !isArabic(title)) {
      title = await translateText(title, 'ar');
    }

    const timeAgo = getTimeAgo(new Date(item.pubDate));
    const imgSrc = item.thumbnail || item.enclosure?.link;
    const imgHTML = imgSrc 
      ? `<img class="card-img" src="${imgSrc}" alt="news" onerror="this.outerHTML='<div class=\\'card-img\\'>🇹🇩</div>'">` 
      : `<div class="card-img">🇹🇩</div>`;

    card.innerHTML = `
      ${imgHTML}
      <div class="card-body">
        <div>
          <h3 class="card-title">${title}</h3>
          <p class="card-desc">${description}</p>
        </div>
        <div class="card-meta">
          <span class="card-source">${item.sourceName || 'TchadNews'}</span>
          <span class="card-time">${timeAgo}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (currentLang === 'ar') {
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  } else {
    if (minutes < 60) return `il y a ${minutes} m`;
    if (hours < 24) return `il y a ${hours} h`;
    return `il y a ${days} j`;
  }
}

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
  return /[\u0600-\u06FF]/.test(text);
}

// ✍️ Opinion Section
function renderOpinionSection(container) {
  let html = `
    <div class="opinion-form" style="background:var(--card); color:var(--text); padding:15px; border-radius:12px; margin-bottom:20px; border:1px solid var(--border); box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <h3 style="margin-top:0;">${UI_TEXT[currentLang].addArticle}</h3>
      
      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.85em; margin-bottom:4px; color:var(--text2);">الصورة الشخصية للكاتب:</label>
        <input type="file" id="authorImage" accept="image/*" style="width:100%; font-size:0.9em; color:var(--text);">
      </div>

      <input type="text" id="authorName" placeholder="اسم الكاتب / Nom" style="width:100%; padding:10px; margin-bottom:10px; box-sizing:border-box; border:1px solid var(--border); border-radius:6px; background:var(--bg); color:var(--text);">
      <input type="text" id="articleTitle" placeholder="عنوان المقال / Titre" style="width:100%; padding:10px; margin-bottom:10px; box-sizing:border-box; border:1px solid var(--border); border-radius:6px; background:var(--bg); color:var(--text);">
      <textarea id="articleContent" rows="5" placeholder="اكتب مقالك هنا..." style="width:100%; padding:10px; margin-bottom:10px; box-sizing:border-box; border:1px solid var(--border); border-radius:6px; background:var(--bg); color:var(--text);"></textarea>
      
      <button onclick="publishArticle()" style="background:var(--primary); color:#fff; border:none; padding:10px 18px; border-radius:6px; cursor:pointer; font-weight:bold;">نشر المقال</button>
    </div>

    <div style="text-align:left; margin-bottom:15px; padding:5px;">
      <button onclick="toggleAdminMode()" style="background:${isAdmin ? '#dc3545' : '#6c757d'}; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:0.85em;">
        ${isAdmin ? '🔓 خروج من وضع الأدمن' : '🔐 دخول الأدمن'}
      </button>
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
  const fileInput = document.getElementById("authorImage");

  if (!author || !title || !content) {
    alert("يرجى ملء جميع الحقول المطلوبة.");
    return;
  }

  const saveArticle = (imageDataUrl) => {
    const articles = JSON.parse(localStorage.getItem("user_articles") || "[]");
    const newArticle = {
      id: Date.now(),
      author,
      authorImage: imageDataUrl || null,
      title,
      content,
      date: new Date().toLocaleDateString(),
      comments: []
    };

    articles.unshift(newArticle);
    localStorage.setItem("user_articles", JSON.stringify(articles));
    renderOpinionSection(document.getElementById("newsList"));
  };

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      saveArticle(e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveArticle(null);
  }
};

function displayUserArticles() {
  const listContainer = document.getElementById("articlesList");
  const articles = JSON.parse(localStorage.getItem("user_articles") || "[]");

  if (articles.length === 0) {
    listContainer.innerHTML = `<p style="text-align:center; color:var(--text2);">لا توجد مقالات منشورة بعد.</p>`;
    return;
  }

  listContainer.innerHTML = articles.map(art => {
    const avatar = art.authorImage 
      ? `<img src="${art.authorImage}" alt="${art.author}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);">`
      : `<div style="width:45px; height:45px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1.2em;">${art.author.charAt(0).toUpperCase()}</div>`;

    return `
      <article style="background:var(--card); color:var(--text); margin-bottom:15px; padding:15px; border-radius:12px; border:1px solid var(--border); box-shadow:0 1px 4px rgba(0,0,0,0.06); position:relative;">
        
        ${isAdmin ? `<button onclick="deleteArticle(${art.id})" style="position:absolute; top:12px; left:12px; background:#dc3545; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.8em; font-weight:bold;">🗑️ حذف المقال</button>` : ''}

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          ${avatar}
          <div>
            <h4 style="margin:0; color:var(--primary); font-size:1.05em;">${art.author}</h4>
            <small style="color:var(--text2);">${art.date}</small>
          </div>
        </div>
        
        <h3 style="margin:0 0 10px 0; font-size:1.2em;">${art.title}</h3>
        <p style="margin:10px 0; line-height:1.6; white-space: pre-wrap;">${art.content}</p>
        
        <hr style="border:0; border-top:1px solid var(--border); margin:12px 0;">
        
        <div class="comments-section">
          <h4 style="margin:5px 0 8px 0; font-size:0.95em;">${UI_TEXT[currentLang].comments} (${art.comments ? art.comments.length : 0})</h4>
          <div id="comments-${art.id}">
            ${(art.comments || []).map(c => `<div style="background:var(--bg); padding:6px 10px; border-radius:6px; margin-bottom:6px; font-size:0.9em;"><strong>${c.user}:</strong> ${c.text}</div>`).join('')}
          </div>
          <div style="display:flex; gap:6px; margin-top:10px;">
            <input type="text" id="input-comment-${art.id}" placeholder="اكتب تعليقاً..." style="flex:1; padding:6px 10px; border:1px solid var(--border); border-radius:6px; background:var(--bg); color:var(--text); font-size:0.9em;">
            <button onclick="addComment(${art.id})" style="background:#28a745; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:0.9em;">تعليق</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

window.toggleAdminMode = function() {
  if (isAdmin) {
    isAdmin = false;
    localStorage.setItem('is_admin', 'false');
    alert("تم الخروج من وضع الأدمن.");
  } else {
    const pwd = prompt("أدخل كلمة مرور الأدمن:");
    if (pwd === ADMIN_PASSWORD) {
      isAdmin = true;
      localStorage.setItem('is_admin', 'true');
      alert("تم تفعيل وضع الأدمن بنجاح!");
    } else if (pwd !== null) {
      alert("كلمة المرور غير صحيحة!");
    }
  }
  renderOpinionSection(document.getElementById("newsList"));
};

window.deleteArticle = function(articleId) {
  if (!isAdmin) return;

  if (confirm("هل أنت تأكد من رغبتك في حذف هذا المقال نهائياً؟")) {
    let articles = JSON.parse(localStorage.getItem("user_articles") || "[]");
    articles = articles.filter(a => a.id !== articleId);
    localStorage.setItem("user_articles", JSON.stringify(articles));
    displayUserArticles();
  }
};

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
