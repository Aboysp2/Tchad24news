document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. مصادر الأخبار المصححة والمحدثة (SOURCES)
    // ==========================================
    const SOURCES = {
        ar: {
            chad: [
                { url: 'https://www.alwihdainfo.com/feed/', name: 'الوحدة إنفو' },
                { url: 'https://tchadinfos.com/feed/', name: 'تشاد إنفوس' },
                { url: 'https://journaldutchad.com/feed/', name: 'جورنال دو تشاد' },
                { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'جون أفريك - تشاد' },
                { url: 'https://www.france24.com/fr/tag/tchad/rss', name: 'فرانس 24 - تشاد' },
                { url: 'https://www.rfi.fr/fr/tag/tchad/rss', name: 'RFI - تشاد' }
            ],
            africa: [
                { url: 'https://www.bbc.com/arabic/topics/ck20or7087gt/rss.xml', name: 'BBC Arabic - أفريقيا' },
                { url: 'https://www.france24.com/ar/afrique/rss', name: 'فرانس 24 أفريقيا' },
                { url: 'https://fr.africanews.com/feed/rss', name: 'أفريكا نيوز' },
                { url: 'https://www.rfi.fr/fr/afrique/rss', name: 'RFI Afrique' },
                { url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', name: 'AllAfrica' }
            ],
            world: [
                { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' },
                { url: 'https://www.bbc.com/arabic/index.xml', name: 'BBC Arabic' },
                { url: 'https://www.france24.com/ar/rss', name: 'فرانس 24' },
                { url: 'https://aawsat.com/rss', name: 'الشرق الأوسط' }
            ],
            sports: [
                { url: 'https://www.aljazeera.net/rss/sports', name: 'الجزيرة رياضة' },
                { url: 'https://www.france24.com/ar/%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9/rss', name: 'فرانس 24 رياضة' },
                { url: 'https://www.beinsports.com/ar/rss', name: 'beIN Sports' },
                { url: 'https://www.yallakora.com/rss', name: 'يلاكورة' }
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
                { url: 'https://fr.africanews.com/feed/rss', name: 'Africanews' },
                { url: 'https://www.rfi.fr/fr/afrique/rss', name: 'RFI Afrique' },
                { url: 'https://www.france24.com/fr/afrique/rss', name: 'France 24 Afrique' },
                { url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', name: 'AllAfrica' }
            ],
            world: [
                { url: 'https://www.france24.com/fr/rss', name: 'France 24' },
                { url: 'https://www.rfi.fr/fr/rss', name: 'RFI' },
                { url: 'https://www.lemonde.fr/rss/une.xml', name: 'Le Monde' },
                { url: 'https://www.lefigaro.fr/rss/figaro_actualites.xml', name: 'Le Figaro' },
                { url: 'https://fr.africanews.com/feed/rss', name: 'Africanews Monde' }
            ],
            sports: [
                { url: 'https://www.france24.com/fr/sports/rss', name: 'France 24 Sports' },
                { url: 'https://www.lequipe.fr/rss/actu_rss.xml', name: "L'Équipe" },
                { url: 'https://www.rmcsport.bfmtv.com/rss/football/', name: 'RMC Sport' },
                { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', name: 'BBC Football' }
            ]
        },
        en: {
            chad: [
                { url: 'https://www.africanews.com/feed/rss', name: 'Africanews Chad' },
                { url: 'https://www.jeuneafrique.com/pays/tchad/feed/', name: 'Jeune Afrique' }
            ],
            africa: [
                { url: 'https://www.africanews.com/feed/rss', name: 'Africanews' },
                { url: 'https://www.theafricareport.com/feed/', name: 'The Africa Report' },
                { url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml', name: 'BBC Africa' },
                { url: 'https://www.france24.com/en/africa/rss', name: 'France 24 Africa' },
                { url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', name: 'AllAfrica' }
            ],
            world: [
                { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NYT World' },
                { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World' },
                { url: 'https://www.theguardian.com/world/rss', name: 'The Guardian' },
                { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera English' }
            ],
            sports: [
                { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', name: 'BBC Football' },
                { url: 'https://www.espn.com/espn/rss/soccer/news', name: 'ESPN Soccer' },
                { url: 'https://feeds.bbci.co.uk/sport/tennis/rss.xml', name: 'BBC Tennis' },
                { url: 'https://www.espn.com/espn/rss/news', name: 'ESPN Sports' }
            ]
        }
    };

    // ==========================================
    // 2. المفاتيح والمصفوفات والنصوص (TRANSLATIONS)
    // ==========================================
    const THEME_STORAGE_KEY = 'tchad24_theme';
    const NOTIFY_STORAGE_KEY = 'tchad24_notify_enabled';
    const CATEGORY_STORAGE_KEY = 'tchad24_last_category';
    const CACHE_KEY = 'tchad24_news_cache_v8';

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

    // ==========================================
    // 3. التخزين المؤقت (CACHE SYSTEM)
    // ==========================================
    function getCache() {
        try { return JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}'); } 
        catch { return {}; }
    }

    function setCache(key, data) {
        try {
            const cache = getCache();
            cache[key] = { data, time: Date.now() };
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {}
    }

    function getCached(key, maxAge = 7 * 60 * 1000) {
        const cache = getCache();
        if (cache[key] && (Date.now() - cache[key].time < maxAge)) {
            return cache[key].data;
        }
        return null;
    }

    const state = {
        activeCategory: localStorage.getItem(CATEGORY_STORAGE_KEY) || 'chad',
        isLoading: false
    };

    const newsContainer = document.getElementById('news-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const themeBtn = document.getElementById('theme-toggle');
    const notifyBtn = document.getElementById('notify-toggle');
    const tickerContent = document.getElementById('ticker-content');

    // ==========================================
    // 4. نظام الإشعارات (NOTIFICATIONS)
    // ==========================================
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

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        return (tmp.textContent || '').trim();
    }

    // ==========================================
    // 5. محرك جلب الخلاصات وتجاوز الحظر (FETCH RSS)
    // ==========================================
    async function fetchFeed(source) {
        // المحاولة الأولى: استخدام API rss2json المباشر
        try {
            const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (data.status !== 'ok' || !data.items) throw new Error();
            
            return data.items.slice(0, 6).map(item => ({
                title: item.title || '',
                description: stripHtml(item.description).slice(0, 140),
                link: item.link || '',
                pubDate: item.pubDate || '',
                source: source.name
            }));
        } catch {
            // المحاولة الثانية (احتياطية): استخدام بروكسي allorigins لتجاوز قيود CORS
            try {
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(source.url)}`;
                const response = await fetch(proxyUrl);
                const data = await response.json();
                
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, "text/xml");
                const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 6);

                return items.map(item => ({
                    title: item.querySelector("title")?.textContent || '',
                    description: stripHtml(item.querySelector("description")?.textContent || '').slice(0, 140),
                    link: item.querySelector("link")?.textContent || '',
                    pubDate: item.querySelector("pubDate")?.textContent || '',
                    source: source.name
                }));
            } catch (err) {
                return [];
            }
        }
    }

    // ==========================================
    // 6. تحميل وإدارة الأخبار (LOAD NEWS)
    // ==========================================
    async function loadCategory(category) {
        if (state.isLoading) return;
        state.isLoading = true;

        const cacheKey = `${currentLang}_${category}`;
        const cached = getCached(cacheKey);

        if (cached) {
            renderNews(cached);
            state.isLoading = false;
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

        // الترتيب من الأحدث إلى الأقدم
        items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        items = items.slice(0, 12);

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

    // ==========================================
    // 7. خدمة الترجمة الآلية (TRANSLATE)
    // ==========================================
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

    // ==========================================
    // 8. عرض الأخبار في الصفحة (RENDER)
    // ==========================================
    function renderEmpty(msg) {
        if (newsContainer) newsContainer.innerHTML = `<p class="empty-state">${msg}</p>`;
    }

    function renderNews(items) {
        if (!items.length) return renderEmpty(t('emptyNewsText'));
        if (!newsContainer) return;

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

    // ==========================================
    // 9. شريط الأخبار العاجلة (BREAKING TICKER)
    // ==========================================
    async function loadTicker() {
        if (!tickerContent) return;
        try {
            const cats = ['chad', 'africa', 'world', 'sports'];
            let headlines = [];

            for (const cat of cats) {
                const sources = (SOURCES[currentLang]?.[cat] || []).slice(0, 1);
                const results = await Promise.allSettled(sources.map(fetchFeed));
                results.forEach(r => {
                    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
                        headlines = headlines.concat(r.value.slice(0, 2));
                    }
                });
                if (headlines.length >= 8) break;
            }

            if (headlines.length === 0) {
                tickerContent.textContent = t('siteTitle');
                return;
            }

            headlines.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            let titles = headlines.slice(0, 7).map(h => h.title);

            if (currentLang === 'ar') {
                titles = await Promise.all(titles.map(title => translate(title)));
            }

            tickerContent.style.animation = 'none';
            tickerContent.textContent = titles.join('  ـــ  ');
            void tickerContent.offsetWidth;
            tickerContent.style.animation = '';
        } catch (e) {
            tickerContent.textContent = t('siteTitle');
        }
    }

    setInterval(loadTicker, 6 * 60 * 1000);

    // ==========================================
    // 10. تبديل اللغات والفئات والمظهر (EVENTS)
    // ==========================================
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

    // ==========================================
    // 11. التشغيل المباشر عند التحميل
    // ==========================================
    initNotifications();
    setLanguage(currentLang);
});
