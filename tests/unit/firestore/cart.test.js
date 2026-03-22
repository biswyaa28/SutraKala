// Unit Tests for Cart Module
// tests/unit/firestore/cart.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Cart Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('mergeCartItems', () => {
    it('should merge guest cart with user cart', async () => {
      const { mergeCartItems } = await import('../../../src/utils/cart-sync.js');

      const guestCart = [
        { productId: '1', name: 'Product 1', qty: 2, size: 'M' },
        { productId: '2', name: 'Product 2', qty: 1, size: 'L' }
      ];

      const userCart = [
        { productId: '1', name: 'Product 1', qty: 1, size: 'M' },
        { productId: '3', name: 'Product 3', qty: 3, size: 'S' }
      ];

      const merged = mergeCartItems(guestCart, userCart);

      expect(merged.length).toBe(3);
      expect(merged.find(item => item.productId === '1').qty).toBe(3);
    });

    it('should handle empty guest cart', async () => {
      const { mergeCartItems } = await import('../../../src/utils/cart-sync.js');

      const guestCart = [];
      const userCart = [{ productId: '1', name: 'Product 1', qty: 1 }];

      const merged = mergeCartItems(guestCart, userCart);

      expect(merged).toEqual(userCart);
    });

    it('should handle empty user cart', async () => {
      const { mergeCartItems } = await import('../../../src/utils/cart-sync.js');

      const guestCart = [{ productId: '1', name: 'Product 1', qty: 1 }];
      const userCart = [];

      const merged = mergeCartItems(guestCart, userCart);

      expect(merged.length).toBe(1);
    });

    it('should deduplicate by productId and size', async () => {
      const { mergeCartItems } = await import('../../../src/utils/cart-sync.js');

      const guestCart = [
        { productId: '1', name: 'Product 1', qty: 1, size: 'M' }
      ];

      const userCart = [
        { productId: '1', name: 'Product 1', qty: 2, size: 'M' },
        { productId: '1', name: 'Product 1', qty: 1, size: 'L' }
      ];

      const merged = mergeCartItems(guestCart, userCart);

      expect(merged.length).toBe(2);
      expect(merged.find(item => item.size === 'M').qty).toBe(3);
      expect(merged.find(item => item.size === 'L').qty).toBe(1);
    });
  });

  describe('getCartItemCount', () => {
    it('should return total item count', async () => {
      const { getCartItemCount } = await import('../../../src/utils/cart-sync.js');

      const cartItems = [
        { productId: '1', qty: 2 },
        { productId: '2', qty: 3 },
        { productId: '3', qty: 1 }
      ];

      const count = getCartItemCount(cartItems);

      expect(count).toBe(6);
    });

    it('should handle missing qty field', async () => {
      const { getCartItemCount } = await import('../../../src/utils/cart-sync.js');

      const cartItems = [
        { productId: '1' },
        { productId: '2', qty: 2 }
      ];

      const count = getCartItemCount(cartItems);

      expect(count).toBe(3);
    });

    it('should return 0 for empty cart', async () => {
      const { getCartItemCount } = await import('../../../src/utils/cart-sync.js');

      const count = getCartItemCount([]);

      expect(count).toBe(0);
    });
  });

  describe('getCartTotal', () => {
    it('should calculate total price', async () => {
      const { getCartTotal } = await import('../../../src/utils/cart-sync.js');

      const cartItems = [
        { productId: '1', price: 100, qty: 2 },
        { productId: '2', price: 50, qty: 3 }
      ];

      const total = getCartTotal(cartItems);

      expect(total).toBe(350);
    });

    it('should handle missing price field', async () => {
      const { getCartTotal } = await import('../../../src/utils/cart-sync.js');

      const cartItems = [
        { productId: '1', qty: 2 },
        { productId: '2', price: 50, qty: 1 }
      ];

      const total = getCartTotal(cartItems);

      expect(total).toBe(50);
    });
  });
});
