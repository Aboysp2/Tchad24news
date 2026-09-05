document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       0. Feeds Configuration
       ====================================================================== */

    // مصادر حسب اللغة
    const ARABIC_SOURCES = {
        chad: [
            { url: 'https://www.alwihdainfo.com/feed/', name: 'Alwihda Info' },
            { url: 'https://tchadinfos.com/feed/', name: 'Tchadinfos' },
            { url: 'https://journaldutchad.com/feed/', name: 'Journal du Tchad' }
        ],
        africa: [
            { url: 'https://www.bbc.com/arabic/topics/ck20or7087gt/rss.xml', name: 'BBC Arabic' },
            { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' }
        ],
        world: [
            { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' },
            { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' },
            { url: 'https://www.france24.com/ar/rss', name: 'فرانس 24' }
        ],
        sports: [
            { url: 'https://www.aljazeera.net/rss/sports', name: 'الجزيرة رياضة' },
            { url: 'https://www.france24.com/ar/%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9/rss', name: 'فرانس 24 رياضة' }
        ]
    };

    const FRENCH_SOURCES = {
        chad: [
            { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'Jeune Afrique' },
            { url: 'https://www.france24.com/fr/tag/tchad/rss', name: 'France 24' },
            { url: 'https://www.rfi.fr/fr/tag/tchad/rss', name: 'RFI' },
            { url: 'https://www.alwihdainfo.com/feed/', name: 'Alwihda Info' }
        ],
        africa: [
            { url: 'https://www.jeuneafrique.com/feed/', name: 'Jeune Afrique' },
            { url: 'https://www.africanews.com/feed/', name: 'Africanews' },
            { url: 'https://www.rfi.fr/fr/afrique/rss', name: 'RFI Afrique' }
        ],
        world: [
            { url: 'https://www.france24.com/fr/rss', name: 'France 24' },
            { url: 'https://www.lemonde.fr/rss/une.xml', name: 'Le Monde' },
            { url: 'https://www.rfi.fr/fr/rss', name: 'RFI' }
        ],
        sports: [
            { url: 'https://www.france24.com/fr/sports/rss', name: 'France 24 Sports' },
            { url: 'https://www.lequipe.fr/rss/actu_rss.xml', name: 'L\'Équipe' },
            { url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', name: 'BBC Sport' }
        ]
    };

    const ENGLISH_SOURCES = {
        chad: [
            { url: 'https://www.africanews.com/country/chad/feed/', name: 'Africanews Chad' },
            { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'Jeune Afrique' }
        ],
        africa: [
            { url: 'https://www.africanews.com/feed/', name: 'Africanews' },
            { url: 'https://www.theafricareport.com/feed/', name: 'The Africa Report' },
            { url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml', name: 'BBC Africa' }
        ],
        world: [
            { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NYT World' },
            { url: 'https://www.theguardian.com/world/rss', name: 'The Guardian' },
            { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World' }
        ],
        sports: [
            // كرة القدم أولاً
            { url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', name: 'BBC Football' },
            { url: 'https://www.espn.com/espn/rss/soccer/news', name: 'ESPN Soccer' },
            // تنس البطولات الكبرى
            { url: 'http://feeds.bbci.co.uk/sport/tennis/rss.xml', name: 'BBC Tennis' },
            { url: 'https://www.espn.com/espn/rss/tennis/news', name: 'ESPN Tennis' },
            // مصارعة وأخرى
            { url: 'https://www.espn.com/espn/rss/news', name: 'ESPN Sports' },
            { url: 'http://feeds.bbci.co.uk/sport/rss.xml', name: 'BBC Sport' }
        ]
    };

    const OPINION_STORAGE_KEY = 'tchad24_opinion_articles_v1'; // لم يعد مستخدماً
    const THEME_STORAGE_KEY = 'tchad24_theme';
    const NOTIFY_STORAGE_KEY = 'tchad24_notify_enabled';
    const CATEGORY_STORAGE_KEY = 'tchad24_last_category';
    const ADMIN_SESSION_KEY = 'tchad24_is_admin';
    const TRANSLATE_CACHE_KEY = 'tchad24_translate_cache_v4';

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
            loadingText: "Loading news…",
            emptyNewsText: "No news available right now.",
            readMoreText: "Read more →",
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
            loadingText: "Chargement des actualités…",
            emptyNewsText: "Aucune actualité disponible pour le moment.",
            readMoreText: "Lire la suite →",
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
            loadingText: "جارٍ تحميل الأخبار…",
            emptyNewsText: "لا توجد أخبار متاحة حاليًا.",
            readMoreText: "اقرأ المزيد ←",
            sourceLabel: "المصدر",
            notificationsEnabled: "تم تفعيل إشعارات الأخبار العاجلة!",
            notificationsDisabled: "تم إلغاء تفعيل الإشعارات."
        }
    };

    let currentLang = localStorage.getItem('preferred_lang') || 'ar';

    function t(key) {
        return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
    }

    /* ---------- Translation Cache ---------- */
    function loadTranslateCache() {
        try {
            return JSON.parse(sessionStorage.getItem(TRANSLATE_CACHE_KEY) || '{}');
        } catch { return {}; }
    }
    function saveTranslateCache(cache) {
        try {
            const keys = Object.keys(cache);
            if (keys.length > 200) keys.slice(0, keys.length - 200).forEach(k => delete cache[k]);
            sessionStorage.setItem(TRANSLATE_CACHE_KEY, JSON.stringify(cache));
        } catch (e) {}
    }
    let translateCache = loadTranslateCache();

    async function translateText(text, targetLang) {
        if (!text || text.trim().length < 3) return text;
        const cacheKey = `${targetLang}::${text}`;
        if (translateCache[cacheKey]) return translateCache[cacheKey];

        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await res.json();
            const translated = data[0].map(item => item[0]).join('');
            translateCache[cacheKey] = translated;
            saveTranslateCache(translateCache);
            return translated;
        } catch (e) {
            return text;
        }
    }

    /* ======================================================================
       2. State & DOM
       ====================================================================== */

    const savedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY) || 'chad';

    const state = {
        activeCategory: savedCategory,
        lastNotifiedNews: '',
        isLoading: false
    };

    const newsContainer = document.getElementById('news-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
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
            alert("Your browser does not support notifications.");
            return;
        }
        const currentlyEnabled = localStorage.getItem(NOTIFY_STORAGE_KEY) === 'true';
        if (!currentlyEnabled) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                localStorage.setItem(NOTIFY_STORAGE_KEY, 'true');
                notifyBtn?.classList.add('active');
                new Notification(t('siteTitle'), { body: t('notificationsEnabled') });
            }
        } else {
            localStorage.setItem(NOTIFY_STORAGE_KEY, 'false');
            notifyBtn?.classList.remove('active');
            alert(t('notificationsDisabled'));
        }
    }

    function triggerBreakingNewsNotification(title) {
        const isEnabled = localStorage.getItem(NOTIFY_STORAGE_KEY) === 'true';
        if (isEnabled && Notification.permission === 'granted' && title !== state.lastNotifiedNews) {
            state.lastNotifiedNews = title;
            new Notification(`${t('tickerTitle')}: ${t('siteTitle')}`, { body: title });
        }
    }

    /* ======================================================================
       4. News Fetching
       ====================================================================== */

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        return (tmp.textContent || tmp.innerText || '').trim();
    }

    async function fetchOneFeed(source) {
        try {
            const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'ok' && Array.isArray(data.items)) {
                    return data.items.slice(0, 6).map(raw => ({
                        title: raw.title || '',
                        description: stripHtml(raw.description).slice(0, 150),
                        link: raw.link || '',
                        pubDate: raw.pubDate || '',
                        source: source.name
                    }));
                }
            }
        } catch (e) {}

        // Fallback
        try {
            const fallback = `https://api.allorigins.win/get?url=${encodeURIComponent(source.url)}`;
            const res = await fetch(fallback);
            const data = await res.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");
            return Array.from(xml.querySelectorAll("item")).slice(0, 6).map(item => ({
                title: item.querySelector("title")?.textContent || '',
                description: stripHtml(item.querySelector("description")?.textContent || '').slice(0, 150),
                link: item.querySelector("link")?.textContent || '',
                pubDate: item.querySelector("pubDate")?.textContent || '',
                source: source.name
            }));
        } catch (e) {
            return [];
        }
    }

    function getSourcesForLang(category) {
        if (currentLang === 'ar') return ARABIC_SOURCES[category] || ARABIC_SOURCES.chad;
        if (currentLang === 'fr') return FRENCH_SOURCES[category] || FRENCH_SOURCES.chad;
        return ENGLISH_SOURCES[category] || ENGLISH_SOURCES.chad;
    }

    async function loadCategoryNews(categoryKey) {
        if (state.isLoading) return;
        state.isLoading = true;
        renderEmptyState(newsContainer, t('loadingText'));

        const sources = getSourcesForLang(categoryKey);

        try {
            const results = await Promise.allSettled(sources.map(fetchOneFeed));
            let merged = [];
            results.forEach(r => {
                if (r.status === 'fulfilled' && Array.isArray(r.value)) {
                    merged = merged.concat(r.value);
                }
            });

            if (state.activeCategory !== categoryKey) {
                state.isLoading = false;
                return;
            }

            if (!merged.length) {
                renderEmptyState(newsContainer, t('emptyNewsText'));
                state.isLoading = false;
                return;
            }

            merged.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            merged = merged.slice(0, 12);

            // ترجمة فقط للعربية
            let finalItems = merged;
            if (currentLang === 'ar') {
                finalItems = await Promise.all(merged.map(async item => ({
                    ...item,
                    title: await translateText(item.title, 'ar'),
                    description: await translateText(item.description, 'ar')
                })));
            }

            if (state.activeCategory === categoryKey) {
                renderNewsList(finalItems);
            }
        } catch (err) {
            renderEmptyState(newsContainer, t('emptyNewsText'));
        } finally {
            state.isLoading = false;
        }
    }

    /* ======================================================================
       5. Render
       ====================================================================== */

    function clearNode(node) {
        if (!node) return;
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
            return d.toLocaleDateString(
                currentLang === 'ar' ? 'ar-TD' : currentLang === 'fr' ? 'fr-FR' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
            );
        } catch { return ''; }
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
        if (!items?.length) {
            renderEmptyState(newsContainer, t('emptyNewsText'));
            return;
        }
        items.forEach(item => newsContainer.appendChild(createNewsCard(item)));
    }

    /* ======================================================================
       6. Ticker (عاجل) - محدث باستمرار
       ترتيب الأولوية: تشاد → أفريقيا → العالم → الرياضة
       ====================================================================== */

    async function loadTickerNews() {
        try {
            const priority = ['chad', 'africa', 'world', 'sports'];
            let allHeadlines = [];

            for (const cat of priority) {
                const sources = getSourcesForLang(cat).slice(0, 2);
                const results = await Promise.allSettled(sources.map(fetchOneFeed));
                results.forEach(r => {
                    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
                        allHeadlines = allHeadlines.concat(r.value.slice(0, 2));
                    }
                });
                if (allHeadlines.length >= 8) break;
            }

            if (allHeadlines.length) {
                allHeadlines.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
                let titles = allHeadlines.slice(0, 8).map(h => h.title);

                if (currentLang === 'ar') {
                    titles = await Promise.all(titles.map(t => translateText(t, 'ar')));
                }

                tickerContent.textContent = titles.join('  ـــ  ');
                triggerBreakingNewsNotification(titles[0]);
            } else {
                tickerContent.textContent = t('siteTitle');
            }
        } catch {
            tickerContent.textContent = t('siteTitle');
        }
    }

    // تحديث العاجل كل 5 دقائق
    setInterval(loadTickerNews, 5 * 60 * 1000);

    /* ======================================================================
       7. Language & Categories
       ====================================================================== */

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferred_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        const dict = translations[lang] || translations.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key]) el.textContent = dict[key];
        });

        switchCategoryView(state.activeCategory);
        loadTickerNews();
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    function switchCategoryView(category) {
        state.activeCategory = category;
        localStorage.setItem(CATEGORY_STORAGE_KEY, category);

        categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.category === category));
        loadCategoryNews(category);
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => switchCategoryView(btn.dataset.category));
    });

    /* ======================================================================
       8. Theme
       ====================================================================== */

    function updateThemeIcon() {
        const isDark = document.body.classList.contains('dark-mode');
        const moon = document.querySelector('#theme-toggle .icon-moon');
        const sun = document.querySelector('#theme-toggle .icon-sun');
        if (moon && sun) {
            moon.style.display = isDark ? 'none' : 'block';
            sun.style.display = isDark ? 'block' : 'none';
        }
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    updateThemeIcon();

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
            updateThemeIcon();
        });
    }

    /* ======================================================================
       9. Init
       ====================================================================== */

    initNotifications();
    setLanguage(currentLang);
});
