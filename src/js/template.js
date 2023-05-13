const todoItems = (todoList) =>
  todoList.reduce(
    (list, todo) =>
      list +
      `<li class="todo-list__item" data-id="${todo.id}">
<label class="todo-item ${todo.completed ? `completed` : ``}" >${todo.title}</label>
<button class='delete'>삭제</button>
</li>`,
    ''
  );
const filters = (todoTotal, filter, completed) => `<span class="todo-count">${todoTotal}개 남음</span>
<ul class="filters">
  <li>
    <a href="#" class="filter ${filter === '' ? `selected` : ``}" >전체</a>
  </li>
  <li>
    <a href="#active" class="filter ${filter === 'active' ? `selected` : ``}" >완료 전</a>
  </li>
  <li>
    <a href="#completed" class="filter ${filter === 'completed' ? `selected` : ``}" >완료</a>
  </li>
</ul>
<button class="clear-completed">완료삭제${completed > 0 ? '(' + completed + ')' : ``}</button>`;

export default {
  todoItems,
  filters,
};
