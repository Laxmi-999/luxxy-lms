// app/failure/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const FailurePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // eSewa might send a 'status' and 'message' for failure, or you can use a default
    const status = searchParams.get('status');
    const message = searchParams.get('message') || "Payment could not be processed.";

    useEffect(() => {
        console.error("Payment failed. Status:", status, "Message:", message);
        // Clean up URL parameters to prevent message re-display on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
    }, [status, message]); // Depend on status and message

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter">
            <Card className="w-full max-w-md p-6 text-center shadow-lg rounded-lg">
                <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <CardTitle className="text-2xl font-bold text-red-700">Payment Failed</CardTitle>
                <CardContent className="mt-2 text-gray-700">
                    {message} Please try again.
                </CardContent>
                <Button onClick={() => router.push("/member/fines")} className="mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300">
                    Go to Fines Page
                </Button>
            </Card>
        </div>
    );
};

export default FailurePage;
