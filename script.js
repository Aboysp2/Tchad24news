document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       0. Feeds Configuration
       ====================================================================== */

    const CHAD_RSS_SOURCES = [
        // المصادر التشادية الحالية
        { url: 'https://www.alwihdainfo.com/feed/', name: 'Alwihda Info' },
        { url: 'https://tchadinfos.com/feed/', name: 'Tchadinfos' },
        { url: 'https://tchadone.com/feed/', name: 'Tchad One' },
        { url: 'https://journaldutchad.com/feed/', name: 'Journal du Tchad' },
        { url: 'https://lepaystchad.com/feed/', name: 'Le Pays Tchad' },
        { url: 'https://zoomtchad.com/feed/', name: 'Zoom Tchad' },
        { url: 'https://letchadanthropus-tribune.com/feed/', name: 'Le Tchadanthropus-Tribune' },
        
        // المصادر المضافة حديثاً بالترتيب المطلوب
        { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'Jeune Afrique - Tchad' },
        { url: 'https://www.france24.com/fr/tag/tchad/rss', name: 'France 24 - Tchad' },
        { url: 'https://www.rfi.fr/fr/tag/tchad/rss', name: 'RFI - Tchad' },
        { url: 'https://www.apanews.net/category/tchad-chad/feed/', name: 'APA News - Tchad' },
        { url: 'https://www.francetvinfo.fr/monde/afrique/tchad.rss', name: 'Franceinfo - Tchad' },
        { url: 'https://www.africanews.com/country/chad/feed/', name: 'Africanews - Chad' },
        { url: 'https://allafrica.com/tools/headlines/rdf/chad/headlines.rdf', name: 'AllAfrica - Chad' }
    ];

    const AFRICA_RSS_SOURCES = [
        { url: 'https://www.africanews.com/feed/', name: 'Africanews' },
        { url: 'https://www.theafricareport.com/feed/', name: 'The Africa Report' },
        { url: 'https://topafricanews.com/feed/', name: 'Top Africa News' },
        { url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', name: 'AllAfrica' },
        { url: 'https://www.jeuneafrique.com/feed/', name: 'Jeune Afrique' },
        { url: 'https://www.bbc.com/arabic/topics/ck20or7087gt/rss.xml', name: 'BBC Africa (عربي)' }
    ];

    const WORLD_RSS_SOURCES = [
        // المصادر العالمية الحالية
        { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NYT World' },
        { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' },
        { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' },
        { url: 'https://www.france24.com/ar/rss', name: 'فرانس 24' },
        { url: 'https://www.reutersagency.com/feed/?best-topics=world-news&post_type=best', name: 'Reuters' },
        { url: 'https://apnews.com/feed', name: 'AP News' },
        { url: 'https://www.afp.com/en/news-hub/rss', name: 'AFP' },
        
        // المصدر المضاف حديثاً
        { url: 'https://news.google.com/rss?hl=ar&gl=SA&ceid=SA:ar', name: 'Google News' }
    ];

    // قسم الرياضة - تغطية شاملة للكرة العربية والنسخ الأوروبية والإفريقية
    const SPORTS_RSS_SOURCES = [
        // الكرة العربية والإقليمية
        { url: 'https://www.kooora.com/rss.aspx', name: '🌙 كووورة' },
        { url: 'https://www.filgoal.com/rss/news', name: '🌙 في الجول' },
        { url: 'https://www.yallakora.com/rss/rss.aspx', name: '🌙 يلا كورة' },
        { url: 'https://www.hespress.com/sport/feed', name: '🌙 هسبريس رياضة' },
        { url: 'https://www.foot24.tn/rss.xml', name: '🌙 فوت 24' },
        
        // الكرة الأوروبية والعالمية
        { url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', name: '🇪🇺 BBC Football' },
        { url: 'https://www.skysports.com/rss/12040', name: '🇪🇺 Sky Sports Football' },
        { url: 'https://www.uefa.com/rssfeed/news/rss.xml', name: '🇪🇺 UEFA News' },
        { url: 'https://www.espn.com/espn/rss/soccer/news', name: '🌍 ESPN Soccer' },
        { url: 'https://www.marca.com/rss/en/index.xml', name: '🇪🇺 MARCA English' },

        // الكرة الأفريقية
        { url: 'https://www.cafonline.com/rss/', name: '🌍 CAF Official' },
        { url: 'https://www.kingfut.com/feed/', name: '🌍 KingFut Africa' },
        { url: 'https://www.africanews.com/feed/sport', name: '🌍 Africanews Sport' }
    ];

    const PRESS_RSS_SOURCES = [
        { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' },
        { url: 'https://newspapersonline.com/feed/', name: 'Newspapers Online' },
        { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'The New York Times' },
        { url: 'https://www.theguardian.com/world/rss', name: 'The Guardian' },
        { url: 'https://feeds.washingtonpost.com/rss/world', name: 'The Washington Post' },
        { url: 'https://www.aawsat.com/rss', name: 'الشرق الأوسط' },
        { url: 'https://www.lemonde.fr/rss/une.xml', name: 'Le Monde' }
    ];

    const RSS2JSON_ENDPOINT = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const OPINION_STORAGE_KEY = 'tchad24_opinion_articles_v1';
    const THEME_STORAGE_KEY = 'tchad24_theme';
    const NOTIFY_STORAGE_KEY = 'tchad24_notify_enabled';
    const ADMIN_SESSION_KEY = 'tchad24_is_admin';
    const ADMIN_CREDENTIALS = { username: 'admin', password: 'tchad24' };

    /* ======================================================================
       1. Translations
       ====================================================================== */

    const translations = {
        en: {
            siteTitle: "Tchad24News",
            tickerTitle: "BREAKING",
            catChad: "🇹🇩 Chad",
            catAfrica: "🌍 Africa",
            catWorld: "🌐 World",
            catSports: "⚽ Sports",
            catPress: "📰 Newspapers",
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
            loadingText: "Loading and translating news…",
            emptyNewsText: "No news available right now.",
            emptyOpinionText: "No opinion articles published yet.",
            readMoreText: "Read more →",
            deleteBtnText: "Delete",
            deleteConfirmText: "Delete this article?",
            sourceLabel: "Source",
            notificationsEnabled: "Breaking News Notifications Enabled!",
            notificationsDisabled: "Notifications Disabled."
        },
        fr: {
            siteTitle: "Tchad24News",
            tickerTitle: "URGENT",
            catChad: "🇹🇩 Tchad",
            catAfrica: "🌍 Afrique",
            catWorld: "🌐 Monde",
            catSports: "⚽ Sports",
            catPress: "📰 Journaux",
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
            loadingText: "Chargement et traduction des actualités…",
            emptyNewsText: "Aucune actualité disponible pour le moment.",
            emptyOpinionText: "Aucun article d'opinion publié pour le moment.",
            readMoreText: "Lire la suite →",
            deleteBtnText: "Supprimer",
            deleteConfirmText: "Supprimer cet article ?",
            sourceLabel: "Source",
            notificationsEnabled: "Notifications d'urgence activées !",
            notificationsDisabled: "Notifications désactivées."
        },
        ar: {
            siteTitle: "تشاد24نيوز",
            tickerTitle: "عاجل",
            catChad: "🇹🇩 تشاد",
            catAfrica: "🌍 إفريقيا",
            catWorld: "🌐 العالم",
            catSports: "⚽ الرياضة",
            catPress: "📰 الصحف",
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
            loadingText: "جارٍ تحميل الأخبار وترجمتها…",
            emptyNewsText: "لا توجد أخبار متاحة حاليًا.",
            emptyOpinionText: "لم يُنشر أي مقال رأي بعد.",
            readMoreText: "اقرأ المزيد ←",
            deleteBtnText: "حذف",
            deleteConfirmText: "هل تريد حذف هذا المقال؟",
            sourceLabel: "المصدر",
            notificationsEnabled: "تم تفعيل إشعارات الأخبار العاجلة!",
            notificationsDisabled: "تم إلغاء تفعيل الإشعارات."
        }
    };

    let currentLang = localStorage.getItem('preferred_lang') || 'ar';

    function t(key) {
        return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
    }

    /* ======================================================================
       2. State & DOM References
       ====================================================================== */

    const state = {
        activeCategory: 'sports', // جعل الرياضة هي الفئة الأولية
        opinionArticles: loadOpinionArticles(),
        lastNotifiedNews: ''
    };

    const newsContainer = document.getElementById('news-container');
    const opinionSection = document.getElementById('opinion-section');
    const opinionArticlesList = document.getElementById('opinion-articles-list');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const publishForm = document.getElementById('publish-form-container');
    const adminLogin = document.getElementById('admin-login-container');
    const articleForm = document.getElementById('article-form');
    const adminForm = document.getElementById('admin-form');
    const themeBtn = document.getElementById('theme-toggle');
    const notifyBtn = document.getElementById('notify-toggle');
    const tickerContent = document.getElementById('ticker-content');

    /* ======================================================================
       3. Translation Service
       ====================================================================== */

    async function translateText(text, targetLang) {
        if (!text || targetLang === 'fr') return text;
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await res.json();
            return data[0].map(item => item[0]).join('');
        } catch (e) {
            return text;
        }
    }

    /* ======================================================================
       4. Notifications Toggle Feature
       ====================================================================== */

    function initNotifications() {
        const isEnabled = localStorage.getItem(NOTIFY_STORAGE_KEY) === 'true';
        if (notifyBtn) {
            notifyBtn.classList.toggle('active', isEnabled);
            notifyBtn.addEventListener('click', toggleNotifications);
        }
    }

    async function toggleNotifications() {
        if (!("Notification" in window)) {
            alert("Your browser does not support web notifications.");
            return;
        }

        const currentlyEnabled = localStorage.getItem(NOTIFY_STORAGE_KEY) === 'true';

        if (!currentlyEnabled) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                localStorage.setItem(NOTIFY_STORAGE_KEY, 'true');
                notifyBtn.classList.add('active');
                new Notification(t('siteTitle'), { body: t('notificationsEnabled'), icon: '🇹🇩' });
            }
        } else {
            localStorage.setItem(NOTIFY_STORAGE_KEY, 'false');
            notifyBtn.classList.remove('active');
            alert(t('notificationsDisabled'));
        }
    }

    function triggerBreakingNewsNotification(title) {
        const isEnabled = localStorage.getItem(NOTIFY_STORAGE_KEY) === 'true';
        if (isEnabled && Notification.permission === 'granted' && title !== state.lastNotifiedNews) {
            state.lastNotifiedNews = title;
            new Notification(`${t('tickerTitle')}: ${t('siteTitle')}`, {
                body: title,
                icon: '🇹🇩'
            });
        }
    }

    /* ======================================================================
       5. i18n & Theme
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

        // ضبط الزر النشط في واجهة المستخدم ليطابق الفئة الفعالة (الرياضة)
        categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === state.activeCategory);
        });

        renderActiveCategory();
        renderOpinionArticles();
        loadTickerNews();
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
        });
    }

    /* ======================================================================
       6. Category Navigation
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
            loadCategoryNews(CHAD_RSS_SOURCES, 'chad');
        } else if (state.activeCategory === 'africa') {
            loadCategoryNews(AFRICA_RSS_SOURCES, 'africa');
        } else if (state.activeCategory === 'world') {
            loadCategoryNews(WORLD_RSS_SOURCES, 'world');
        } else if (state.activeCategory === 'sports') {
            loadCategoryNews(SPORTS_RSS_SOURCES, 'sports');
        } else if (state.activeCategory === 'press') {
            loadCategoryNews(PRESS_RSS_SOURCES, 'press');
        }
    }

    /* ======================================================================
       7. News Fetch & Render
       ====================================================================== */

    function clearNode(node) {
        if (!node) return;
        while (node.firstChild) node.removeChild(node.firstChild);
    }

    function renderEmptyState(container, message) {
        clearNode(container);
        if (!container) return;
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

    async function fetchOneFeed(source) {
        const url = `${RSS2JSON_ENDPOINT}${encodeURIComponent(source.url)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('Bad feed');
        
        return data.items.map(raw => ({
            title: raw.title || '',
            description: stripHtml(raw.description).slice(0, 200),
            link: raw.link || '',
            pubDate: raw.pubDate || '',
            source: source.name
        }));
    }

    async function loadCategoryNews(sourcesArray, categoryKey) {
        renderEmptyState(newsContainer, t('loadingText'));

        const results = await Promise.allSettled(sourcesArray.map(fetchOneFeed));
        let merged = [];
        results.forEach(r => {
            if (r.status === 'fulfilled') merged = merged.concat(r.value);
        });

        if (categoryKey !== 'sports') {
            merged.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        }
        merged = merged.slice(0, 24);

        if (currentLang !== 'fr') {
            merged = await Promise.all(merged.map(async item => ({
                ...item,
                title: await translateText(item.title, currentLang),
                description: await translateText(item.description, currentLang)
            })));
        }

        if (state.activeCategory === categoryKey) {
            renderNewsList(merged);
        }
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
       8. Dynamic Breaking News Ticker & Notifications Trigger
       ====================================================================== */

    async function loadTickerNews() {
        try {
            const [chadFeeds, africaFeeds, worldFeeds] = await Promise.all([
                fetchOneFeed(CHAD_RSS_SOURCES[0]).catch(() => []),
                fetchOneFeed(AFRICA_RSS_SOURCES[0]).catch(() => []),
                fetchOneFeed(WORLD_RSS_SOURCES[0]).catch(() => [])
            ]);

            const headlineChad = chadFeeds[0] ? `🇹🇩 ${chadFeeds[0].title}` : '';
            const headlineAfrica = africaFeeds[0] ? `🌍 ${africaFeeds[0].title}` : '';
            const headlineWorld = worldFeeds[0] ? `🌐 ${worldFeeds[0].title}` : '';

            let combinedText = [headlineChad, headlineAfrica, headlineWorld].filter(Boolean).join('  ـــ  ');
            
            if (currentLang !== 'fr') {
                combinedText = await translateText(combinedText, currentLang);
            }

            tickerContent.textContent = combinedText || t('siteTitle');

            if (headlineChad) {
                const cleanHeadline = chadFeeds[0].title;
                triggerBreakingNewsNotification(cleanHeadline);
            }
        } catch (e) {
            tickerContent.textContent = t('siteTitle');
        }
    }

    /* ======================================================================
       9. Opinion Articles & Forms
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
        } catch (e) {}
    }

    function isAdmin() {
        return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    }

    function renderOpinionArticles() {
        clearNode(opinionArticlesList);
        if (!state.opinionArticles.length) {
            renderEmptyState(opinionArticlesList, t('emptyOpinionText'));
            return;
        }
        state.opinionArticles.forEach(article => {
            const card = document.createElement('article');
            card.className = 'news-card';

            const authorRow = document.createElement('div');
            authorRow.className = 'news-card-author';

            const avatar = document.createElement('img');
            avatar.src = article.authorImg || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23002b66"/></svg>';
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
            opinionArticlesList.appendChild(card);
        });
    }

    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tab = btn.dataset.tab;
            publishForm.style.display = (tab === 'publish') ? 'block' : 'none';
            adminLogin.style.display = (tab === 'admin') ? 'block' : 'none';
        });
    });

    if (articleForm) {
        articleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const authorName = document.getElementById('author-name').value.trim();
            const title = document.getElementById('article-title').value.trim();
            const body = document.getElementById('article-body').value.trim();

            if (!authorName || !title || !body) return;

            state.opinionArticles.unshift({
                id: Date.now().toString(36),
                authorName,
                title,
                body,
                date: new Date().toISOString()
            });

            saveOpinionArticles();
            renderOpinionArticles();
            articleForm.reset();
        });
    }

    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('admin-username').value.trim();
            const p = document.getElementById('admin-password').value;

            if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
                sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
                adminForm.reset();
                renderOpinionArticles();
            }
        });
    }

    /* ======================================================================
       10. Init
       ====================================================================== */

    initNotifications();
    setLanguage(currentLang);
});
