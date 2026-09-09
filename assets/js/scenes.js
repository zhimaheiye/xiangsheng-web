const targets = [...document.querySelectorAll('[data-scene-target]')];
const inspector = document.querySelector('[data-scene-inspector]');
const title = document.querySelector('[data-inspector-title]');
const text = document.querySelector('[data-inspector-text]');
const status = document.querySelector('[data-inspector-status]');

if (targets.length && inspector && title && text && status) {
  const showTarget = (target) => {
    targets.forEach((item) => item.classList.toggle('is-active', item === target));
    inspector.classList.add('is-active');
    title.textContent = target.dataset.title || '场景对象';
    text.textContent = target.dataset.text || '暂无说明。';
    status.textContent = target.dataset.status || '已聚焦：场景对象';
  };

  const resetInspector = (target) => {
    if (document.activeElement === target) return;
    target.classList.remove('is-active');
    if (targets.some((item) => item.matches(':hover') || document.activeElement === item)) return;
    inspector.classList.remove('is-active');
    title.textContent = '等待聚焦';
    text.textContent = '把鼠标移到画面中的人物上，或按 Tab 键聚焦人物。';
    status.textContent = '未选中对象';
  };

  targets.forEach((target) => {
    target.addEventListener('mouseenter', () => showTarget(target));
    target.addEventListener('mouseleave', () => resetInspector(target));
    target.addEventListener('focus', () => showTarget(target));
    target.addEventListener('blur', () => resetInspector(target));
    target.addEventListener('click', () => showTarget(target));
    target.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showTarget(target);
      }
    });
  });
}
