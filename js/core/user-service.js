// js/core/user-service.js
/**
 * Firestore User Service
 * Handles all user-related database operations
 */

import { getFirestoreInstance } from '../firebase-init.js';
import { getCurrentUser } from './auth-helpers.js';

/**
 * Get Firestore reference to user document
 * @param {string} uid - User ID
 * @returns {Object} Firestore document reference
 */
async function getUserRef(uid) {
  const db = getFirestoreInstance();
  if (!db) {
    throw new Error('Firestore not initialized');
  }

  const { doc, collection } = await import(
    'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
  );

  return doc(collection(db, 'users'), uid);
}

/**
 * Create initial user document in Firestore
 * Called after successful authentication
 * @param {Object} user - Firebase user object
 * @param {string} provider - Auth provider ('google' or 'phone')
 * @returns {Promise<void>}
 */
export async function createUserDocument(user, provider = 'unknown') {
  try {
    if (!user || !user.uid) {
      throw new Error('Invalid user object');
    }

    const { setDoc, serverTimestamp } = await import(
      'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
    );

    const userRef = await getUserRef(user.uid);
    const now = serverTimestamp();

    const userData = {
      // Auth-provided fields
      uid: user.uid,
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      provider: provider,

      // Initialize empty arrays
      cart: [],
      addresses: [],
      orders: [],

      // Default preferences
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          whatsapp: true,
          email: true,
          sms: false
        }
      },

      // Metadata
      metadata: {
        createdAt: now,
        lastLogin: now,
        totalOrders: 0
      }
    };

    await setDoc(userRef, userData, { merge: true });
    console.log('[UserService] User document created:', user.uid);
  } catch (error) {
    console.error('[UserService] Failed to create user document:', error);
    throw error;
  }
}

/**
 * Get user data from Firestore
 * @param {string} uid - User ID (optional, uses current user if not provided)
 * @returns {Promise<Object|null>} User data or null if not found
 */
export async function getUserData(uid = null) {
  try {
    const userId = uid || getCurrentUser()?.uid;
    if (!userId) {
      throw new Error('No user ID provided');
    }

    const { getDoc } = await import(
      'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
    );

    const userRef = await getUserRef(userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log('[UserService] User data retrieved');
      return docSnap.data();
    } else {
      console.warn('[UserService] User document not found');
      return null;
    }
  } catch (error) {
    console.error('[UserService] Failed to get user data:', error);
    throw error;
  }
}

/**
 * Update user data in Firestore
 * @param {Object} updates - Partial user data to update
 * @param {string} uid - User ID (optional, uses current user if not provided)
 * @returns {Promise<void>}
 */
export async function updateUserData(updates, uid = null) {
  try {
    const userId = uid || getCurrentUser()?.uid;
    if (!userId) {
      throw new Error('No user ID provided');
    }

    const { updateDoc } = await import(
      'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
    );

    const userRef = await getUserRef(userId);
    await updateDoc(userRef, updates);
    
    console.log('[UserService] User data updated');
  } catch (error) {
    console.error('[UserService] Failed to update user data:', error);
    throw error;
  }
}

/**
 * Update user's last login timestamp
 * @returns {Promise<void>}
 */
export async function updateLastLogin() {
  try {
    const { serverTimestamp } = await import(
      'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
    );

    await updateUserData({
      'metadata.lastLogin': serverTimestamp()
    });
    
    console.log('[UserService] Last login updated');
  } catch (error) {
    console.error('[UserService] Failed to update last login:', error);
    // Don't throw - this is not critical
  }
}

/**
 * Get user's cart from Firestore
 * @returns {Promise<Array>} Cart items array
 */
export async function getUserCart() {
  try {
    const userData = await getUserData();
    return userData?.cart || [];
  } catch (error) {
    console.error('[UserService] Failed to get cart:', error);
    return [];
  }
}

/**
 * Update user's cart in Firestore
 * @param {Array} cartItems - Array of cart items
 * @returns {Promise<void>}
 */
export async function updateUserCart(cartItems) {
  try {
    if (!Array.isArray(cartItems)) {
      throw new Error('Cart items must be an array');
    }

    await updateUserData({ cart: cartItems });
    console.log('[UserService] Cart updated with', cartItems.length, 'items');
  } catch (error) {
    console.error('[UserService] Failed to update cart:', error);
    throw error;
  }
}

/**
 * Add item to user's cart
 * @param {Object} item - Cart item to add
 * @returns {Promise<void>}
 */
export async function addToCart(item) {
  try {
    const { arrayUnion, serverTimestamp } = await import(
      'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
    );

    // Add timestamp if not present
    const cartItem = {
      ...item,
      addedAt: item.addedAt || serverTimestamp()
    };

    // Get current cart
    const currentCart = await getUserCart();
    
    // Check if item already exists (by productId)
    const existingIndex = currentCart.findIndex(
      cartItem => cartItem.productId === item.productId && cartItem.size === item.size
    );

    if (existingIndex >= 0) {
      // Update quantity if item exists
      currentCart[existingIndex].qty = (currentCart[existingIndex].qty || 1) + (item.qty || 1);
      await updateUserCart(currentCart);
    } else {
      // Add new item
      currentCart.push(cartItem);
      await updateUserCart(currentCart);
    }

    console.log('[UserService] Item added to cart');
  } catch (error) {
    console.error('[UserService] Failed to add to cart:', error);
    throw error;
  }
}

/**
 * Remove item from user's cart
 * @param {string} productId - Product ID to remove
 * @param {string} size - Product size (optional)
 * @returns {Promise<void>}
 */
export async function removeFromCart(productId, size = null) {
  try {
    const currentCart = await getUserCart();
    
    const updatedCart = currentCart.filter(item => {
      if (size) {
        return !(item.productId === productId && item.size === size);
      }
      return item.productId !== productId;
    });

    await updateUserCart(updatedCart);
    console.log('[UserService] Item removed from cart');
  } catch (error) {
    console.error('[UserService] Failed to remove from cart:', error);
    throw error;
  }
}

/**
 * Clear user's cart
 * @returns {Promise<void>}
 */
export async function clearCart() {
  try {
    await updateUserCart([]);
    console.log('[UserService] Cart cleared');
  } catch (error) {
    console.error('[UserService] Failed to clear cart:', error);
    throw error;
  }
}

/**
 * Get user's addresses
 * @returns {Promise<Array>} Addresses array
 */
export async function getUserAddresses() {
  try {
    const userData = await getUserData();
    return userData?.addresses || [];
  } catch (error) {
    console.error('[UserService] Failed to get addresses:', error);
    return [];
  }
}

/**
 * Add new address for user
 * @param {Object} address - Address data
 * @returns {Promise<void>}
 */
export async function addAddress(address) {
  try {
    const { serverTimestamp } = await import(
      'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
    );

    const addresses = await getUserAddresses();
    
    // Generate unique ID
    const addressWithId = {
      id: `addr_${Date.now()}`,
      ...address,
      createdAt: serverTimestamp(),
      isDefault: addresses.length === 0 // First address is default
    };

    addresses.push(addressWithId);
    await updateUserData({ addresses });
    
    console.log('[UserService] Address added');
  } catch (error) {
    console.error('[UserService] Failed to add address:', error);
    throw error;
  }
}

/**
 * Update existing address
 * @param {string} addressId - Address ID
 * @param {Object} updates - Address fields to update
 * @returns {Promise<void>}
 */
export async function updateAddress(addressId, updates) {
  try {
    const addresses = await getUserAddresses();
    const index = addresses.findIndex(addr => addr.id === addressId);
    
    if (index === -1) {
      throw new Error('Address not found');
    }

    addresses[index] = { ...addresses[index], ...updates };
    await updateUserData({ addresses });
    
    console.log('[UserService] Address updated');
  } catch (error) {
    console.error('[UserService] Failed to update address:', error);
    throw error;
  }
}

/**
 * Delete address
 * @param {string} addressId - Address ID
 * @returns {Promise<void>}
 */
export async function deleteAddress(addressId) {
  try {
    const addresses = await getUserAddresses();
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    
    await updateUserData({ addresses: updatedAddresses });
    console.log('[UserService] Address deleted');
  } catch (error) {
    console.error('[UserService] Failed to delete address:', error);
    throw error;
  }
}

/**
 * Set default address
 * @param {string} addressId - Address ID
 * @returns {Promise<void>}
 */
export async function setDefaultAddress(addressId) {
  try {
    const addresses = await getUserAddresses();
    
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));

    await updateUserData({ addresses: updatedAddresses });
    console.log('[UserService] Default address updated');
  } catch (error) {
    console.error('[UserService] Failed to set default address:', error);
    throw error;
  }
}

/**
 * Create new order
 * @param {Object} orderData - Order data
 * @returns {Promise<string>} Order ID
 */
export async function createOrder(orderData) {
  try {
    const { doc, collection, setDoc, serverTimestamp } = await import(
      'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
    );

    const db = getFirestoreInstance();
    const user = getCurrentUser();
    
    if (!user) {
      throw new Error('User must be logged in to create order');
    }

    const orderId = `ORD_${Date.now()}_${user.uid.slice(0, 6)}`;
    const orderRef = doc(collection(db, 'orders'), orderId);

    const order = {
      orderId,
      userId: user.uid,
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(orderRef, order);

    // Update user's orders array and total orders count
    const userData = await getUserData();
    const userOrders = userData?.orders || [];
    userOrders.push({
      orderId,
      products: orderData.products,
      total: orderData.total,
      status: 'pending',
      createdAt: new Date()
    });

    await updateUserData({
      orders: userOrders,
      'metadata.totalOrders': userOrders.length
    });

    console.log('[UserService] Order created:', orderId);
    return orderId;
  } catch (error) {
    console.error('[UserService] Failed to create order:', error);
    throw error;
  }
}

/**
 * Get user's orders
 * @returns {Promise<Array>} Orders array
 */
export async function getUserOrders() {
  try {
    const userData = await getUserData();
    return userData?.orders || [];
  } catch (error) {
    console.error('[UserService] Failed to get orders:', error);
    return [];
  }
}
