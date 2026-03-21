// js/utils/cart-sync.js
/**
 * Cart synchronization between localStorage and Firestore
 * Handles merging guest cart to user cart on login
 */

import { storage } from './storage.js';
import { getUserCart, updateUserCart } from '../core/user-service.js';

/**
 * Merge guest cart (localStorage) with user cart (Firestore)
 * Deduplicates items by productId and size, preserving higher quantities
 * @param {Array} guestCart - Cart items from localStorage
 * @param {Array} userCart - Cart items from Firestore
 * @returns {Array} Merged cart items
 */
export function mergeCartItems(guestCart, userCart) {
  if (!Array.isArray(guestCart) || !Array.isArray(userCart)) {
    console.warn('[CartSync] Invalid cart arrays provided');
    return userCart || guestCart || [];
  }

  // If user cart is empty, just return guest cart
  if (userCart.length === 0) {
    return guestCart.map(item => ({
      ...item,
      addedAt: item.addedAt || new Date().toISOString()
    }));
  }

  // If guest cart is empty, return user cart
  if (guestCart.length === 0) {
    return userCart;
  }

  console.log('[CartSync] Merging carts - Guest:', guestCart.length, 'User:', userCart.length);

  // Create a map for faster lookups
  const mergedMap = new Map();

  // Add all user cart items to the map first (user cart takes precedence for timestamps)
  userCart.forEach(item => {
    const key = `${item.productId || item.id}_${item.size || 'default'}`;
    mergedMap.set(key, { ...item });
  });

  // Merge guest cart items
  guestCart.forEach(guestItem => {
    const key = `${guestItem.productId || guestItem.id}_${guestItem.size || 'default'}`;
    
    if (mergedMap.has(key)) {
      // Item exists - add quantities
      const existing = mergedMap.get(key);
      existing.qty = (existing.qty || 1) + (guestItem.qty || 1);
      mergedMap.set(key, existing);
    } else {
      // New item from guest cart
      mergedMap.set(key, {
        ...guestItem,
        productId: guestItem.productId || guestItem.id, // Normalize ID field
        qty: guestItem.qty || 1,
        addedAt: guestItem.addedAt || new Date().toISOString()
      });
    }
  });

  const mergedCart = Array.from(mergedMap.values());
  console.log('[CartSync] Merge complete - Total items:', mergedCart.length);
  
  return mergedCart;
}

/**
 * Sync localStorage cart to Firestore after login
 * @returns {Promise<Array>} Merged cart items
 */
export async function syncCartOnLogin() {
  try {
    console.log('[CartSync] Starting cart sync...');

    // Get guest cart from localStorage
    const guestCart = storage.get('craftedloop_cart', []);
    
    // Get user cart from Firestore
    const userCart = await getUserCart();

    // Merge carts
    const mergedCart = mergeCartItems(guestCart, userCart);

    // Save merged cart to Firestore
    await updateUserCart(mergedCart);

    // Clear localStorage cart (now synced to Firestore)
    storage.remove('craftedloop_cart');

    console.log('[CartSync] Cart sync successful');
    return mergedCart;
  } catch (error) {
    console.error('[CartSync] Cart sync failed:', error);
    // Don't throw - allow login to proceed even if cart sync fails
    return [];
  }
}

/**
 * Save cart to localStorage (for guest users)
 * @param {Array} cartItems - Cart items to save
 */
export function saveCartToLocalStorage(cartItems) {
  try {
    storage.set('craftedloop_cart', cartItems);
    console.log('[CartSync] Cart saved to localStorage');
  } catch (error) {
    console.error('[CartSync] Failed to save cart to localStorage:', error);
  }
}

/**
 * Get cart from localStorage (for guest users)
 * @returns {Array} Cart items
 */
export function getCartFromLocalStorage() {
  try {
    return storage.get('craftedloop_cart', []);
  } catch (error) {
    console.error('[CartSync] Failed to get cart from localStorage:', error);
    return [];
  }
}

/**
 * Sync Firestore cart to localStorage (for offline access)
 * @param {Array} cartItems - Cart items from Firestore
 */
export function syncFirestoreToLocalStorage(cartItems) {
  try {
    if (Array.isArray(cartItems)) {
      storage.set('craftedloop_cart_backup', cartItems);
      console.log('[CartSync] Firestore cart backed up to localStorage');
    }
  } catch (error) {
    console.error('[CartSync] Failed to backup cart:', error);
  }
}

/**
 * Clear all cart data
 */
export function clearAllCartData() {
  try {
    storage.remove('craftedloop_cart');
    storage.remove('craftedloop_cart_backup');
    console.log('[CartSync] All cart data cleared');
  } catch (error) {
    console.error('[CartSync] Failed to clear cart data:', error);
  }
}

/**
 * Get cart item count
 * @param {Array} cartItems - Cart items
 * @returns {number} Total number of items
 */
export function getCartItemCount(cartItems) {
  if (!Array.isArray(cartItems)) return 0;
  
  return cartItems.reduce((total, item) => {
    return total + (item.qty || 1);
  }, 0);
}

/**
 * Get cart total price
 * @param {Array} cartItems - Cart items
 * @returns {number} Total price
 */
export function getCartTotal(cartItems) {
  if (!Array.isArray(cartItems)) return 0;
  
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = item.qty || 1;
    return total + (price * qty);
  }, 0);
}

/**
 * Normalize cart item structure
 * Ensures all cart items have consistent field names
 * @param {Object} item - Cart item
 * @returns {Object} Normalized cart item
 */
export function normalizeCartItem(item) {
  return {
    productId: item.productId || item.id,
    name: item.name || item.product || 'Unknown Product',
    price: parseFloat(item.price) || 0,
    qty: parseInt(item.qty || item.quantity) || 1,
    size: item.size || null,
    image: item.image || item.imageUrl || '',
    addedAt: item.addedAt || new Date().toISOString()
  };
}
