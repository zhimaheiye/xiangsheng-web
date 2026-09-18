const events = [
  { month: 3, day: 15, title: '排油节' },
  { month: 5, day: 12, title: '屈原的头七' }
];

const titleNode = document.querySelector('[data-calendar-title]');
const grid = document.querySelector('[data-calendar-grid]');
const datePanel = document.querySelector('[data-date-panel]');
const dateTitle = document.querySelector('[data-date-title]');
const dateText = document.querySelector('[data-date-text]');
const dateStatus = document.querySelector('[data-date-status]');
const actionButtons = [...document.querySelectorAll('[data-month-action]')];
const jumpButtons = [...document.querySelectorAll('[data-jump-month]')];

const now = new Date();
const params = new URLSearchParams(window.location.search);
const requestedMonth = Number(params.get('month'));
const initialMonth = Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12
  ? requestedMonth - 1
  : now.getMonth();

let viewYear = now.getFullYear();
let viewMonth = initialMonth;
let selectedDay = null;

const getEvent = (month, day) =>
  events.find((item) => item.month === month && item.day === day) || null;

const showDate = (day) => {
  selectedDay = day;
  const event = getEvent(viewMonth + 1, day);

  if (dateTitle) {
    dateTitle.textContent = `${String(viewMonth + 1).padStart(2, '0')}月${String(day).padStart(2, '0')}日`;
  }

  if (event) {
    datePanel?.classList.add('has-event');
    if (dateText) dateText.textContent = event.title;
    if (dateStatus) dateStatus.textContent = '已登记事项';
  } else {
    datePanel?.classList.remove('has-event');
    if (dateText) dateText.textContent = '暂无登记事项。';
    if (dateStatus) dateStatus.textContent = '无登记事项';
  }

  renderCalendar();
};

const renderCalendar = () => {
  if (!grid || !titleNode) return;

  titleNode.textContent = `${viewYear}年 ${String(viewMonth + 1).padStart(2, '0')}月`;
  grid.innerHTML = '';

  const firstDay = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const mondayOffset = (firstDay.getDay() + 6) % 7;

  for (let index = 0; index < mondayOffset; index += 1) {
    const blank = document.createElement('div');
    blank.className = 'calendar-empty';
    blank.setAttribute('aria-hidden', 'true');
    grid.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const event = getEvent(viewMonth + 1, day);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'calendar-day';

    if (event) button.classList.add('has-event');
    if (selectedDay === day) button.classList.add('is-selected');
    if (
      viewYear === now.getFullYear() &&
      viewMonth === now.getMonth() &&
      day === now.getDate()
    ) {
      button.classList.add('is-today');
    }

    button.setAttribute(
      'aria-label',
      event
        ? `${viewMonth + 1}月${day}日，${event.title}`
        : `${viewMonth + 1}月${day}日`
    );

    const number = document.createElement('span');
    number.className = 'day-number';
    number.textContent = day;
    button.appendChild(number);

    if (event) {
      const tag = document.createElement('span');
      tag.className = 'calendar-event';
      tag.textContent = event.title;
      button.appendChild(tag);
    }

    button.addEventListener('click', () => showDate(day));
    grid.appendChild(button);
  }
};

const changeMonth = (delta) => {
  viewMonth += delta;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear -= 1;
  } else if (viewMonth > 11) {
    viewMonth = 0;
    viewYear += 1;
  }
  selectedDay = null;
  datePanel?.classList.remove('has-event');
  if (dateTitle) dateTitle.textContent = '请选择日期';
  if (dateText) dateText.textContent = '点击月历中的日期查看登记事项。';
  if (dateStatus) dateStatus.textContent = '未选中日期';
  renderCalendar();
};

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.monthAction;
    if (action === 'prev') changeMonth(-1);
    if (action === 'next') changeMonth(1);
    if (action === 'today') {
      viewYear = now.getFullYear();
      viewMonth = now.getMonth();
      selectedDay = now.getDate();
      showDate(selectedDay);
    }
  });
});

jumpButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const month = Number(button.dataset.jumpMonth);
    const day = Number(button.dataset.jumpDay);
    if (!Number.isInteger(month) || !Number.isInteger(day)) return;
    viewMonth = Math.min(12, Math.max(1, month)) - 1;
    selectedDay = Math.max(1, day);
    showDate(selectedDay);
  });
});

renderCalendar();

if (requestedMonth >= 1 && requestedMonth <= 12) {
  const firstEvent = events.find((item) => item.month === requestedMonth);
  if (firstEvent) showDate(firstEvent.day);
}
