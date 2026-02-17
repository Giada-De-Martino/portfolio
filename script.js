// --- Sections to load ---
const sections = [
    "sections/navbar.html",
    "sections/hero.html",
    "sections/about.html",
    "sections/skills.html",
    "sections/parcours.html",
    "sections/projects.html",
    "sections/contact.html"
];

const content = document.getElementById("content");
// Use the correct id for the language selector
let languageSwitcher;

let translations = {}; // Will hold loaded translations

// --- Load translation file dynamically ---
async function loadTranslations(lang) {
    try {
        const response = await fetch(`translations/${lang}.json`);
        const data = await response.json();
        // If your JSON has nested language keys like {"fr": {...}}, extract it
        translations = data[lang] || data;
        switchLanguage(lang); // Apply translation after loading
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

// --- Function to switch language ---
function switchLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
}

// --- Load sections dynamically ---
async function loadSections() {
    content.innerHTML = ""; // Clear content first
    for (const section of sections) {
        const response = await fetch(section);
        const html = await response.text();
        content.innerHTML += html;
    }

    // After sections loaded, get the language selector
    languageSwitcher = document.getElementById("language-selector");
    if (languageSwitcher) {
        const savedLang = localStorage.getItem("lang") || "en";
        languageSwitcher.value = savedLang;
        languageSwitcher.addEventListener("change", async (e) => {
            const lang = e.target.value;
            localStorage.setItem("lang", lang); // Remember choice
            await loadTranslations(lang);
        });
        await loadTranslations(languageSwitcher.value);
    }
}

// --- Initialize ---
loadSections();
