const sections = [
    "sections/hero.html",
    "sections/about.html",
    "sections/skills.html",
    "sections/parcours.html",
    "sections/projects.html",
    "sections/contact.html"
];

const content = document.getElementById("content");

sections.forEach(section => {
    fetch(section)
        .then(response => response.text())
        .then(data => {
            content.innerHTML += data;
        });
});
