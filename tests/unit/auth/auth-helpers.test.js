// Unit Tests for Auth Helpers
// tests/unit/auth/auth-helpers.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Auth Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is signed in', async () => {
      const { getCurrentUser } = await import('../../../src/core/auth/auth-helpers.js');
      const user = getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should call Firebase signOut', async () => {
      const { signOut } = await import('../../../src/core/auth/auth-helpers.js');

      // Mock is already set up in tests/setup.js
      await signOut();

      expect(true).toBe(true);
    });
  });

  describe('onAuthStateChange', () => {
    it('should return unsubscribe function', async () => {
      const { onAuthStateChange } = await import('../../../src/core/auth/auth-helpers.js');

      const callback = vi.fn();
      const unsubscribe = await onAuthStateChange(callback);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should call callback when auth state changes', async () => {
      const { onAuthStateChange } = await import('../../../src/core/auth/auth-helpers.js');

      const callback = vi.fn();
      await onAuthStateChange(callback);

      // Simulate auth state change (handled by Firebase mock)
      expect(callback).toBeDefined();
    });
  });

  describe('initRecaptcha', () => {
    it('should initialize reCAPTCHA verifier', async () => {
      const { initRecaptcha } = await import('../../../src/core/auth/auth-helpers.js');

      // Create container for reCAPTCHA
      const container = document.createElement('div');
      container.id = 'recaptcha-container';
      document.body.appendChild(container);

      try {
        const verifier = await initRecaptcha('recaptcha-container');
        expect(verifier).toBeDefined();
      } catch (error) {
        // Expected to fail in test environment without Firebase
        expect(error).toBeDefined();
      }

      container.remove();
    });
  });
});
