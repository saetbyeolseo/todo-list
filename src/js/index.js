import '../css/index.scss';
import { $qs, $delegate, $on } from './utils';
import { getLocalStorage, setLocalStorage } from './store';
import { todoItems, footerFilters } from './template';

const $todo = $qs('.todo');
const $clearCompleted = $qs('.clear-completed');
const $todoList = $qs('.todo-list');
const $footer = $qs('.footer');

const updateView = () => {
  const filter = document.location.hash.replace(/^#/, '');
  const totalList = getLocalStorage();
  const completedList = totalList.filter((item) => item.completed);
  const activeList = totalList.filter((item) => !item.completed);
  const target = filter === '' ? totalList : filter === 'active' ? activeList : completedList;
  $todoList.innerHTML = todoItems(target);

  $footer.innerHTML = footerFilters(activeList.length, filter, completedList.length);
};

updateView();

$on($todo, 'change', ({ target }) => {
  setLocalStorage([
    ...getLocalStorage(),
    {
      id: Date.now(),
      title: target.value,
      completed: false,
    },
  ]);
  updateView();
  target.value = '';
});

$delegate($todoList, '.delete', 'click', ({ target }) => {
  const id = parseInt(target.parentNode.dataset.id);
  const itemList = getLocalStorage();
  setLocalStorage(itemList.filter((item) => item.id !== id));
  updateView();
});

$delegate($todoList, '.todo-item', 'click', ({ target }) => {
  const id = parseInt(target.parentNode.dataset.id);
  let itemList = getLocalStorage();
  itemList = itemList.map((item) => {
    if (item.id === id) {
      item.completed = !item.completed;
    }
    return item;
  });
  setLocalStorage(itemList);
  updateView();
});

$delegate($footer, '.clear-completed', 'click', () => {
  const totalList = getLocalStorage();
  setLocalStorage(totalList.filter((item) => !item.completed));
  updateView();
});

$delegate($footer, '.filter', 'click', () => {
  setTimeout(() => updateView(), 100);
});
