const storageKey = 'TODO_LIST';
const localStorage = window.localStorage;
const getItem = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
const setItem = (list) => localStorage.setItem(storageKey, JSON.stringify(list));

export default {
  getItem,
  setItem,
};
