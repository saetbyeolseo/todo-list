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
  const { $on, $delegate } = utils;
  $on($todo, 'change', ({ target }) => {
    store.setItem([
      ...store.getItem(),
      {
        id: Date.now(),
        sort: store.getItem().length,
        title: target.value,
        completed: false,
      },
    ]);
    update();
    target.value = '';
  });

  $delegate($todoList, '.delete', 'click', ({ target }) => {
    const id = parseInt(target.parentNode.dataset.id);
    const itemList = store.getItem();
    store.setItem(itemList.filter((item) => item.id !== id));
    update();
  });

  $delegate($todoList, '.todo-item', 'click', ({ target }) => {
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

  $delegate($footer, '.clear-completed', 'click', () => {
    const totalList = store.getItem();
    store.setItem(totalList.filter((item) => !item.completed));
    update();
  });

  $delegate($footer, '.filter', 'click', () => {
    setTimeout(() => update(), 100);
  });

  let dragTargetId = null;

  $on($todoList, 'dragstart', (e) => {
    dragTargetId = parseInt(e.target.dataset.id || e.target.parentNode.dataset.id);
    e.target.classList.add('dragItem');
  });
  $on($todoList, 'dragover', (e) => {
    e.preventDefault();
  });
  $on($todoList, 'dragenter', (e) => {
    if (e.target.classList.contains('todo-list__item')) {
      e.target.classList.add('dragOver');
    }
  });
  $on($todoList, 'dragleave', (e) => {
    if (e.target.classList.contains('todo-list__item')) {
      e.target.classList.remove('dragOver');
    }
  });
  $on($todoList, 'dragend', (e) => {
    e.preventDefault();
    e.target.classList.remove('dragItem');
    dragTargetId = null;
  });
  $on($todoList, 'drop', (e) => {
    const dragCurrentId = parseInt(e.target.dataset.id || e.target.parentNode.dataset.id);
    if (dragTargetId && dragCurrentId && dragTargetId !== dragCurrentId) {
      const totalList = store.getItem();
      const targetItem = totalList.find((item) => item.id === dragTargetId);
      const currentItemSort = totalList.findIndex((item) => item.id === dragCurrentId);
      if (targetItem) {
        const filterList = totalList.filter((item) => item.id !== dragTargetId);
        const newList = [...filterList.slice(0, currentItemSort), targetItem, ...filterList.slice(currentItemSort)];
        store.setItem(
          [...newList].map((e, i) => {
            e.sort = newList.length - (1 + i);
            return e;
          })
        );
      }
      update();
    }
  });
};

export default function init() {
  update();
  bindEvent();
}
