import utils from './utils';
import storage from './storage';
import template from './template';

const $todo = utils.$qs('.todo');
const $todoList = utils.$qs('.todo-list');
const $footer = utils.$qs('.footer');
let dragTargetId = null;
let timer = null;

const update = (preview = []) => {
  const filter = document.location.hash.replace(/^#/, '');
  const totalList = preview.length ? preview : storage.getItem();
  const completedList = totalList.filter((item) => item.completed);
  const activeList = totalList.filter((item) => !item.completed);
  const target = filter === '' ? totalList : filter === 'active' ? activeList : completedList;
  $todoList.innerHTML = template.todoItems(target);
  $footer.innerHTML = template.filters(activeList.length, filter, completedList.length);
};

const sortList = (e, preview = false) => {
  const dragCurrentId = parseInt(e.target.dataset.id || e.target.parentNode.dataset.id);
  if (dragTargetId && dragCurrentId && dragTargetId !== dragCurrentId) {
    const totalList = storage.getItem();
    const targetItem = totalList.find((item) => item.id === dragTargetId);
    const currentItemSort = totalList.findIndex((item) => item.id === dragCurrentId);
    if (targetItem) {
      const filterList = totalList.filter((item) => item.id !== dragTargetId);
      const newList = [...filterList.slice(0, currentItemSort), targetItem, ...filterList.slice(currentItemSort)];
      const sortLst = newList.map((e, i) => {
        e.sort = newList.length - (1 + i);
        return e;
      });
      if (!preview) {
        storage.setItem(sortLst);
      } else {
        update(sortLst);
      }
    }
  }
};

const bindEvent = () => {
  const { $on, $delegate } = utils;
  $on($todo, 'change', ({ target }) => {
    storage.setItem([
      ...storage.getItem(),
      {
        id: Date.now(),
        sort: storage.getItem().length,
        title: target.value,
        completed: false,
      },
    ]);
    update();
    target.value = '';
  });

  $delegate($footer, '.clear-completed', 'click', () => {
    const totalList = storage.getItem();
    storage.setItem(totalList.filter((item) => !item.completed));
    update();
  });

  $delegate($footer, '.filter', 'click', () => {
    setTimeout(() => update(), 100);
  });

  $delegate($todoList, '.delete', 'click', ({ target }) => {
    const id = parseInt(target.parentNode.dataset.id);
    const itemList = storage.getItem();
    storage.setItem(itemList.filter((item) => item.id !== id));
    update();
  });

  $delegate($todoList, '.todo-item', 'click', ({ target }) => {
    const id = parseInt(target.parentNode.dataset.id);
    let itemList = storage.getItem();
    itemList = itemList.map((item) => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    });
    storage.setItem(itemList);
    update();
  });

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
      timer = setTimeout(() => sortList(e, true), 2000);
    }
  });

  $on($todoList, 'dragleave', (e) => {
    if (e.target.classList.contains('todo-list__item')) {
      e.target.classList.remove('dragOver');
      clearTimeout(timer);
    }
  });

  $on($todoList, 'dragend', (e) => {
    e.preventDefault();
    e.target.classList.remove('dragItem');
    dragTargetId = null;
  });

  $on($todoList, 'drop', (e) => {
    sortList(e);
    update();
  });

  $on($todoList, 'keydown', (e) => {
    if (e.key === 'Escape') {
      document.dispatchEvent(new Event('mouseup'));
    }
  });
};

export default function init() {
  update();
  bindEvent();
}
