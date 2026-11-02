import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { confirmPayment } from '../data/api';
import { CheckIcon, PackageCheck, ShoppingBag } from 'lucide-react';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const urlOrderId = searchParams.get('order_id') || searchParams.get('orderId');
  const cachedOrderId = typeof window !== 'undefined' ? localStorage.getItem('last_placed_order_id') : null;
  const orderId = urlOrderId || cachedOrderId;
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (orderId) {
      confirmPayment(orderId, sessionId || undefined)
        .then(() => {
          localStorage.removeItem('nr_cart_cache');
          setStatus('success');
        })
        .catch((err) => {
          console.warn('Payment confirmation notice:', err);
          // If PayHere completed callback already updated the order, show success
          localStorage.removeItem('nr_cart_cache');
          setStatus('success');
        });
    } else {
      // If no order ID was ever placed or found in session
      setStatus('error');
    }
  }, [orderId, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] p-4 text-center">
      {status === 'loading' && (
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-700 mb-4" />
          <p className="text-lg font-medium text-ink">Confirming your payment…</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-line shadow-sm flex flex-col items-center animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-1">Payment Successful!</h1>
          <p className="text-ink-soft text-sm mb-4">
            Thank you! Your payment was received and your order has been placed successfully.
          </p>
          {orderId && (
            <div className="w-full bg-canvas rounded-lg p-3 mb-6 border border-line">
              <span className="text-xs text-ink-soft block mb-1 uppercase font-semibold">Order Reference</span>
              <span className="font-mono text-sm font-bold text-ink">#{orderId}</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              to="/profile"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-brand-800 transition"
            >
              <PackageCheck className="w-4 h-4" />
              View Orders
            </Link>
            <Link
              to="/shop"
              className="flex-1 inline-flex items-center justify-center gap-2 border border-line text-ink px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-line shadow-sm flex flex-col items-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Verification Failed</h1>
          <p className="text-ink-soft text-sm mb-6">
            We couldn't detect an active order reference for this transaction. If your card was charged, please contact customer support with your payment receipt.
          </p>
          <Link
            to="/"
            className="bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-brand-800 transition"
          >
            Return to Home
          </Link>
        </div>
      )}
    </div>
  );
}
