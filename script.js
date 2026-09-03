const ADMIN_CODE = "Ila240792@@@+";

// قاموس الترجمات للغات الثلاث
const translations = {
    ar: {
        urgent: "عاجل 🚨",
        cat_tchad: "🇹🇩 تشاد",
        cat_africa: "🌍 إفريقيا",
        cat_world: "🌐 العالم",
        cat_opinion: "✍️ مقالات الرأي",
        btn_publish_top: "أنشر مقالتك ✍️",
        btn_admin_login: "دخول الأدمن 🔐",
        form_title: "أنشر مقالتك",
        lbl_avatar: "الصورة الشخصية للكاتب:",
        ph_name: "اسم الكاتب",
        ph_title: "عنوان المقال",
        ph_content: "... اكتب مقالك هنا",
        btn_submit: "أنشر مقالتك",
        btn_delete: "حذف المقال 🗑️",
        admin_prompt: "الرجاء إدخال كود الأدمن لدخول لوحة التحكم:",
        admin_success: "تم تسجيل الدخول كأدمن بنجاح!",
        admin_error: "كود الأدمن غير صحيح!",
        publish_success: "تم نشر مقالتك بنجاح!"
    },
    fr: {
        urgent: "URGENT 🚨",
        cat_tchad: "🇹🇩 Tchad",
        cat_africa: "🌍 Afrique",
        cat_world: "🌐 Monde",
        cat_opinion: "✍️ Articles d'opinion",
        btn_publish_top: "Publier votre article ✍️",
        btn_admin_login: "Connexion Admin 🔐",
        form_title: "Publier votre article",
        lbl_avatar: "Photo de profil de l'auteur :",
        ph_name: "Nom de l'auteur",
        ph_title: "Titre de l'article",
        ph_content: "... Écrivez votre article ici",
        btn_submit: "Publier votre article",
        btn_delete: "Supprimer l'article 🗑️",
        admin_prompt: "Veuillez entrer le code Admin :",
        admin_success: "Connexion Réussie en tant qu'Admin!",
        admin_error: "Code Admin incorrect!",
        publish_success: "Votre article a été publié avec succès!"
    },
    en: {
        urgent: "BREAKING 🚨",
        cat_tchad: "🇹🇩 Chad",
        cat_africa: "🌍 Africa",
        cat_world: "🌐 World",
        cat_opinion: "✍️ Opinion Articles",
        btn_publish_top: "Publish your article ✍️",
        btn_admin_login: "Admin Login 🔐",
        form_title: "Publish your article",
        lbl_avatar: "Author Profile Picture:",
        ph_name: "Author Name",
        ph_title: "Article Title",
        ph_content: "... Write your article here",
        btn_submit: "Publish your article",
        btn_delete: "Delete Article 🗑️",
        admin_prompt: "Please enter Admin Code:",
        admin_success: "Successfully logged in as Admin!",
        admin_error: "Incorrect Admin Code!",
        publish_success: "Your article was published successfully!"
    }
};

let currentLang = "ar";

let opinionArticles = [
    {
        id: 1,
        authorName: "خالد الأمين",
        authorImage: "https://via.placeholder.com/150",
        date: "2026-09-03T10:30:00",
        displayDate: "03/09/2026",
        title: "أسباب متراكمة",
        content: "كنت دوماً حين أقارن العالم الغربي، المتحرر من رمزية القبيلة وشعار الإثنية، مع عالمنا الشرقي المشبع بالقبيلة والقبلية..."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    setupCategoryNavigation();
    renderOpinionArticles();
    checkAdminStatus();
    switchLanguage("ar"); // ضبط اللغة الافتراضية
});

// تغيير اللغة وتحديث كافة أزرار ونصوص الواجهة
function switchLanguage(lang) {
    currentLang = lang;

    // تحديث أزرار اختيارات اللغة
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    // ضبط الاتجاه (RTL للعربية / LTR للإنجليزية والفرنسية)
    if (lang === "ar") {
        document.body.dir = "rtl";
        document.body.classList.remove("ltr");
    } else {
        document.body.dir = "ltr";
        document.body.classList.add("ltr");
    }

    // تحديث كافة النصوص والأزرار باللغة المختارة
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // تحديث النصوص الوصفية (Placeholders)
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
        const key = el.getAttribute("data-i18n-ph");
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    renderOpinionArticles();
}

function setupCategoryNavigation() {
    const catButtons = document.querySelectorAll(".cat-btn");
    catButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            catButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const category = btn.getAttribute("data-category");
            if (category === "opinion") {
                document.getElementById("news-section").classList.remove("active-section");
                document.getElementById("opinion-section").classList.add("active-section");
            } else {
                document.getElementById("opinion-section").classList.remove("active-section");
                document.getElementById("news-section").classList.add("active-section");
            }
        });
    });
}

function togglePublishForm() {
    const formContainer = document.getElementById("publish-form-container");
    formContainer.classList.toggle("hidden");
}

function renderOpinionArticles() {
    const container = document.getElementById("opinion-articles-container");
    container.innerHTML = "";

    const sortedArticles = [...opinionArticles].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedArticles.forEach(article => {
        const articleCard = document.createElement("div");
        articleCard.className = "article-card";
        articleCard.innerHTML = `
            <button class="admin-delete-btn admin-control" onclick="deleteArticle(${article.id})">${translations[currentLang].btn_delete}</button>
            <div class="author-header">
                <img src="${article.authorImage}" alt="${article.authorName}" class="author-avatar">
                <div class="author-meta">
                    <h4>${article.authorName}</h4>
                    <span class="date-text">${article.displayDate}</span>
                </div>
            </div>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-body">${article.content}</p>
        `;
        container.appendChild(articleCard);
    });

    checkAdminStatus();
}

function handleArticleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("author-name").value;
    const title = document.getElementById("article-title").value;
    const content = document.getElementById("article-content").value;
    const avatarInput = document.getElementById("author-avatar");

    let avatarUrl = "https://via.placeholder.com/150";
    if (avatarInput.files && avatarInput.files[0]) {
        avatarUrl = URL.createObjectURL(avatarInput.files[0]);
    }

    const now = new Date();
    const newArticle = {
        id: Date.now(),
        authorName: name,
        authorImage: avatarUrl,
        date: now.toISOString(),
        displayDate: now.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'fr-FR'),
        title: title,
        content: content
    };

    opinionArticles.push(newArticle);
    renderOpinionArticles();

    document.getElementById("opinion-form").reset();
    togglePublishForm();
    alert(translations[currentLang].publish_success);
}

function openAdminAuth() {
    const inputCode = prompt(translations[currentLang].admin_prompt);

    if (inputCode === ADMIN_CODE) {
        alert(translations[currentLang].admin_success);
        sessionStorage.setItem("isAdmin", "true");
        checkAdminStatus();
    } else if (inputCode !== null) {
        alert(translations[currentLang].admin_error);
    }
}

function checkAdminStatus() {
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    const adminControls = document.querySelectorAll(".admin-control");
    
    adminControls.forEach(ctrl => {
        ctrl.style.display = isAdmin ? "block" : "none";
    });
}

function deleteArticle(id) {
    if (confirm("Supprimer cet article ? / هل تريد حذف هذا المقال؟")) {
        opinionArticles = opinionArticles.filter(a => a.id !== id);
        renderOpinionArticles();
    }
}
