// Mobile menu toggle (only visible at ≤700px).
const menuButton = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
if (menuButton && header) {
  const setMenu = open => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
    header.classList.toggle('menu-open', open);
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
}
