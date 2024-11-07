// menu.js
function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

function closeMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('open');
}

document.addEventListener('click', (event) => {
    const sidebar = document.querySelector('.sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
        closeMenu();
    }
});