const storageKey = 'TODO_LIST';
const localStorage = window.localStorage;
const getLocalStorage = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
const setLocalStorage = (list) => localStorage.setItem(storageKey, JSON.stringify(list));

module.exports = {
  getLocalStorage,
  setLocalStorage,
};
