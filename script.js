document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       0. مصادر الأخبار
       ====================================================================== */

    const SOURCES = {
        ar: {
            chad: [
                { url: 'https://www.alwihdainfo.com/feed/', name: 'Alwihda Info' },
                { url: 'https://tchadinfos.com/feed/', name: 'Tchadinfos' },
                { url: 'https://journaldutchad.com/feed/', name: 'Journal du Tchad' },
                { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'Jeune Afrique - Tchad' },
                { url: 'https://www.france24.com/fr/tag/tchad/rss', name: 'France 24 - Tchad' },
                { url: 'https://www.rfi.fr/fr/tag/tchad/rss', name: 'RFI - Tchad' }
            ],
            africa: [
                { url: 'https://www.bbc.com/arabic/topics/ck20or7087gt/rss.xml', name: 'BBC Arabic' },
                { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' }
            ],
            world: [
                { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' },
                { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' }
            ],
            sports: [
                { url: 'https://www.aljazeera.net/rss/sports', name: 'الجزيرة رياضة' },
                { url: 'https://www.france24.com/ar/%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9/rss', name: 'فرانس 24 رياضة' }
            ]
        },
        fr: {
            chad: [
                { url: 'https://www.france24.com/fr/tag/tchad/rss', name: 'France 24' },
                { url: 'https://www.rfi.fr/fr/tag/tchad/rss', name: 'RFI' },
                { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'Jeune Afrique' },
                { url: 'https://www.alwihdainfo.com/feed/', name: 'Alwihda Info' },
                { url: 'https://tchadinfos.com/feed/', name: 'Tchadinfos' }
            ],
            africa: [
                { url: 'https://www.jeuneafrique.com/feed/', name: 'Jeune Afrique' },
                { url: 'https://www.africanews.com/feed/', name: 'Africanews' }
            ],
            world: [
                { url: 'https://www.france24.com/fr/rss', name: 'France 24' },
                { url: 'https://www.lemonde.fr/rss/une.xml', name: 'Le Monde' }
            ],
            sports: [
                { url: 'https://www.france24.com/fr/sports/rss', name: 'France 24 Sports' },
                { url: 'https://www.lequipe.fr/rss/actu_rss.xml', name: "L'Équipe" }
            ]
        },
        en: {
            chad: [
                { url: 'https://www.africanews.com/country/chad/feed/', name: 'Africanews Chad' },
                { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'Jeune Afrique' }
            ],
            africa: [
                { url: 'https://www.africanews.com/feed/', name: 'Africanews' },
                { url: 'https://www.theafricareport.com/feed/', name: 'The Africa Report' }
            ],
            world: [
                { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NYT World' },
                { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World' }
            ],
            sports: [
                { url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', name: 'BBC Football' },
                { url: 'https://www.espn.com/espn/rss/soccer/news', name: 'ESPN Soccer' },
                { url: 'http://feeds.bbci.co.uk/sport/tennis/rss.xml', name: 'BBC Tennis' }
            ]
        }
    };

    const THEME_STORAGE_KEY = 'tchad24_theme';
    const NOTIFY_STORAGE_KEY = 'tchad24_notify_enabled';
    const CATEGORY_STORAGE_KEY = 'tchad24_last_category';
    const CACHE_KEY = 'tchad24_news_cache_v5';

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
        return translations[currentLang]?.[key] || translations.en[key] || key;
    }

    /* ======================================================================
       2. Cache
       ====================================================================== */

    function getCache() {
        try {
            return JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}');
        } catch { return {}; }
    }

    function setCache(key, data) {
        try {
            const cache = getCache();
            cache[key] = { data, time: Date.now() };
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {}
    }

    function getCached(key, maxAge = 8 * 60 * 1000) {
        const cache = getCache();
        if (cache[key] && (Date.now() - cache[key].time < maxAge)) {
            return cache[key].data;
        }
        return null;
    }

    /* ======================================================================
       3. State & DOM
       ====================================================================== */

    const state = {
        activeCategory: localStorage.getItem(CATEGORY_STORAGE_KEY) || 'chad',
        isLoading: false,
        lastNotified: ''
    };

    const newsContainer = document.getElementById('news-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const themeBtn = document.getElementById('theme-toggle');
    const notifyBtn = document.getElementById('notify-toggle');
    const tickerContent = document.getElementById('ticker-content');

    /* ======================================================================
       4. Notifications
       ====================================================================== */

    function initNotifications() {
        const enabled = localStorage.getItem(NOTIFY_STORAGE_KEY) === 'true';
        if (notifyBtn) {
            notifyBtn.classList.toggle('active', enabled);
            notifyBtn.addEventListener('click', async () => {
                if (!("Notification" in window)) return alert("Not supported");
                if (localStorage.getItem(NOTIFY_STORAGE_KEY) === 'true') {
                    localStorage.setItem(NOTIFY_STORAGE_KEY, 'false');
                    notifyBtn.classList.remove('active');
                    alert(t('notificationsDisabled'));
                } else {
                    const perm = await Notification.requestPermission();
                    if (perm === 'granted') {
                        localStorage.setItem(NOTIFY_STORAGE_KEY, 'true');
                        notifyBtn.classList.add('active');
                        new Notification(t('siteTitle'), { body: t('notificationsEnabled') });
                    }
                }
            });
        }
    }

    /* ======================================================================
       5. Fetching
       ====================================================================== */

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        return (tmp.textContent || '').trim();
    }

    async function fetchFeed(source) {
        try {
            const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (data.status !== 'ok' || !data.items) throw new Error();
            return data.items.slice(0, 5).map(item => ({
                title: item.title || '',
                description: stripHtml(item.description).slice(0, 140),
                link: item.link || '',
                pubDate: item.pubDate || '',
                source: source.name
            }));
        } catch {
            return [];
        }
    }

    async function loadCategory(category) {
        if (state.isLoading) return;
        state.isLoading = true;

        const cacheKey = `${currentLang}_${category}`;
        const cached = getCached(cacheKey);

        if (cached) {
            renderNews(cached);
            state.isLoading = false;
            // تحديث في الخلفية
            fetchAndUpdate(category, cacheKey);
            return;
        }

        renderEmpty(t('loadingText'));
        await fetchAndUpdate(category, cacheKey);
        state.isLoading = false;
    }

    async function fetchAndUpdate(category, cacheKey) {
        const sources = SOURCES[currentLang]?.[category] || SOURCES.ar.chad;
        const results = await Promise.allSettled(sources.map(fetchFeed));

        let items = [];
        results.forEach(r => {
            if (r.status === 'fulfilled') items = items.concat(r.value);
        });

        if (!items.length) {
            if (state.activeCategory === category) renderEmpty(t('emptyNewsText'));
            return;
        }

        items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        items = items.slice(0, 12);

        // ترجمة فقط للعربية
        if (currentLang === 'ar') {
            items = await Promise.all(items.map(async item => ({
                ...item,
                title: await translate(item.title),
                description: await translate(item.description)
            })));
        }

        setCache(cacheKey, items);

        if (state.activeCategory === category) {
            renderNews(items);
        }
    }

    // ترجمة مع كاش
    const translateCache = {};
    async function translate(text) {
        if (!text || text.length < 4) return text;
        if (translateCache[text]) return translateCache[text];
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q=${encodeURIComponent(text)}`);
            const data = await res.json();
            const result = data[0].map(i => i[0]).join('');
            translateCache[text] = result;
            return result;
        } catch {
            return text;
        }
    }

    /* ======================================================================
       6. Render
       ====================================================================== */

    function renderEmpty(msg) {
        newsContainer.innerHTML = `<p class="empty-state">${msg}</p>`;
    }

    function renderNews(items) {
        if (!items.length) return renderEmpty(t('emptyNewsText'));
        newsContainer.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'news-card';
            card.innerHTML = `
                <span class="category-badge">${item.source}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="news-card-footer">
                    <span>${formatDate(item.pubDate)}</span>
                    ${item.link ? `<a class="news-card-link" href="${item.link}" target="_blank" rel="noopener">${t('readMoreText')}</a>` : ''}
                </div>
            `;
            newsContainer.appendChild(card);
        });
    }

    function formatDate(d) {
        try {
            return new Date(d).toLocaleDateString(
                currentLang === 'ar' ? 'ar-TD' : currentLang === 'fr' ? 'fr-FR' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
            );
        } catch { return ''; }
    }

    /* ======================================================================
       7. Ticker (عاجل)
       ====================================================================== */

    async function loadTicker() {
        try {
            const cats = ['chad', 'africa', 'world', 'sports'];
            let headlines = [];

            for (const cat of cats) {
                const sources = (SOURCES[currentLang]?.[cat] || []).slice(0, 1);
                const results = await Promise.allSettled(sources.map(fetchFeed));
                results.forEach(r => {
                    if (r.status === 'fulfilled') headlines = headlines.concat(r.value.slice(0, 2));
                });
                if (headlines.length >= 6) break;
            }

            if (headlines.length) {
                headlines.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
                let titles = headlines.slice(0, 6).map(h => h.title);
                if (currentLang === 'ar') {
                    titles = await Promise.all(titles.map(translate));
                }
                tickerContent.textContent = titles.join('  ـــ  ');
            }
        } catch {
            tickerContent.textContent = t('siteTitle');
        }
    }

    setInterval(loadTicker, 6 * 60 * 1000);

    /* ======================================================================
       8. Language & Categories
       ====================================================================== */

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferred_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('.lang-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.lang === lang);
        });

        const dict = translations[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            if (dict[el.dataset.i18n]) el.textContent = dict[el.dataset.i18n];
        });

        switchCategory(state.activeCategory);
        loadTicker();
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    function switchCategory(cat) {
        state.activeCategory = cat;
        localStorage.setItem(CATEGORY_STORAGE_KEY, cat);
        categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.category === cat));
        loadCategory(cat);
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => switchCategory(btn.dataset.category));
    });

    /* ======================================================================
       9. Theme
       ====================================================================== */

    function updateThemeIcon() {
        const isDark = document.body.classList.contains('dark-mode');
        const moon = document.querySelector('.icon-moon');
        const sun = document.querySelector('.icon-sun');
        if (moon && sun) {
            moon.style.display = isDark ? 'none' : 'block';
            sun.style.display = isDark ? 'block' : 'none';
        }
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    updateThemeIcon();

    themeBtn?.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
        updateThemeIcon();
    });

    /* ======================================================================
       10. Init
       ====================================================================== */

    initNotifications();
    setLanguage(currentLang);
});
