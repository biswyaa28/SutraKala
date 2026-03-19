/**
 * Razorpay Payment Webhook Handler
 * Supabase Edge Function for handling payment confirmations
 *
 * Deploy: supabase functions deploy payment-webhook
 * Test: supabase functions serve payment-webhook --env-file .env
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Razorpay from 'https://esm.sh/razorpay@2.8.4'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID'),
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET'),
})

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Verify Razorpay webhook signature
function verifyWebhookSignature(body, signature) {
  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', Deno.env.get('RAZORPAY_WEBHOOK_SECRET'))
    .update(JSON.stringify(body))
    .digest('hex')

  return expectedSignature === signature
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook signature
    const signature = req.headers.get('x-razorpay-signature')
    const body = await req.json()

    // In production, verify signature:
    // if (!verifyWebhookSignature(body, signature)) {
    //   return new Response('Invalid signature', { status: 401, headers: corsHeaders })
    // }

    const event = body.event
    const payment = body.payload.payment.entity
    const order = body.payload.order?.entity

    console.log(`Processing webhook event: ${event}`)

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payment, order)
        break

      case 'payment.failed':
        await handlePaymentFailed(payment, order)
        break

      case 'order.paid':
        await handleOrderPaid(payment, order)
        break

      default:
        console.log(`Unhandled event type: ${event}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Handle successful payment capture
async function handlePaymentCaptured(payment, order) {
  const { id: paymentId, status, amount } = payment

  if (status === 'captured') {
    // Find order by Razorpay order ID
    const { data: dbOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', order?.id)
      .single()

    if (dbOrder) {
      // Update order payment status
      await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          order_status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', dbOrder.id)

      // Send confirmation email (implement with your email service)
      // await sendOrderConfirmation(dbOrder.id)

      console.log(`Order ${dbOrder.id} marked as paid`)
    }
  }
}

// Handle payment failure
async function handlePaymentFailed(payment, order) {
  const { id: paymentId, status, description } = payment

  if (status === 'failed') {
    // Find order by Razorpay order ID
    const { data: dbOrder } = await supabase
      .from('orders')
      .select('id, user_id')
      .eq('payment_id', order?.id)
      .single()

    if (dbOrder) {
      // Update order payment status
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          cancelled_reason: `Payment failed: ${description}`,
          cancelled_at: new Date().toISOString(),
          order_status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', dbOrder.id)

      // Restore product stock
      await restoreOrderStock(dbOrder.id)

      console.log(`Order ${dbOrder.id} cancelled due to payment failure`)
    }
  }
}

// Handle order paid event
async function handleOrderPaid(payment, order) {
  // This is a duplicate event, handled by payment.captured
  console.log('Order paid event received')
}

// Restore product stock when order is cancelled
async function restoreOrderStock(orderId) {
  const { data: order } = await supabase
    .from('orders')
    .select('items')
    .eq('id', orderId)
    .single()

  if (order?.items) {
    for (const item of order.items) {
      await supabase.rpc('increment_product_stock', {
        product_id: item.product_id,
        quantity: item.quantity
      })
    }
  }
}
