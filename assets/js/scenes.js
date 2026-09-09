const person = document.querySelector('[data-scene-person]');
const inspector = document.querySelector('[data-scene-inspector]');
const title = document.querySelector('[data-inspector-title]');
const text = document.querySelector('[data-inspector-text]');
const status = document.querySelector('[data-inspector-status]');

if (person && inspector && title && text && status) {
  const showPerson = () => {
    person.classList.add('is-active');
    inspector.classList.add('is-active');
    title.textContent = '于谦老师';
    text.textContent = '大冬天，光着膀子，抱着个白菜，站在街上。';
    status.textContent = '已聚焦：人物';
  };

  const resetInspector = () => {
    if (document.activeElement === person) return;
    person.classList.remove('is-active');
    inspector.classList.remove('is-active');
    title.textContent = '等待聚焦';
    text.textContent = '把鼠标移到画面中的人物上，或按 Tab 键聚焦人物。';
    status.textContent = '未选中对象';
  };

  person.addEventListener('mouseenter', showPerson);
  person.addEventListener('mouseleave', resetInspector);
  person.addEventListener('focus', showPerson);
  person.addEventListener('blur', resetInspector);
  person.addEventListener('click', showPerson);
  person.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showPerson();
    }
  });
}
