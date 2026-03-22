// Unit Tests for Storage Utility
// tests/unit/utils/storage.test.js
import { describe, it, expect, beforeEach } from 'vitest';

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('set()', () => {
    it('should store string value', () => {
      const storage = await import('../../../src/utils/storage.js');
      const result = storage.storage.set('testKey', 'testValue');

      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should store object value', () => {
      const storage = await import('../../../src/utils/storage.js');
      const testObj = { name: 'test', value: 123 };
      storage.storage.set('testObj', testObj);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'testObj',
        JSON.stringify(testObj)
      );
    });

    it('should return false on error', () => {
      const storage = await import('../../../src/utils/storage.js');
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => { throw new Error('Quota exceeded'); };

      const result = storage.storage.set('testKey', 'testValue');

      expect(result).toBe(false);
      localStorage.setItem = originalSetItem;
    });
  });

  describe('get()', () => {
    it('should retrieve string value', () => {
      const storage = await import('../../../src/utils/storage.js');
      localStorage.setItem('testKey', JSON.stringify('testValue'));

      const result = storage.storage.get('testKey');

      expect(result).toBe('testValue');
    });

    it('should retrieve object value', () => {
      const storage = await import('../../../src/utils/storage.js');
      const testObj = { name: 'test', value: 123 };
      localStorage.setItem('testObj', JSON.stringify(testObj));

      const result = storage.storage.get('testObj');

      expect(result).toEqual(testObj);
    });

    it('should return fallback for missing key', () => {
      const storage = await import('../../../src/utils/storage.js');
      const fallback = 'defaultValue';

      const result = storage.storage.get('nonExistentKey', fallback);

      expect(result).toBe(fallback);
    });

    it('should return null for missing key without fallback', () => {
      const storage = await import('../../../src/utils/storage.js');

      const result = storage.storage.get('nonExistentKey');

      expect(result).toBeNull();
    });
  });

  describe('remove()', () => {
    it('should remove key from localStorage', () => {
      const storage = await import('../../../src/utils/storage.js');
      localStorage.setItem('testKey', 'testValue');

      storage.storage.remove('testKey');

      expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
    });
  });
});
