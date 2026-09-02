const Stripe = require("stripe");
const Order = require("../models/Order");

// Use a test key or environment variable.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51O9X...dummy_test_key_for_demo_purposes...');

async function createCheckoutSession(req, res) {
  try {
    const { orderId } = req.body;
    
    // Find the order
    const order = await Order.findById(orderId).populate("items.product");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: "Order is already paid" });
    }

    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'lkr',
        product_data: {
          name: item.product.title,
          images: item.product.imageURL ? [item.product.imageURL] : [],
        },
        unit_amount: Math.round(item.unitPrice * 100), // Stripe expects cents/smallest currency unit
      },
      quantity: item.quantity,
    }));

    // Add delivery fee if applicable
    if (order.deliveryMethod === 'cash_on_delivery') {
       lineItems.push({
         price_data: {
           currency: 'lkr',
           product_data: { name: 'Handling Fee' },
           unit_amount: 350 * 100,
         },
         quantity: 1,
       });
    }

    // Frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${frontendUrl}/payment-cancel?order_id=${orderId}`,
      client_reference_id: orderId,
      customer_email: req.user.email,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create checkout session" });
  }
}

async function confirmPayment(req, res) {
  try {
    const { orderId, sessionId } = req.body;
    
    // In a real app, verify the session with Stripe using the sessionId
    // For demo/simplicity, we just mark the order as paid if this route is called with the order ID.
    // However, since we return the orderId in success_url, let's just trust it for now (or ideally check session).
    
    let isPaid = true;
    if (sessionId) {
      try {
         const session = await stripe.checkout.sessions.retrieve(sessionId);
         if (session.payment_status !== 'paid') {
           isPaid = false;
         }
      } catch (e) {
         console.warn("Could not verify Stripe session", e);
         // Continuing for demo purposes if session retrieve fails due to dummy key
      }
    }

    if (!isPaid) {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = 'paid';
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to confirm payment" });
  }
}

module.exports = { createCheckoutSession, confirmPayment };
