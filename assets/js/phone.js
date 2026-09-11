const CORRECT_PIN = '315';
const MAX_PIN_LENGTH = 3;

const lockScreen = document.querySelector('[data-lock-screen]');
const homeScreen = document.querySelector('[data-home-screen]');
const pinDots = [...document.querySelectorAll('[data-pin-dot]')];
const errorText = document.querySelector('[data-error-text]');
const hintBox = document.querySelector('[data-hints]');
const keys = [...document.querySelectorAll('[data-key]')];
const timeNodes = [...document.querySelectorAll('[data-phone-time]')];
const dateNode = document.querySelector('[data-phone-date]');

const hints = [
  '排油节排油节',
  '郭德纲中过的彩票密码',
  '消费者权益日'
];

let pin = '';
let failures = 0;

const renderTime = () => {
  const now = new Date();
  const time = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);

  timeNodes.forEach((node) => {
    node.textContent = time;
  });

  if (dateNode) {
    dateNode.textContent = new Intl.DateTimeFormat('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(now);
  }
};

const renderPin = () => {
  pinDots.forEach((dot, index) => {
    dot.classList.toggle('is-filled', index < pin.length);
  });
};

const renderHints = () => {
  if (!hintBox) return;
  hintBox.innerHTML = '';
  hints.slice(0, Math.min(failures, hints.length)).forEach((hint, index) => {
    const line = document.createElement('p');
    line.className = 'hint-line';
    line.innerHTML = `<strong>提示 ${index + 1}</strong>：${hint}`;
    hintBox.appendChild(line);
  });
};

const shake = () => {
  if (!lockScreen) return;
  lockScreen.classList.remove('is-shaking');
  void lockScreen.offsetWidth;
  lockScreen.classList.add('is-shaking');
};

const failAttempt = () => {
  failures += 1;
  pin = '';
  renderPin();
  renderHints();
  if (errorText) errorText.textContent = '密码错误';
  shake();
};

const unlock = () => {
  if (!lockScreen || !homeScreen) return;
  lockScreen.hidden = true;
  homeScreen.classList.add('is-visible');
  homeScreen.removeAttribute('hidden');
};

const submitPin = () => {
  if (pin === CORRECT_PIN) {
    unlock();
  } else {
    failAttempt();
  }
};

const addDigit = (digit) => {
  if (!/^\d$/.test(digit) || pin.length >= MAX_PIN_LENGTH) return;
  pin += digit;
  if (errorText) errorText.textContent = '';
  renderPin();
  if (pin.length === MAX_PIN_LENGTH) {
    window.setTimeout(submitPin, 120);
  }
};

const backspace = () => {
  pin = pin.slice(0, -1);
  if (errorText) errorText.textContent = '';
  renderPin();
};

keys.forEach((key) => {
  key.addEventListener('click', () => {
    const value = key.dataset.key;
    if (value === 'backspace') backspace();
    else addDigit(value);
  });
});

document.addEventListener('keydown', (event) => {
  if (homeScreen?.classList.contains('is-visible')) return;

  if (/^\d$/.test(event.key)) {
    addDigit(event.key);
  } else if (event.key === 'Backspace' || event.key === 'Delete') {
    backspace();
  } else if (event.key === 'Enter' && pin.length) {
    submitPin();
  }
});

renderTime();
renderPin();
renderHints();
window.setInterval(renderTime, 30000);
