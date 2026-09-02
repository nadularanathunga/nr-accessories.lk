import React from 'react';
import { Link } from 'react-router-dom';
import { XIcon } from 'lucide-react';

export function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
        <XIcon className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-ink-soft mb-6">Your payment process was interrupted or cancelled.</p>
      <Link to="/checkout" className="bg-brand-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-800">
        Try Again
      </Link>
    </div>
  );
}
