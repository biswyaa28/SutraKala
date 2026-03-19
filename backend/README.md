# CraftedLoop Backend - Supabase Setup Guide

Complete backend setup instructions for the CraftedLoop e-commerce platform using Supabase.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema Setup](#database-schema-setup)
4. [Environment Configuration](#environment-configuration)
5. [Frontend Integration](#frontend-integration)
6. [API Usage Examples](#api-usage-examples)
7. [Admin Setup](#admin-setup)
8. [Storage Setup](#storage-setup)
9. [Payment Integration](#payment-integration)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 16+ and npm
- A Supabase account (free tier is sufficient)
- Code editor (VS Code recommended)

---

## Supabase Project Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `craftedloop`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., Asia South for India)
4. Click **"Create new project"**
5. Wait for project setup (2-3 minutes)

### Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following keys:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (safe for client-side)
   - **service_role key** (keep secret! for admin operations only)

---

## Database Schema Setup

### Step 1: Run SQL Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. Verify all tables are created successfully

### Step 2: Verify Tables

Check that these tables exist:
- [x] `profiles`
- [x] `categories`
- [x] `products`
- [x] `orders`
- [x] `order_items`
- [x] `reviews`
- [x] `coupons`
- [x] `addresses`
- [x] `wishlist`

### Step 3: Create Admin User

1. Go to **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Enter admin details:
   - **Email**: `admin@craftedloop.in`
   - **Password**: (choose strong password)
   - **Confirm Password**: (same)
4. Click **"Create user"**
5. Copy the user ID (UUID)
6. Go to **SQL Editor** and run:

```sql
UPDATE profiles
SET is_admin = TRUE
WHERE email = 'admin@craftedloop.in';
```

---

## Environment Configuration

### Step 1: Create .env File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Step 2: Add Your Keys

Edit `.env` with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Settings
VITE_APP_NAME=CraftedLoop
VITE_APP_URL=http://localhost:3000

# Razorpay (Optional - for payments)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### Security Notes

⚠️ **Important:**
- Never commit `.env` to version control
- Add `.env` to your `.gitignore`
- `SERVICE_ROLE_KEY` should only be used in server-side code
- For frontend, only use `ANON_KEY`

---

## Frontend Integration

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 2: Import Supabase Client

```javascript
// In your JavaScript files
import supabaseClient from './backend/supabase-client.js';

// Or import specific functions
import { getProducts, createOrder, signIn } from './backend/supabase-client.js';
```

### Step 3: Initialize in Your App

```javascript
// main.js or app.js
import supabaseClient from './backend/supabase-client.js';

// Check authentication state
supabaseClient.supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  // Update UI based on auth state
});
```

---

## API Usage Examples

### Fetch Products

```javascript
import { getProducts, getProductBySlug } from './backend/supabase-client.js';

// Get all products
const result = await getProducts();
if (result.success) {
  console.log('Products:', result.data);
}

// Get products with filters
const filtered = await getProducts({
  category: 'category-uuid',
  minPrice: 500,
  maxPrice: 2000,
  limit: 10,
  sortBy: 'price',
  sortOrder: 'asc'
});

// Get single product
const product = await getProductBySlug('elegant-infinity-scarf');
```

### Create Order

```javascript
import { createOrder } from './backend/supabase-client.js';

const orderData = {
  items: [
    {
      product_id: 'product-uuid',
      name: 'Elegant Infinity Scarf',
      price: 1299,
      quantity: 1,
      image: 'image-url'
    }
  ],
  subtotal: 1299,
  gst_amount: 233.82, // 18% GST
  shipping_charge: 100,
  total: 1632.82,
  payment_method: 'cod',
  shipping_address: {
    name: 'John Doe',
    address_line1: '123 Main Street',
    address_line2: 'Apt 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '+91 9876543210',
    email: 'john@example.com'
  }
};

const result = await createOrder(orderData);
if (result.success) {
  console.log('Order created:', result.data.order_number);
}
```

### User Authentication

```javascript
import { signIn, signUp, signOut } from './backend/supabase-client.js';

// Sign up
const signUpResult = await signUp('user@example.com', 'password123', 'John Doe');

// Sign in
const signInResult = await signIn('user@example.com', 'password123');

// Sign out
await signOut();
```

### Get User Orders

```javascript
import { getUserOrders } from './backend/supabase-client.js';

const orders = await getUserOrders();
if (orders.success) {
  console.log('My orders:', orders.data);
}
```

### Manage Addresses

```javascript
import { getAddresses, addAddress } from './backend/supabase-client.js';

// Get saved addresses
const addresses = await getAddresses();

// Add new address
const newAddress = await addAddress({
  label: 'Home',
  name: 'John Doe',
  phone: '+91 9876543210',
  address_line1: '123 Main Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400050',
  is_default: true
});
```

### Apply Coupon

```javascript
import { applyCoupon } from './backend/supabase-client.js';

const coupon = await applyCoupon('WELCOME10', 1500);
if (coupon.success) {
  console.log('Discount:', coupon.discount);
} else {
  console.log('Error:', coupon.error);
}
```

---

## Admin Setup

### Admin-Only Operations

The following functions require admin privileges:

```javascript
import { createProduct, updateProduct, deleteProduct, updateOrderStatus } from './backend/supabase-client.js';
import { isAdmin } from './backend/supabase-client.js';

// Check if user is admin
const admin = await isAdmin();
if (!admin) {
  alert('Access denied');
  return;
}

// Create product
await createProduct({
  name: 'New Product',
  slug: 'new-product',
  price: 999,
  stock: 50,
  category_id: 'category-uuid'
});

// Update order status
await updateOrderStatus('order-uuid', 'shipped');
```

### Admin Dashboard Routes

Protect admin routes in your frontend:

```javascript
// admin-guard.js
import { isAdmin } from './backend/supabase-client.js';

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    window.location.href = '/unauthorized.html';
    return false;
  }
  return true;
}

// Usage in admin page
if (!await requireAdmin()) {
  return;
}
```

---

## Storage Setup

### Create Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Click **"New Bucket"**
3. Create these buckets:

| Bucket Name | Public | Purpose |
|------------|--------|---------|
| `product-images` | ✓ | Product photos |
| `user-avatars` | ✓ | User profile pictures |
| `invoices` | ✗ | Order invoices (private) |

### Set Storage Policies

Run these SQL commands to set up storage policies:

```sql
-- Allow public read access to product images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images (admin only in production)
CREATE POLICY "Upload Access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
```

### Upload Product Image

```javascript
import { uploadProductImage } from './backend/supabase-client.js';

const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await uploadProductImage(file, 'product-uuid');
if (result.success) {
  console.log('Image URL:', result.url);
}
```

---

## Payment Integration (Razorpay)

### Step 1: Create Razorpay Account

1. Sign up at [razorpay.com](https://razorpay.com)
2. Complete KYC verification
3. Get your API keys from Settings → API Keys

### Step 2: Create Edge Function

Create a Supabase Edge Function for creating Razorpay orders:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Create new function
supabase functions new create-razorpay-order
```

Edit `supabase/functions/create-razorpay-order/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Razorpay from 'https://esm.sh/razorpay@2.8.4'

const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID'),
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET'),
})

serve(async (req) => {
  const { orderData } = await req.json()

  const options = {
    amount: Math.round(orderData.total * 100), // Convert to paise
    currency: 'INR',
    receipt: `order_${Date.now()}`,
  }

  const order = await razorpay.orders.create(options)

  return new Response(JSON.stringify({ orderId: order.id }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### Step 3: Deploy Function

```bash
supabase functions deploy create-razorpay-order
```

### Step 4: Add Secrets

```bash
supabase secrets set RAZORPAY_KEY_ID=your_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret
```

---

## Troubleshooting

### Common Issues

#### 1. "Missing schema relations"

**Solution:** Re-run the `schema.sql` file in SQL Editor.

#### 2. "Permission denied" errors

**Solution:** Check RLS policies are enabled and configured correctly.

#### 3. "Invalid API key"

**Solution:** Verify your environment variables are correct and not expired.

#### 4. Images not loading

**Solution:** Check storage bucket is public and policies allow read access.

#### 5. Auth not working

**Solution:** Ensure email confirmation is set up or disable it for testing:
- Go to Authentication → Settings
- Disable "Enable email confirmations" for development

### Debug Queries

```sql
-- Check if user is admin
SELECT is_admin FROM profiles WHERE email = 'your@email.com';

-- Check products count
SELECT COUNT(*) FROM products WHERE is_active = true;

-- Check recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Razorpay Documentation](https://razorpay.com/docs)

---

## Next Steps

1. ✅ Complete database setup
2. ✅ Configure environment variables
3. ✅ Test API functions
4. ⏳ Implement frontend integration
5. ⏳ Set up admin dashboard
6. ⏳ Configure payment gateway
7. ⏳ Deploy to production

---

**Version:** 1.0.0
**Last Updated:** 2024
**Maintained by:** CraftedLoop Team
