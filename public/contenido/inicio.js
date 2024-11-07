// Animación de parpadeo
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.classList.add('blink');
    });
    item.addEventListener('mouseleave', () => {
        item.classList.remove('blink');
    });
});