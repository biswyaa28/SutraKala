/**
 * CraftedLoop - Supabase Client & API Functions
 * Complete backend integration for the e-commerce platform
 *
 * Usage:
 * 1. Install Supabase JS client: npm install @supabase/supabase-js
 * 2. Set up environment variables (see .env.example)
 * 3. Import and initialize: import supabaseClient from './supabase-client.js'
 */

import { createClient } from '@supabase/supabase-js';

// ========================================
// 1. SUPABASE CLIENT INITIALIZATION
// ========================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Public client (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for server-side operations - keep secret!)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// ========================================
// 2. AUTHENTICATION FUNCTIONS
// ========================================

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} fullName - User's full name
 * @returns {Promise<Object>} User data or error
 */
export async function signUp(email, password, fullName) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data or error
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign out current user
 * @returns {Promise<Object>} Success or error
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get current user session
 * @returns {Promise<Object>} Session data
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get current session
 * @returns {Promise<Object>} Session data
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, session };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Reset user password
 * @param {string} email - User email
 * @returns {Promise<Object>} Success or error
 */
export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Success or error
 */
export async function updateProfile(updates) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if current user is admin
 * @returns {Promise<boolean>} Is admin
 */
export async function isAdmin() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return data?.is_admin || false;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

// ========================================
// 3. PRODUCT FUNCTIONS
// ========================================

/**
 * Get all active products
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Products or error
 */
export async function getProducts(options = {}) {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('is_active', true);

    // Apply filters
    if (options.category) {
      query = query.eq('category_id', options.category);
    }

    if (options.minPrice !== undefined) {
      query = query.gte('price', options.minPrice);
    }

    if (options.maxPrice !== undefined) {
      query = query.lte('price', options.maxPrice);
    }

    if (options.search) {
      query = query.textSearch('name_description', options.search);
    }

    // Apply sorting
    const sortColumn = options.sortBy || 'created_at';
    const sortOrder = options.sortOrder || 'desc';
    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + options.limit - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get products error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product or error
 */
export async function getProductById(productId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name,
          slug
        ),
        reviews (
          rating,
          comment,
          user_name,
          created_at
        )
      `)
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get product error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get single product by slug
 * @param {string} slug - Product slug
 * @returns {Promise<Object>} Product or error
 */
export async function getProductBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get product error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get featured products
 * @param {number} limit - Number of products to return
 * @returns {Promise<Object>} Products or error
 */
export async function getFeaturedProducts(limit = 4) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(limit);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get featured products error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all categories
 * @returns {Promise<Object>} Categories or error
 */
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get categories error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create new product (Admin only)
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product or error
 */
export async function createProduct(productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Create product error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update product (Admin only)
 * @param {string} productId - Product ID
 * @param {Object} updates - Product updates
 * @returns {Promise<Object>} Updated product or error
 */
export async function updateProduct(productId, updates) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete product (Admin only)
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Success or error
 */
export async function deleteProduct(productId) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload product image
 * @param {File} file - Image file
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Image URL or error
 */
export async function uploadProductImage(file, productId) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload image error:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// 4. ORDER FUNCTIONS
// ========================================

/**
 * Create new order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Created order or error
 */
export async function createOrder(orderData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const order = {
      user_id: user.id,
      items: orderData.items,
      subtotal: orderData.subtotal,
      gst_amount: orderData.gst_amount || 0,
      shipping_charge: orderData.shipping_charge || 0,
      discount_amount: orderData.discount_amount || 0,
      total: orderData.total,
      payment_method: orderData.payment_method || 'cod',
      payment_status: 'pending',
      order_status: 'pending',
      shipping_address: orderData.shipping_address
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) throw error;

    // Update product stock
    for (const item of orderData.items) {
      await supabase.rpc('decrement_product_stock', {
        product_id: item.product_id,
        quantity: item.quantity
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error('Create order error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's orders
 * @returns {Promise<Object>} Orders or error
 */
export async function getUserOrders() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get orders error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get single order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order or error
 */
export async function getOrderById(orderId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get order error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update order status (Admin only)
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order or error
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const updates = {
      order_status: status
    };

    // Add timestamp for specific statuses
    if (status === 'shipped') {
      updates.shipped_at = new Date().toISOString();
    } else if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    } else if (status === 'cancelled') {
      updates.cancelled_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update payment status
 * @param {string} orderId - Order ID
 * @param {string} status - Payment status
 * @param {string} paymentId - Payment gateway ID
 * @returns {Promise<Object>} Updated order or error
 */
export async function updatePaymentStatus(orderId, status, paymentId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: status,
        payment_id: paymentId
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update payment status error:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// 5. ADDRESS FUNCTIONS
// ========================================

/**
 * Get user's saved addresses
 * @returns {Promise<Object>} Addresses or error
 */
export async function getAddresses() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get addresses error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add new address
 * @param {Object} addressData - Address data
 * @returns {Promise<Object>} Created address or error
 */
export async function addAddress(addressData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('addresses')
      .insert([{ ...addressData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Add address error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update address
 * @param {string} addressId - Address ID
 * @param {Object} updates - Address updates
 * @returns {Promise<Object>} Updated address or error
 */
export async function updateAddress(addressId, updates) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', addressId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update address error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete address
 * @param {string} addressId - Address ID
 * @returns {Promise<Object>} Success or error
 */
export async function deleteAddress(addressId) {
  try {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Delete address error:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// 6. WISHLIST FUNCTIONS
// ========================================

/**
 * Get user's wishlist
 * @returns {Promise<Object>} Wishlist items or error
 */
export async function getWishlist() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        products (
          name,
          price,
          images,
          slug
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get wishlist error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add product to wishlist
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Success or error
 */
export async function addToWishlist(productId) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ user_id: user.id, product_id: productId }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Success or error
 */
export async function removeFromWishlist(productId) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// 7. COUPON FUNCTIONS
// ========================================

/**
 * Validate and apply coupon
 * @param {string} code - Coupon code
 * @param {number} orderTotal - Order total
 * @returns {Promise<Object>} Discount details or error
 */
export async function applyCoupon(code, orderTotal) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid or expired coupon' };
    }

    // Check minimum order value
    if (data.min_order_value && orderTotal < data.min_order_value) {
      return {
        success: false,
        error: `Minimum order value of ₹${data.min_order_value} required`
      };
    }

    // Check usage limit
    if (data.usage_limit && data.usage_count >= data.usage_limit) {
      return { success: false, error: 'Coupon usage limit reached' };
    }

    // Calculate discount
    let discountAmount = 0;
    if (data.discount_type === 'percentage') {
      discountAmount = (orderTotal * data.discount_value) / 100;
      if (data.max_discount_amount) {
        discountAmount = Math.min(discountAmount, data.max_discount_amount);
      }
    } else {
      discountAmount = data.discount_value;
    }

    return {
      success: true,
      discount: discountAmount,
      coupon: data
    };
  } catch (error) {
    console.error('Apply coupon error:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// 8. RAZORPAY INTEGRATION (Future)
// ========================================

/**
 * Initialize Razorpay payment
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} Razorpay order ID or error
 *
 * NOTE: This requires a backend function/edge function to create Razorpay order
 * Uncomment and implement when ready for payment integration
 */
export async function createRazorpayOrder(orderData) {
  try {
    // TODO: Call Supabase Edge Function to create Razorpay order
    // const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
    //   body: { orderData }
    // });

    console.log('Razorpay integration - to be implemented');
    return {
      success: false,
      error: 'Payment integration not yet implemented'
    };
  } catch (error) {
    console.error('Razorpay order error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify Razorpay payment
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} Verification result
 *
 * NOTE: This requires a backend function/edge function to verify payment signature
 */
export async function verifyRazorpayPayment(paymentData) {
  try {
    // TODO: Call Supabase Edge Function to verify payment
    // const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
    //   body: { paymentData }
    // });

    console.log('Razorpay verification - to be implemented');
    return {
      success: false,
      error: 'Payment verification not yet implemented'
    };
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle Razorpay webhook
 *
 * NOTE: Create a Supabase Edge Function at /supabase/functions/payment-webhook/index.ts
 * to handle Razorpay webhook events for automatic order status updates
 *
 * Webhook events to handle:
 * - payment.captured
 * - payment.failed
 * - order.paid
 */

// ========================================
// 9. UTILITY FUNCTIONS
// ========================================

/**
 * Format currency
 * @param {number} amount - Amount in paise
 * @returns {string} Formatted amount
 */
export function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Format date
 * @param {string} date - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Generate order number (client-side fallback)
 * @returns {string} Order number
 */
export function generateOrderNumber() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-${dateStr}-${random}`;
}

// ========================================
// EXPORT DEFAULT
// ========================================

export default {
  supabase,
  supabaseAdmin,
  auth: {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    getSession,
    resetPassword,
    updateProfile,
    isAdmin
  },
  products: {
    getProducts,
    getProductById,
    getProductBySlug,
    getFeaturedProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
  },
  orders: {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus
  },
  addresses: {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
  },
  wishlist: {
    getWishlist,
    addToWishlist,
    removeFromWishlist
  },
  coupons: {
    applyCoupon
  },
  payments: {
    createRazorpayOrder,
    verifyRazorpayPayment
  },
  utils: {
    formatCurrency,
    formatDate,
    generateOrderNumber
  }
};
