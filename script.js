// بيانات الترجمة والأخبار المتكاملة
const i18nData = {
    ar: {
        urgentTitle: "عاجل",
        tickerNews: [
            "تعزيز التدابير الأمنية في إقليم بحر الغزال لمواجهة التحديات الأخيرة",
            "افتتاح مشاريع تنموية جديدة في أنجمينا لدعم الشباب",
            "انطلاق فعاليات المنتدى الاقتصادي الوطني لتشجيع الاستثمار في تشاد"
        ],
        categories: {
            tchad: "تشاد",
            afrique: "إفريقيا",
            monde: "العالم",
            opinion: "مقالات الرأي"
        },
        news: [
            {
                title: "تعزيز الأمن وتأمين المناطق الحدودية في تشاد",
                desc: "اتخذت السلطات المحلية إجراءات جديدة لتعزيز الأمن والاستقرار وتأمين المناطق الحدودية.",
                category: "tchad",
                date: "قبل ساعتين"
            },
            {
                title: "قمة الاتحاد الإفريقي تمناقش التنمية الاقتصادية",
                desc: "اجتمع قادة الدول الإفريقية لبحث سبل تعزيز التبادل التجاري وتطوير البنية التحتية.",
                category: "afrique",
                date: "قبل 4 ساعات"
            },
            {
                title: "تطورات جديدة في الأسواق والاقتصاد العالمي",
                desc: "شهدت الأسواق العالمية تقلبات جديدة وسط تغيرات أسعار النفط والطاقة الدولية.",
                category: "monde",
                date: "قبل 6 ساعات"
            }
        ]
    },
    fr: {
        urgentTitle: "URGENT",
        tickerNews: [
            "La province du Moyen-Chari renforce son dispositif face aux inondations",
            "Inauguration de nouveaux projets de développement à N'Djamena",
            "Lancement du Forum Économique National pour encourager l'investissement"
        ],
        categories: {
            tchad: "Tchad",
            afrique: "Afrique",
            monde: "Monde",
            opinion: "Articles d'opinion"
        },
        news: [
            {
                title: "Renforcement de la sécurité dans le Chari-Baguirmi",
                desc: "Les autorités locales prennent de nouvelles mesures pour sécuriser la région.",
                category: "tchad",
                date: "Il y a 2h"
            },
            {
                title: "Sommet de l'Union Africaine sur le développement",
                desc: "Les dirigeants africains se réunissent pour discuter du commerce intra-africain.",
                category: "afrique",
                date: "Il y a 4h"
            }
        ]
    },
    en: {
        urgentTitle: "BREAKING",
        tickerNews: [
            "New development projects launched in N'Djamena to support youth",
            "African Union summit discusses economic development and infrastructure",
            "Global stock markets experience fluctuations amid oil price changes"
        ],
        categories: {
            tchad: "Chad",
            afrique: "Africa",
            monde: "World",
            opinion: "Opinion Pieces"
        },
        news: [
            {
                title: "Security Measures Reinforced in Chari-Baguirmi",
                desc: "Local authorities take new steps to ensure safety across the region.",
                category: "tchad",
                date: "2 hours ago"
            },
            {
                title: "African Union Summit Focuses on Trade",
                desc: "Leaders gather to discuss regional trade and infrastructure development.",
                category: "afrique",
                date: "4 hours ago"
            }
        ]
    }
};

let currentLang = 'ar';
let currentCategory = 'all';

// تبديل اللغة
function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // تحديث أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // تحديث شريط العاجل
    const tickerTitle = document.querySelector('.ticker-title');
    const tickerContent = document.getElementById('ticker-content');
    
    if (tickerTitle) tickerTitle.textContent = i18nData[lang].urgentTitle;
    if (tickerContent) {
        tickerContent.innerHTML = i18nData[lang].tickerNews
            .map(item => `<span style="display:inline-block; margin:0 15px;">🚨 ${item}</span>`)
            .join(' ');
    }

    // تحديث أزرار الأقسام
    document.querySelectorAll('.category-btn').forEach(btn => {
        const catKey = btn.getAttribute('data-category');
        if (catKey && i18nData[lang].categories[catKey]) {
            btn.textContent = i18nData[lang].categories[catKey];
        }
    });

    renderNews();
}

// عرض الأخبار
function renderNews() {
    let targetContainer = document.getElementById('opinion-articles-list') || document.getElementById('news-container');
    
    if (!targetContainer) {
        targetContainer = document.createElement('div');
        targetContainer.id = 'news-container';
        targetContainer.className = 'news-grid';
        document.querySelector('main')?.appendChild(targetContainer);
    }

    const articles = i18nData[currentLang].news.filter(item => 
        currentCategory === 'all' || item.category === currentCategory
    );

    if (articles.length === 0) {
        targetContainer.innerHTML = `<p style="text-align:center; padding:20px;">لا توجد أخبار حالياً لهذا القسم.</p>`;
        return;
    }

    targetContainer.innerHTML = articles.map(item => `
        <article class="news-card" style="background:var(--card-bg, #fff); padding:15px; margin:15px 0; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
            <span class="category-badge" style="background:#002b66; color:#fff; padding:3px 8px; border-radius:4px; font-size:12px;">${i18nData[currentLang].categories[item.category] || item.category}</span>
            <h3 style="margin:10px 0 5px 0;">${item.title}</h3>
            <p style="color:#555; font-size:14px; line-height:1.5;">${item.desc}</p>
            <span class="news-date" style="color:#888; font-size:12px;">${item.date}</span>
        </article>
    `).join('');
}

// تفعيل أحداث الأزرار عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    // أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            if (lang) switchLanguage(lang);
        });
    });

    // أزرار الأقسام
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category') || 'all';
            renderNews();
        });
    });

    // زر الوضع المظلم
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    // التشغيل الافتراضي بالعربية
    switchLanguage('ar');
});
