document.querySelectorAll('.nav-inner a').forEach((link) => {
  if (link.href === window.location.href) link.setAttribute('aria-current', 'page');
});

const quotePool = [
  { text: '人生难得一只鸡', author: '郭德纲' },
  { text: '不平胸，何以平天下', author: '' }
];

document.querySelectorAll('[data-random-quote]').forEach((node) => {
  const quote = quotePool[Math.floor(Math.random() * quotePool.length)];
  const text = node.querySelector('strong');
  const author = node.querySelector('small');
  if (text) text.textContent = `“${quote.text}”`;
  if (author) {
    author.textContent = quote.author ? `—— ${quote.author}` : '';
    author.hidden = !quote.author;
  }
});

const modal = document.querySelector('[data-portal-notice]');
const closeButton = document.querySelector('[data-close-notice]');
const noticeKey = 'xiangsheng-portal-notice-seen';

if (modal) {
  let hasSeenNotice = false;
  try {
    hasSeenNotice = localStorage.getItem(noticeKey) === '1';
  } catch (error) {
    hasSeenNotice = false;
  }

  if (!hasSeenNotice) {
    modal.hidden = false;
    closeButton?.focus();
  }

  const closeNotice = () => {
    modal.hidden = true;
    try {
      localStorage.setItem(noticeKey, '1');
    } catch (error) {
      // Local storage may be unavailable; the site still works without it.
    }
  };

  closeButton?.addEventListener('click', closeNotice);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeNotice();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeNotice();
  });
}
