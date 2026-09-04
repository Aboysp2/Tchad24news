document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       0. Feeds Configuration
       ====================================================================== */

    const CHAD_RSS_SOURCES = [
        { url: 'https://www.alwihdainfo.com/feed/', name: 'Alwihda Info' },
        { url: 'https://tchadinfos.com/feed/', name: 'Tchadinfos' },
        { url: 'https://journaldutchad.com/feed/', name: 'Journal du Tchad' },
        { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'Jeune Afrique - Tchad' },
        { url: 'https://www.france24.com/fr/tag/tchad/rss', name: 'France 24 - Tchad' },
        { url: 'https://www.rfi.fr/fr/tag/tchad/rss', name: 'RFI - Tchad' },
        { url: 'https://www.africanews.com/country/chad/feed/', name: 'Africanews - Chad' }
    ];

    const AFRICA_RSS_SOURCES = [
        { url: 'https://www.africanews.com/feed/', name: 'Africanews' },
        { url: 'https://www.theafricareport.com/feed/', name: 'The Africa Report' },
        { url: 'https://www.jeuneafrique.com/feed/', name: 'Jeune Afrique' },
        { url: 'https://www.bbc.com/arabic/topics/ck20or7087gt/rss.xml', name: 'BBC Africa' }
    ];

    const WORLD_RSS_SOURCES = [
        { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' },
        { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' },
        { url: 'https://www.france24.com/ar/rss', name: 'فرانس 24' },
        { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NYT World' }
    ];

    const SPORTS_RSS_SOURCES = [
        { url: 'https://www.aljazeera.net/rss/sports', name: 'الجزيرة رياضة' },
        { url: 'https://www.france24.com/ar/%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9/rss', name: 'فرانس 24 رياضة' },
        { url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', name: 'BBC Sport' },
        { url: 'https://www.espn.com/espn/rss/soccer/news', name: 'ESPN Soccer' }
    ];

    const PRESS_RSS_SOURCES = [
        { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' },
        { url: 'https://www.aawsat.com/rss', name: 'الشرق الأوسط' },
        { url: 'https://www.lemonde.fr/rss/une.xml', name: 'Le Monde' },
        { url: 'https://www.theguardian.com/world/rss', name: 'The Guardian' }
    ];

    const OPINION_STORAGE_KEY = 'tchad24_opinion_articles_v1';
    const THEME_STORAGE_KEY = 'tchad24_theme';
    const NOTIFY_STORAGE_KEY = 'tchad24_notify_enabled';
    const CATEGORY_STORAGE_KEY = 'tchad24_last_category';
    const ADMIN_SESSION_KEY = 'tchad24_is_admin';
    const ADMIN_CREDENTIALS = { username: 'admin', password: 'tchad24' };

    /* ======================================================================
       1. Translations & Dynamic Translator
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

    async function translateText(text, targetLang) {
        if (!text || text.trim() === '') return text;
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await res.json();
            return data[0].map(item => item[0]).join('');
        } catch (e) {
            return text;
        }
    }

    /* ======================================================================
       2. State & DOM References
       ====================================================================== */

    const savedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY) || 'chad';

    const state = {
        activeCategory: savedCategory,
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
       3. Notifications
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
                if (notifyBtn) notifyBtn.classList.add('active');
                new Notification(t('siteTitle'), { body: t('notificationsEnabled'), icon: '🇹🇩' });
            }
        } else {
            localStorage.setItem(NOTIFY_STORAGE_KEY, 'false');
            if (notifyBtn) notifyBtn.classList.remove('active');
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
       4. News Fetching Engine (With Fallback Proxy)
       ====================================================================== */

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        return (tmp.textContent || tmp.innerText || '').trim();
    }

    async function fetchOneFeed(source) {
        try {
            const primaryUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
            const res = await fetch(primaryUrl);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
                    return data.items.map(raw => ({
                        title: raw.title || '',
                        description: stripHtml(raw.description).slice(0, 200),
                        link: raw.link || '',
                        pubDate: raw.pubDate || '',
                        source: source.name
                    }));
                }
            }
        } catch (e) {}

        // Fallback Proxy if RSS2JSON fails
        try {
            const fallbackUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(source.url)}`;
            const res = await fetch(fallbackUrl);
            const data = await res.json();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");
            const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 10);

            return items.map(item => ({
                title: item.querySelector("title")?.textContent || '',
                description: stripHtml(item.querySelector("description")?.textContent || '').slice(0, 200),
                link: item.querySelector("link")?.textContent || '',
                pubDate: item.querySelector("pubDate")?.textContent || '',
                source: source.name
            }));
        } catch (e) {
            return [];
        }
    }

    async function loadCategoryNews(sourcesArray, categoryKey) {
        renderEmptyState(newsContainer, t('loadingText'));

        const results = await Promise.allSettled(sourcesArray.map(fetchOneFeed));
        let merged = [];
        results.forEach(r => {
            if (r.status === 'fulfilled' && Array.isArray(r.value)) {
                merged = merged.concat(r.value);
            }
        });

        // منع عرض أخبار فئة قديمة إذا غيّر المستخدم التصنيف بسرعة
        if (state.activeCategory !== categoryKey) return;

        if (!merged.length) {
            renderEmptyState(newsContainer, t('emptyNewsText'));
            return;
        }

        merged.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        merged = merged.slice(0, 20);

        const translatedItems = await Promise.all(merged.map(async (item) => {
            const title = await translateText(item.title, currentLang);
            const description = await translateText(item.description, currentLang);
            // لا نترجم اسم المصدر لأنه غالباً اسم معروف
            return { ...item, title, description };
        }));

        if (state.activeCategory === categoryKey) {
            renderNewsList(translatedItems);
        }
    }

    /* ======================================================================
       5. Render UI
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
       6. Ticker & Language Switcher
       ====================================================================== */

    async function loadTickerNews() {
        try {
            const results = await Promise.allSettled([
                fetchOneFeed(CHAD_RSS_SOURCES[0]),
                fetchOneFeed(AFRICA_RSS_SOURCES[0])
            ]);

            let headlines = [];
            results.forEach(r => {
                if (r.status === 'fulfilled' && Array.isArray(r.value)) {
                    headlines = headlines.concat(r.value.slice(0, 2));
                }
            });

            if (headlines.length) {
                const titles = await Promise.all(
                    headlines.map(h => translateText(h.title, currentLang))
                );
                tickerContent.textContent = titles.join('  ـــ  ');
                triggerBreakingNewsNotification(titles[0]);
            } else {
                tickerContent.textContent = t('siteTitle');
            }
        } catch (e) {
            tickerContent.textContent = t('siteTitle');
        }
    }

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

        switchCategoryView(state.activeCategory);
        renderOpinionArticles();
        loadTickerNews();
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    function switchCategoryView(category) {
        state.activeCategory = category;
        localStorage.setItem(CATEGORY_STORAGE_KEY, category);

        categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.category === category));

        if (state.activeCategory === 'opinion') {
            if (opinionSection) opinionSection.style.display = 'block';
            if (newsContainer) newsContainer.style.display = 'none';
        } else {
            if (opinionSection) opinionSection.style.display = 'none';
            if (newsContainer) newsContainer.style.display = 'grid';
            renderActiveCategory();
        }
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => switchCategoryView(btn.dataset.category));
    });

    function renderActiveCategory() {
        if (state.activeCategory === 'opinion') return;

        const maps = {
            chad: CHAD_RSS_SOURCES,
            africa: AFRICA_RSS_SOURCES,
            world: WORLD_RSS_SOURCES,
            sports: SPORTS_RSS_SOURCES,
            press: PRESS_RSS_SOURCES
        };

        const sources = maps[state.activeCategory] || CHAD_RSS_SOURCES;
        loadCategoryNews(sources, state.activeCategory);
    }

    /* ======================================================================
       7. Theme & Opinion Articles logic
       ====================================================================== */

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
            console.warn('Failed to save opinion articles (storage full?)');
        }
    }

    function isAdmin() {
        return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    }

    function renderOpinionArticles() {
        if (!opinionArticlesList) return;
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
            avatar.alt = article.authorName || '';
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

    // دالة مساعدة لإضافة المقال (بعد قراءة الصورة)
    function addOpinionArticle(authorName, title, body, authorImg = '') {
        state.opinionArticles.unshift({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            authorName,
            title,
            body,
            authorImg,
            date: new Date().toISOString()
        });

        saveOpinionArticles();
        renderOpinionArticles();
        if (articleForm) articleForm.reset();
    }

    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tab = btn.dataset.tab;
            if (publishForm) publishForm.style.display = (tab === 'publish') ? 'block' : 'none';
            if (adminLogin) adminLogin.style.display = (tab === 'admin') ? 'block' : 'none';
        });
    });

    if (articleForm) {
        articleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const authorName = document.getElementById('author-name')?.value.trim();
            const title = document.getElementById('article-title')?.value.trim();
            const body = document.getElementById('article-body')?.value.trim();
            const authorImgInput = document.getElementById('author-img');

            if (!authorName || !title || !body) return;

            // إذا وُجدت صورة، نقرأها كـ Base64
            if (authorImgInput && authorImgInput.files && authorImgInput.files[0]) {
                const file = authorImgInput.files[0];

                // حد أقصى بسيط لحجم الصورة (حوالي 1.5 ميجا)
                if (file.size > 1.5 * 1024 * 1024) {
                    alert(currentLang === 'ar' ? 'حجم الصورة كبير جدًا. يرجى اختيار صورة أصغر.' : 'Image is too large. Please choose a smaller one.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (event) {
                    addOpinionArticle(authorName, title, body, event.target.result);
                };
                reader.onerror = function () {
                    // في حالة فشل قراءة الصورة ننشر بدونها
                    addOpinionArticle(authorName, title, body, '');
                };
                reader.readAsDataURL(file);
            } else {
                addOpinionArticle(authorName, title, body, '');
            }
        });
    }

    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('admin-username')?.value.trim();
            const p = document.getElementById('admin-password')?.value;

            if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
                sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
                adminForm.reset();
                renderOpinionArticles();
                alert(currentLang === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
            } else {
                alert(currentLang === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Incorrect username or password');
            }
        });
    }

    /* ======================================================================
       8. Init
       ====================================================================== */

    initNotifications();
    setLanguage(currentLang);
});
