// app/member/fines/success/page.tsx
'use client'; // Mark as a Client Component

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Hook to read URL query parameters
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Your payment was successful!');

  useEffect(() => {
    // Get the message from the URL query parameters
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
    }
    // Optionally, you might want to dispatch an action here to refresh user borrows
    // if the main FinesPage doesn't automatically re-fetch on mount.
    // For now, the main FinesPage's useEffect already handles URL params.
  }, [searchParams]);

  return (
    <div className="h-screen w-full p-5 flex flex-col items-center justify-center bg-gray-100 font-inter">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
        <CardHeader className="flex flex-col items-center justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-extrabold text-green-700">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-lg mb-4">{message}</p>
          <p className="text-gray-500 text-sm">Thank you for your payment. Your fines have been cleared.</p>
          <a href="/member/fines" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
            Go to Fines Page
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
