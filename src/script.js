// --- Sections to load ---
const sections = [
  "./src/sections/hero.html",
  "./src/sections/about.html",
  "./src/sections/skills.html",
  "./src/sections/parcours.html",
  "./src/sections/projects.html",
  "./src/sections/contact.html",
];

const content = document.getElementById("content");
const languageSwitcher = document.getElementById("language-selector");
let translations = {};

// --- Load translation file dynamically ---
async function loadTranslations(lang) {
  try {
    const response = await fetch(`./src/languages/${lang}.json`);
    const data = await response.json();
    translations = data[lang] || data;
    switchLanguage(lang); // Apply translation after loading
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

// --- Function to switch language ---
function switchLanguage(lang) {
  function getNested(obj, path) {
    return path
      .split(".")
      .reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = getNested(translations, key);
    if (value !== null) {
      if (Array.isArray(value)) {
        el.textContent = value.join(", ");
      } else {
        el.textContent = value;
      }
    }
  });

  // Handle placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = getNested(translations, key);
    if (value !== null) {
      el.placeholder = value;
    }
  });
}

// Expose a global function for the inline onchange handler in index.html
window.changeLanguage = async function () {
  const lang = document.getElementById("language-selector").value;
  localStorage.setItem("lang", lang);
  await loadTranslations(lang);
};

// --- Load sections dynamically ---
async function loadSections() {
  for (const section of sections) {
    const response = await fetch(section);
    const html = await response.text();
    content.innerHTML += html;
  }
}

// --- Initialize language switcher ---
const savedLang = localStorage.getItem("lang") || "en";
languageSwitcher.value = savedLang;

// Load sections first so elements with data-i18n exist, then load translations
loadSections().then(() => loadTranslations(savedLang));
