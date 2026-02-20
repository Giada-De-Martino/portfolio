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

  // Update footer text if present in translations
  const footerText = (function () {
    const v = (function () {
      return translations &&
        translations.footer &&
        translations.footer.footerText
        ? translations.footer.footerText
        : null;
    })();
    return v;
  })();
  if (footerText) {
    const p = document.querySelector("footer p");
    if (p) p.textContent = footerText;
  }
}

// Expose a global function for the inline onchange handler in index.html
window.changeLanguage = async function () {
  const sel = document.getElementById("language-selector");
  if (!sel) return;
  const lang = sel.value;
  localStorage.setItem("lang", lang);
  await loadTranslations(lang);
};

// --- Load sections dynamically ---
async function loadSections() {
  content.innerHTML = ""; // Clear content first
  for (const section of sections) {
    const response = await fetch(section);
    const html = await response.text();
    content.innerHTML += html;
  }
}

// --- Initialize language switcher ---
const savedLang = localStorage.getItem("lang") || "en";
if (languageSwitcher) languageSwitcher.value = savedLang;
if (languageSwitcher)
  languageSwitcher.addEventListener("change", async (e) => {
    const lang = e.target.value;
    localStorage.setItem("lang", lang); // Remember choice
    await loadTranslations(lang);
  });

// Load sections first so elements with data-i18n exist, then load translations
loadSections().then(() => loadTranslations(savedLang));
