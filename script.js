// بيانات الترجمة والأخبار لكل لغة
const i18nData = {
    ar: {
        urgentTitle: "عاجل",
        tickerNews: [
            "تعزيز التدابير الأمنية في إقليم بحر الغزال لمواجهة التحديات الأخيرة",
            "افتتاح مشاريع تنموية جديدة في أنجمينا لدعم الشباب",
            "انطلاق فعاليات المنتدى الاقتصادي الوطني لتشجيع الاستثمار"
        ],
        categories: {
            tchad: "تشاد",
            afrique: "إفريقيا",
            monde: "العالم",
            opinion: "مقالات الرأي"
        },
        news: [
            {
                title: "تعزيز الأمن في إقليم شاري باقرمي",
                desc: "السلطات المحلية تتخذ إجراءات جديدة لتعزيز الأمن وتأمين المناطق الحدودية.",
                category: "tchad",
                date: "قبل ساعتين"
            },
            {
                title: "قمة الاتحاد الإفريقي تمناقش التنمية الاقتصادية",
                desc: "قادة الدول الإفريقية يجتمعون لبحث تعزيز التبادل التجاري وتطوير البنية التحتية.",
                category: "afrique",
                date: "قبل 4 ساعات"
            },
            {
                title: "تطورات جديدة في الاقتصاد العالمي",
                desc: "أسواق الأسهم العالمية تشهد تقلبات جديدة وسط تغيرات أسعار النفط والطاقة.",
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

let currentLang = 'fr'; // اللغة الافتراضية

// تغيير اللغة وتحميل البيانات
function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // تحديث أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // تحديث شريط العاجل
    const tickerTitle = document.querySelector('.ticker-title');
    const tickerContent = document.getElementById('ticker-content');
    
    if (tickerTitle) tickerTitle.textContent = i18nData[lang].urgentTitle;
    if (tickerContent) {
        tickerContent.innerHTML = i18nData[lang].tickerNews
            .map(item => `<span>🚨 ${item}</span>`)
            .join(' &nbsp;&nbsp;|&nbsp;&nbsp; ');
    }

    // عرض الأخبار
    renderNews();
}

// عرض قائمة الأخبار في الصفحة
function renderNews() {
    const newsContainer = document.getElementById('news-container') || document.querySelector('.news-grid');
    if (!newsContainer) return;

    const articles = i18nData[currentLang].news;
    newsContainer.innerHTML = articles.map(item => `
        <article class="news-card">
            <span class="category-badge">${i18nData[currentLang].categories[item.category] || item.category}</span>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <span class="news-date">${item.date}</span>
        </article>
    `).join('');
}

// التشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    switchLanguage('ar'); // البدء باللغة العربية تلقائياً
});
