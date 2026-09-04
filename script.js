document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       0. Configuration
       ====================================================================== */

    // Chadian & pan-African RSS sources aggregated under the "Chad" tab.
    // Note: tchadinfos.com has occasionally been suspended/unreachable in the
    // past, so every fetch below is wrapped so one dead source never breaks
    // the others (Promise.allSettled) and the app falls back to a cached or
    // placeholder list instead of staying blank.
    //
    // IMPORTANT: some of the URLs below (especially the "/feed/" or "/rss"
    // guesses on tag/category pages) could not be verified against a live
    // network from this environment. If a source never returns items, open
    // the browser console, check the rss2json response for that url, and
    // adjust it to the site's real feed address.
    const RSS_SOURCES = [
        // Local Chadian outlets
        { url: 'https://tchadinfos.com/feed/', name: 'Tchadinfos' },
        { url: 'https://www.alwihdainfo.com/feed/', name: 'Alwihda Info' },
        { url: 'https://journaldutchad.com/feed/', name: 'Journal du Tchad' },
        { url: 'https://lepaystchad.com/feed/', name: 'Le Pays Tchad' },
        { url: 'https://zoomtchad.com/feed/', name: 'Zoom Tchad' },
        { url: 'https://letchadanthropus-tribune.com/feed/', name: 'Le Tchadanthropus-Tribune' },
        { url: 'https://tchadpages.com/feed/', name: 'Tchad Pages' },
        // International outlets, filtered to their Chad section/tag
        { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'Jeune Afrique' },
        { url: 'https://www.france24.com/fr/tag/tchad/rss', name: 'France 24' },
        { url: 'https://www.rfi.fr/fr/tchad/rss', name: 'RFI' },
        { url: 'https://www.africanews.com/country/chad/feed/', name: 'Africanews' },
        { url: 'https://allafrica.com/tools/headlines/rdf/chad/headlines.rdf', name: 'AllAfrica' },
        { url: 'https://apanews.net/category/tchad-chad/feed/', name: 'APAnews' },
        { url: 'https://www.franceinfo.fr/monde/afrique/tchad.rss', name: 'Franceinfo' }
    ];

    // Public RSS-to-JSON proxy (needed because browsers can't fetch raw RSS
    // XML from another origin without CORS headers). Get a free key at
    // https://rss2json.com/ and put it here if you start hitting rate limits.
    const RSS2JSON_ENDPOINT = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const RSS2JSON_API_KEY = '';

    const CHAD_NEWS_CACHE_KEY = 'tchad24_news_cache_v1';
    const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

    const OPINION_STORAGE_KEY = 'tchad24_opinion_articles_v1';
    const THEME_STORAGE_KEY = 'tchad24_theme';
    const ADMIN_SESSION_KEY = 'tchad24_is_admin';

    // Demo-only credentials. There is no backend here, so this is NOT real
    // security — it only gates the "delete" button in the UI. Replace with
    // real authentication before treating this as production admin access.
    const ADMIN_CREDENTIALS = { username: 'admin', password: 'tchad24' };

    /* ======================================================================
       1. Translations
       ====================================================================== */

    const translations = {
        en: {
            siteTitle: "Tchad24News",
            tickerTitle: "BREAKING",
            tickerContent: "Security measures reinforced in Chari-Baguirmi... New investments in regional infrastructure...",
            catChad: "🇹🇩 Chad",
            catAfrica: "🌍 Africa",
            catWorld: "🌐 World",
            catOpinion: "✍️ Opinion Articles",
            publishTitle: "Publish Your Article",
            authorImgLabel: "Author Profile Picture:",
            authorNamePlaceholder: "Author Name",
            articleTitlePlaceholder: "Article Title",
            articleContentPlaceholder: "Write your article here...",
            publishBtn: "Publish Article",
            adminLoginBtn: "🔐 Admin Login",
            publishTabBtn: "✍️ Publish Article",
            adminLoginTitle: "Admin Login",
            usernamePlaceholder: "Username",
            passwordPlaceholder: "Password",
            loginBtn: "Login",
            opinionListTitle: "Published Articles",
            loadingText: "Loading news…",
            emptyNewsText: "No news available right now. Please try again later.",
            comingSoonText: "No dedicated source configured for this section yet.",
            emptyOpinionText: "No opinion articles published yet. Be the first!",
            readMoreText: "Read more →",
            publishSuccessText: "Your article was published.",
            publishErrorText: "Please fill in all required fields.",
            adminSuccessText: "Logged in as admin.",
            adminErrorText: "Incorrect username or password.",
            deleteBtnText: "Delete",
            deleteConfirmText: "Delete this article?",
            sourceLabel: "Source"
        },
        fr: {
            siteTitle: "Tchad24News",
            tickerTitle: "URGENT",
            tickerContent: "Renforcement de la sécurité dans le Chari-Baguirmi... Nouveaux investissements dans les infrastructures...",
            catChad: "🇹🇩 Tchad",
            catAfrica: "🌍 Afrique",
            catWorld: "🌐 Monde",
            catOpinion: "✍️ Articles d'opinion",
            publishTitle: "Publiez votre article",
            authorImgLabel: "Photo de profil de l'auteur:",
            authorNamePlaceholder: "Nom de l'auteur",
            articleTitlePlaceholder: "Titre de l'article",
            articleContentPlaceholder: "Écrivez votre article ici...",
            publishBtn: "Publier l'article",
            adminLoginBtn: "🔐 Connexion Admin",
            publishTabBtn: "✍️ Publier un article",
            adminLoginTitle: "Connexion Admin",
            usernamePlaceholder: "Nom d'utilisateur",
            passwordPlaceholder: "Mot de passe",
            loginBtn: "Connexion",
            opinionListTitle: "Articles publiés",
            loadingText: "Chargement des actualités…",
            emptyNewsText: "Aucune actualité disponible pour le moment. Réessayez plus tard.",
            comingSoonText: "Aucune source dédiée n'est encore configurée pour cette rubrique.",
            emptyOpinionText: "Aucun article d'opinion publié pour le moment. Soyez le premier !",
            readMoreText: "Lire la suite →",
            publishSuccessText: "Votre article a été publié.",
            publishErrorText: "Veuillez remplir tous les champs obligatoires.",
            adminSuccessText: "Connecté en tant qu'administrateur.",
            adminErrorText: "Nom d'utilisateur ou mot de passe incorrect.",
            deleteBtnText: "Supprimer",
            deleteConfirmText: "Supprimer cet article ?",
            sourceLabel: "Source"
        },
        ar: {
            siteTitle: "Tchad24News",
            tickerTitle: "عاجل",
            tickerContent: "تعزيز الأمن وتأمين المناطق الحدودية في تشاد... استثمارات جديدة في البنية التحتية...",
            catChad: "🇹🇩 تشاد",
            catAfrica: "🌍 إفريقيا",
            catWorld: "🌐 العالم",
            catOpinion: "✍️ مقالات الرأي",
            publishTitle: "أنشر مقالتك",
            authorImgLabel: "الصورة الشخصية للكاتب:",
            authorNamePlaceholder: "اسم الكاتب",
            articleTitlePlaceholder: "عنوان المقال",
            articleContentPlaceholder: "اكتب مقالك هنا...",
            publishBtn: "أنشر مقالتك",
            adminLoginBtn: "🔐 دخول الأدمن",
            publishTabBtn: "✍️ أنشر مقالتك",
            adminLoginTitle: "دخول الأدمن",
            usernamePlaceholder: "اسم المستخدم",
            passwordPlaceholder: "كلمة المرور",
            loginBtn: "دخول",
            opinionListTitle: "المقالات المنشورة",
            loadingText: "جارٍ تحميل الأخبار…",
            emptyNewsText: "لا توجد أخبار متاحة حاليًا. حاول مرة أخرى لاحقًا.",
            comingSoonText: "لم يتم إعداد مصدر مخصص لهذا القسم بعد.",
            emptyOpinionText: "لم يُنشر أي مقال رأي بعد. كن أول من ينشر!",
            readMoreText: "اقرأ المزيد ←",
            publishSuccessText: "تم نشر مقالتك.",
            publishErrorText: "يرجى ملء جميع الحقول المطلوبة.",
            adminSuccessText: "تم تسجيل الدخول كمسؤول.",
            adminErrorText: "اسم المستخدم أو كلمة المرور غير صحيحة.",
            deleteBtnText: "حذف",
            deleteConfirmText: "هل تريد حذف هذا المقال؟",
            sourceLabel: "المصدر"
        }
    };

    let currentLang = localStorage.getItem('preferred_lang') || 'en';

    function t(key) {
        return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
    }

    /* ======================================================================
       2. State
       ====================================================================== */

    const state = {
        activeCategory: 'chad',
        chadNews: [],
        opinionArticles: loadOpinionArticles()
    };

    /* ======================================================================
       3. DOM references
       ====================================================================== */

    const newsContainer = document.getElementById('news-container');
    const opinionSection = document.getElementById('opinion-section');
    const opinionArticlesList = document.getElementById('opinion-articles-list');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const publishForm = document.getElementById('publish-form-container');
    const adminLogin = document.getElementById('admin-login-container');
    const articleForm = document.getElementById('article-form');
    const adminForm = document.getElementById('admin-form');
    const publishMessage = document.getElementById('publish-message');
    const adminMessage = document.getElementById('admin-message');
    const themeBtn = document.getElementById('theme-toggle');

    /* ======================================================================
       4. i18n
       ====================================================================== */

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferred_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        const dict = translations[lang] || translations.en;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key]) el.textContent = dict[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (dict[key]) el.placeholder = dict[key];
        });

        // Re-render whatever is currently visible so dates, "read more"
        // labels, and empty-state text switch language too.
        renderActiveCategory();
        renderOpinionArticles();
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    /* ======================================================================
       5. Theme (dark mode) — now persisted
       ====================================================================== */

    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    applyTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    });

    /* ======================================================================
       6. Category navigation
       ====================================================================== */

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeCategory = btn.dataset.category;

            if (state.activeCategory === 'opinion') {
                opinionSection.style.display = 'block';
                newsContainer.style.display = 'none';
            } else {
                opinionSection.style.display = 'none';
                newsContainer.style.display = 'grid';
                renderActiveCategory();
            }
        });
    });

    function renderActiveCategory() {
        if (state.activeCategory === 'opinion') return;

        if (state.activeCategory === 'chad') {
            if (state.chadNews.length) {
                renderNewsList(state.chadNews);
            } else {
                loadChadNews();
            }
        } else {
            // "Africa" and "World" don't have a dedicated feed configured
            // yet — show an honest empty state instead of a blank page.
            renderEmptyState(newsContainer, t('comingSoonText'));
        }
    }

    /* ======================================================================
       7. Opinion sub-tabs (Publish / Admin)
       ====================================================================== */

    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tab = btn.dataset.tab;
            if (tab === 'publish') {
                publishForm.style.display = 'block';
                adminLogin.style.display = 'none';
            } else if (tab === 'admin') {
                publishForm.style.display = 'none';
                adminLogin.style.display = 'block';
            }
        });
    });

    /* ======================================================================
       8. News rendering helpers
       ====================================================================== */

    function clearNode(node) {
        while (node.firstChild) node.removeChild(node.firstChild);
    }

    function renderEmptyState(container, message) {
        clearNode(container);
        const p = document.createElement('p');
        p.className = 'empty-state';
        p.textContent = message;
        container.appendChild(p);
    }

    function formatDate(dateInput) {
        try {
            const d = new Date(dateInput);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleDateString(currentLang === 'ar' ? 'ar-TD' : (currentLang === 'fr' ? 'fr-FR' : 'en-US'), {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch (e) {
            return '';
        }
    }

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        return (tmp.textContent || tmp.innerText || '').trim();
    }

    function createNewsCard(item) {
        const card = document.createElement('article');
        card.className = 'news-card';

        const badge = document.createElement('span');
        badge.className = 'category-badge';
        badge.textContent = item.source || t('sourceLabel');
        card.appendChild(badge);

        const title = document.createElement('h3');
        title.textContent = item.title;
        card.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = item.description;
        card.appendChild(desc);

        const footer = document.createElement('div');
        footer.className = 'news-card-footer';

        const date = document.createElement('span');
        date.className = 'news-date';
        date.textContent = formatDate(item.pubDate);
        footer.appendChild(date);

        if (item.link) {
            const link = document.createElement('a');
            link.className = 'news-card-link';
            link.href = item.link;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = t('readMoreText');
            footer.appendChild(link);
        }

        card.appendChild(footer);
        return card;
    }

    function renderNewsList(items) {
        clearNode(newsContainer);
        if (!items || !items.length) {
            renderEmptyState(newsContainer, t('emptyNewsText'));
            return;
        }
        items.forEach(item => newsContainer.appendChild(createNewsCard(item)));
    }

    /* ======================================================================
       9. RSS aggregation (Chad tab)
       ====================================================================== */

    function readCache() {
        try {
            const raw = localStorage.getItem(CHAD_NEWS_CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.items)) return null;
            if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
            return parsed.items;
        } catch (e) {
            return null;
        }
    }

    function writeCache(items) {
        try {
            localStorage.setItem(CHAD_NEWS_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), items }));
        } catch (e) {
            // Storage might be full or unavailable (private browsing) — non-fatal.
        }
    }

    async function fetchOneFeed(source) {
        const apiKeyParam = RSS2JSON_API_KEY ? `&api_key=${encodeURIComponent(RSS2JSON_API_KEY)}` : '';
        const url = `${RSS2JSON_ENDPOINT}${encodeURIComponent(source.url)}${apiKeyParam}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('Bad feed response');
        return data.items.map(raw => ({
            title: raw.title || '',
            description: stripHtml(raw.description).slice(0, 220),
            link: raw.link || '',
            pubDate: raw.pubDate || '',
            source: source.name
        }));
    }

    async function loadChadNews() {
        const cached = readCache();
        if (cached && cached.length) {
            state.chadNews = cached;
            renderNewsList(cached);
            return;
        }

        renderEmptyState(newsContainer, t('loadingText'));

        const results = await Promise.allSettled(RSS_SOURCES.map(fetchOneFeed));

        let merged = [];
        results.forEach(r => {
            if (r.status === 'fulfilled') merged = merged.concat(r.value);
        });

        merged.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        merged = merged.slice(0, 30);

        state.chadNews = merged;

        if (merged.length) {
            writeCache(merged);
        }

        // Only re-render if the user is still on the Chad tab.
        if (state.activeCategory === 'chad') {
            renderNewsList(merged);
        }
    }

    /* ======================================================================
       10. Opinion articles: storage
       ====================================================================== */

    function loadOpinionArticles() {
        try {
            const raw = localStorage.getItem(OPINION_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveOpinionArticles() {
        try {
            localStorage.setItem(OPINION_STORAGE_KEY, JSON.stringify(state.opinionArticles));
        } catch (e) {
            // Non-fatal — e.g. storage full or disabled.
        }
    }

    function isAdmin() {
        return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    }

    function createOpinionCard(article) {
        const card = document.createElement('article');
        card.className = 'news-card';

        const authorRow = document.createElement('div');
        authorRow.className = 'news-card-author';

        const avatar = document.createElement('img');
        avatar.src = article.authorImg || 'data:image/svg+xml;utf8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23002b66"/></svg>'
        );
        avatar.alt = article.authorName;
        authorRow.appendChild(avatar);

        const authorName = document.createElement('strong');
        authorName.textContent = article.authorName;
        authorRow.appendChild(authorName);

        card.appendChild(authorRow);

        const title = document.createElement('h3');
        title.textContent = article.title;
        card.appendChild(title);

        const body = document.createElement('p');
        body.textContent = article.body;
        card.appendChild(body);

        const footer = document.createElement('div');
        footer.className = 'news-card-footer';

        const date = document.createElement('span');
        date.className = 'news-date';
        date.textContent = formatDate(article.date);
        footer.appendChild(date);

        if (isAdmin()) {
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'delete-btn';
            delBtn.textContent = t('deleteBtnText');
            delBtn.addEventListener('click', () => {
                if (!confirm(t('deleteConfirmText'))) return;
                state.opinionArticles = state.opinionArticles.filter(a => a.id !== article.id);
                saveOpinionArticles();
                renderOpinionArticles();
            });
            footer.appendChild(delBtn);
        }

        card.appendChild(footer);
        return card;
    }

    function renderOpinionArticles() {
        clearNode(opinionArticlesList);
        if (!state.opinionArticles.length) {
            renderEmptyState(opinionArticlesList, t('emptyOpinionText'));
            return;
        }
        state.opinionArticles.forEach(article => opinionArticlesList.appendChild(createOpinionCard(article)));
    }

    /* ======================================================================
       11. Publish form
       ====================================================================== */

    function showMessage(el, text, kind) {
        el.textContent = text;
        el.className = 'form-message ' + kind;
        clearTimeout(el._hideTimer);
        el._hideTimer = setTimeout(() => { el.textContent = ''; el.className = 'form-message'; }, 4000);
    }

    function readImageAsDataUrl(fileInput) {
        return new Promise(resolve => {
            const file = fileInput.files && fileInput.files[0];
            if (!file) { resolve(null); return; }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        });
    }

    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Fixes the page-reload bug caused by native form submission.

        const authorNameInput = document.getElementById('author-name');
        const articleTitleInput = document.getElementById('article-title');
        const articleBodyInput = document.getElementById('article-body');
        const authorImgInput = document.getElementById('author-img');

        const authorName = authorNameInput.value.trim();
        const title = articleTitleInput.value.trim();
        const body = articleBodyInput.value.trim();

        if (!authorName || !title || !body) {
            showMessage(publishMessage, t('publishErrorText'), 'error');
            return;
        }

        const authorImg = await readImageAsDataUrl(authorImgInput);

        state.opinionArticles.unshift({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            authorName,
            authorImg,
            title,
            body,
            date: new Date().toISOString()
        });

        saveOpinionArticles();
        renderOpinionArticles();
        articleForm.reset();
        showMessage(publishMessage, t('publishSuccessText'), 'success');
    });

    /* ======================================================================
       12. Admin login form
       ====================================================================== */

    adminForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Fixes the page-reload bug caused by native form submission.

        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
            showMessage(adminMessage, t('adminSuccessText'), 'success');
            adminForm.reset();
            renderOpinionArticles();
        } else {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            showMessage(adminMessage, t('adminErrorText'), 'error');
        }
    });

    /* ======================================================================
       13. Init
       ====================================================================== */

    setLanguage(currentLang);
    renderOpinionArticles();
    loadChadNews();
});
