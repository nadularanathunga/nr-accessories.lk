import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { confirmPayment } from '../data/api';
import { CheckIcon } from 'lucide-react';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (orderId && sessionId) {
      confirmPayment(orderId, sessionId)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [orderId, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      {status === 'loading' && <p className="text-lg">Confirming your payment...</p>}
      
      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-ink-soft mb-6">Your order has been placed and paid for.</p>
          <Link to="/" className="bg-brand-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-800">
            Continue Shopping
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Verification Failed</h1>
          <p className="text-ink-soft mb-6">We couldn't verify your payment. Please contact support.</p>
          <Link to="/" className="bg-brand-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-800">
            Return to Home
          </Link>
        </>
      )}
    </div>
  );
}
