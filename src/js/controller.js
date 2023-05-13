import utils from './utils';
import store from './store';
import template from './template';

const $todo = utils.$qs('.todo');
const $todoList = utils.$qs('.todo-list');
const $footer = utils.$qs('.footer');

const update = () => {
  const filter = document.location.hash.replace(/^#/, '');
  const totalList = store.getItem();
  const completedList = totalList.filter((item) => item.completed);
  const activeList = totalList.filter((item) => !item.completed);
  const target = filter === '' ? totalList : filter === 'active' ? activeList : completedList;
  $todoList.innerHTML = template.todoItems(target);
  $footer.innerHTML = template.filters(activeList.length, filter, completedList.length);
};

const bindEvent = () => {
  utils.$on($todo, 'change', ({ target }) => {
    store.setItem([
      ...store.getItem(),
      {
        id: Date.now(),
        title: target.value,
        completed: false,
      },
    ]);
    update();
    target.value = '';
  });

  utils.$delegate($todoList, '.delete', 'click', ({ target }) => {
    const id = parseInt(target.parentNode.dataset.id);
    const itemList = getItem();
    setItem(itemList.filter((item) => item.id !== id));
    update();
  });

  utils.$delegate($todoList, '.todo-item', 'click', ({ target }) => {
    const id = parseInt(target.parentNode.dataset.id);
    let itemList = store.getItem();
    itemList = itemList.map((item) => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    });
    store.setItem(itemList);
    update();
  });

  utils.$delegate($footer, '.clear-completed', 'click', () => {
    const totalList = store.getItem();
    store.setItem(totalList.filter((item) => !item.completed));
    update();
  });

  utils.$delegate($footer, '.filter', 'click', () => {
    setTimeout(() => update(), 100);
  });
};

export default function init() {
  update();
  bindEvent();
}
