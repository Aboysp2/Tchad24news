document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Setup (Default: EN, Saves choice in localStorage)
    const savedLang = localStorage.getItem('preferred_lang') || 'en';

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
            publishTabBtn: "✍️ Publish Article"
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
            publishTabBtn: "✍️ Publier un article"
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
            publishTabBtn: "✍️ أنشر مقالتك"
        }
    };

    function setLanguage(lang) {
        localStorage.setItem('preferred_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        const t = translations[lang] || translations.en;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (t[key]) el.textContent = t[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (t[key]) el.placeholder = t[key];
        });
    }

    // Language Toggle Listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });

    // 2. Navigation & Opinion Toggle Logic
    const categoryBtns = document.querySelectorAll('.category-btn');
    const opinionSection = document.getElementById('opinion-section');
    const newsContainer = document.getElementById('news-container');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            
            // Show opinion section ONLY if opinion category is active
            if (category === 'opinion') {
                opinionSection.style.display = 'block';
                newsContainer.style.display = 'none';
            } else {
                opinionSection.style.display = 'none';
                newsContainer.style.display = 'grid';
            }
        });
    });

    // 3. Sub-tabs inside Opinion Section
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const publishForm = document.getElementById('publish-form-container');
    const adminLogin = document.getElementById('admin-login-container');

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

    // Theme Switcher (Dark Mode)
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Initialize Page Settings
    setLanguage(savedLang);
});
