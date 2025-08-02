// app/member/fines/failure/page.tsx
'use client'; // Mark as a Client Component

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Hook to read URL query parameters
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

const PaymentFailurePage = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Your payment failed or was cancelled.');

  useEffect(() => {
    // Get the message from the URL query parameters
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
    }
  }, [searchParams]);

  return (
    <div className="h-screen w-full p-5 flex flex-col items-center justify-center bg-gray-100 font-inter">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
        <CardHeader className="flex flex-col items-center justify-center mb-4">
          <XCircle className="h-16 w-16 text-red-500 mb-4" />
          <CardTitle className="text-3xl font-extrabold text-red-700">Payment Failed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-lg mb-4">{message}</p>
          <p className="text-gray-500 text-sm">Please try again or contact support if the issue persists.</p>
          <a href="/member/fines" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
            Return to Fines Page
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailurePage;
