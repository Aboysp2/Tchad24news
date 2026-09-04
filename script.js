document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       0. Feeds Configuration
       ====================================================================== */

    const FEEDS = {
        ar: {
            chad: [
                { url: 'https://www.alwihdainfo.com/feed/', name: 'الوحدة إنفو' },
                { url: 'https://tchadinfos.com/feed/', name: 'تشاد إنفو' },
                { url: 'https://journaldutchad.com/feed/', name: 'جريدة تشاد' }
            ],
            africa: [
                { url: 'https://www.bbc.com/arabic/topics/ck20or7087gt/rss.xml', name: 'بي بي سي أفريقيا' },
                { url: 'https://www.france24.com/ar/tag/%D8%A3%D9%81%D8%B1%D9%8A%D9%82%D9%8A%D8%A7/rss', name: 'فرانس 24 أفريقيا' }
            ],
            world: [
                { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' },
                { url: 'https://www.bbc.com/arabic/index.xml', name: 'بي بي سي عربي' },
                { url: 'https://www.france24.com/ar/rss', name: 'فرانس 24' }
            ],
            sports: [
                { url: 'https://www.aljazeera.net/rss/sports', name: 'الجزيرة رياضة' },
                { url: 'https://www.france24.com/ar/%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9/rss', name: 'فرانس 24 رياضة' }
            ],
            press: [
                { url: 'https://www.aljazeera.net/rss', name: 'الجزيرة' },
                { url: 'https://www.aawsat.com/rss', name: 'الشرق الأوسط' }
            ]
        },
        fr: {
            chad: [
                { url: 'https://www.alwihdainfo.com/feed/', name: 'Alwihda Info' },
                { url: 'https://tchadinfos.com/feed/', name: 'Tchadinfos' },
                { url: 'https://journaldutchad.com/feed/', name: 'Journal du Tchad' }
            ],
            africa: [
                { url: 'https://www.jeuneafrique.com/feed/', name: 'Jeune Afrique' },
                { url: 'https://www.france24.com/fr/afrique/rss', name: 'France 24 Afrique' },
                { url: 'https://www.rfi.fr/fr/afrique/rss', name: 'RFI Afrique' }
            ],
            world: [
                { url: 'https://www.france24.com/fr/rss', name: 'France 24 Monde' },
                { url: 'https://www.lemonde.fr/rss/une.xml', name: 'Le Monde' },
                { url: 'https://www.rfi.fr/fr/rss', name: 'RFI Monde' }
            ],
            sports: [
                { url: 'https://www.france24.com/fr/sports/rss', name: 'France 24 Sports' },
                { url: 'https://www.lequipe.fr/rss/actu_rss.xml', name: "L'Équipe" }
            ],
            press: [
                { url: 'https://www.lemonde.fr/rss/une.xml', name: 'Le Monde' },
                { url: 'https://www.lefigaro.fr/rss/figaro_actualites.xml', name: 'Le Figaro' }
            ]
        },
        en: {
            chad: [
                { url: 'https://www.africanews.com/country/chad/feed/', name: 'Africanews Chad' },
                { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera English' }
            ],
            africa: [
                { url: 'https://www.africanews.com/feed/', name: 'Africanews' },
                { url: 'https://www.theafricareport.com/feed/', name: 'The Africa Report' }
            ],
            world: [
                { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC News World' },
                { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' }
            ],
            sports: [
                { url: 'http://feeds.bbci.co.uk/sport/rss.xml', name: 'BBC Sport' },
                { url: 'https://www.espn.com/espn/rss/news', name: 'ESPN' }
            ],
            press: [
                { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'The New York Times' },
                { url: 'https://www.theguardian.com/world/rss', name: 'The Guardian' }
            ]
        }
    };

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
            catPress: "📰 Journaux",
            catOpinion: "✍️ Articles d'opinion",
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
            catPress: "📰 الصحف",
            catOpinion: "✍️ مقالات الرأي",
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
    const categoryBtns = document.querySelectorAll('.category-btn');
    const themeBtn = document.getElementById('theme-toggle');
    const notifyBtn = document.getElementById('notify-toggle');
    const tickerContent = document.getElementById('ticker-content');

    /* ======================================================================
       3. Dynamic Fetch Engine with Proxy Fallback
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
                    return processItems(data.items, source.name);
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

    function processItems(items, sourceName) {
        return items.map(raw => ({
            title: raw.title || '',
            description: stripHtml(raw.description).slice(0, 200),
            link: raw.link || '',
            pubDate: raw.pubDate || '',
            source: sourceName
        }));
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

        if (!merged.length) {
            renderEmptyState(newsContainer, t('emptyNewsText'));
            return;
        }

        merged.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        merged = merged.slice(0, 20);

        // Auto-translate content if it doesn't match the active language target
        const translatedItems = await Promise.all(merged.map(async (item) => {
            const translatedTitle = await translateText(item.title, currentLang);
            const translatedDesc = await translateText(item.description, currentLang);
            const translatedSource = await translateText(item.source, currentLang);

            return {
                ...item,
                title: translatedTitle,
                description: translatedDesc,
                source: translatedSource
            };
        }));

        if (state.activeCategory === categoryKey) {
            renderNewsList(translatedItems);
        }
    }

    /* ======================================================================
       4. UI Rendering
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
       5. Ticker & i18n
       ====================================================================== */

    async function loadTickerNews() {
        try {
            const langSources = FEEDS[currentLang] || FEEDS.en;
            const sourcesToFetch = [
                (langSources.chad && langSources.chad[0]),
                (langSources.africa && langSources.africa[0])
            ].filter(Boolean);

            const feeds = await Promise.all(
                sourcesToFetch.map(src => fetchOneFeed(src).catch(() => []))
            );

            const headlines = feeds.flat().slice(0, 5);
            if (headlines.length) {
                const titles = await Promise.all(headlines.map(h => translateText(h.title, currentLang)));
                tickerContent.textContent = titles.join('  ـــ  ');
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

        switchCategoryView(state.activeCategory);
        loadTickerNews();
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    function switchCategoryView(category) {
        state.activeCategory = category;
        localStorage.setItem(CATEGORY_STORAGE_KEY, category);

        if (state.activeCategory === 'opinion') {
            opinionSection.style.display = 'block';
            newsContainer.style.display = 'none';
        } else {
            opinionSection.style.display = 'none';
            newsContainer.style.display = 'grid';
            renderActiveCategory();
        }
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            switchCategoryView(btn.dataset.category);
        });
    });

    function renderActiveCategory() {
        if (state.activeCategory === 'opinion') return;
        const sources = (FEEDS[currentLang] && FEEDS[currentLang][state.activeCategory]) || FEEDS.en[state.activeCategory] || [];
        loadCategoryNews(sources, state.activeCategory);
    }

    function loadOpinionArticles() {
        try {
            const raw = localStorage.getItem(OPINION_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    /* ======================================================================
       6. Init
       ====================================================================== */

    setLanguage(currentLang);
});
