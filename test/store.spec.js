import storage from '../src/js/storage';

describe('storage test', () => {
  beforeEach(() => {
    // 테스트 전 localStorage 초기화
    localStorage.clear();
  });
  describe('getItem', () => {
    it('기존에 저장되어 있던 정보를 가지고 옵니다.', () => {
      const testData = [{ id: 1, sort: 0, title: 'test todo!', completed: false }];
      localStorage.setItem('TODO_LIST', JSON.stringify(testData));
      const result = storage.getItem();
      expect(result).toEqual(testData);
    });
    it('저장 된 값이 없을 경우 빈배열을 가지고 옵니다.', () => {
      const result = storage.getItem();
      expect(result).toEqual([]);
    });
    it('sort를 기준으로 정렬합니다.', () => {
      const testData = [
        { id: 1, title: 'test todo', completed: false, sort: 1 },
        { id: 2, title: 'test todo', completed: false, sort: 2 },
        { id: 3, title: 'test todo', completed: false, sort: 0 },
      ];
      localStorage.setItem('TODO_LIST', JSON.stringify(testData));
      const result = storage.getItem();
      expect(result).toEqual([
        { id: 2, title: 'test todo', completed: false, sort: 2 },
        { id: 1, title: 'test todo', completed: false, sort: 1 },
        { id: 3, title: 'test todo', completed: false, sort: 0 },
      ]);
    });
  });
});
