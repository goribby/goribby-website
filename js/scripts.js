// ==========================
// MENU TOGGLE
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".node-menu");

    toggle.addEventListener("click", () => {
        menu.classList.toggle("open");
    });

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("open");
        });
    });

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove("open");
        }
    });

});