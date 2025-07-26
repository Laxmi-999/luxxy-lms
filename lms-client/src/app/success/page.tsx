'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Base64 } from 'js-base64';
import axios from 'axios';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

interface TransactionDetails {
    id: string;
    amount: string;
    reference: string;
    status?: string;
}

const SuccessPage = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails>({
        id: '',
        amount: '',
        reference: ''
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    const parseEsewaResponse = () => {
        const params = {
            data: searchParams.get('data'),
            oid: searchParams.get('oid'),
            amt: searchParams.get('amt'),
            refId: searchParams.get('refId'),
            status: searchParams.get('status')
        };

        console.log('Raw eSewa callback parameters:', params);

        try {
            let amount = params.amt;
            let transactionId = params.oid;

            // Decode data token if oid/amt not available
            if (params.data && (!transactionId || !amount)) {
                const decodedData = JSON.parse(Base64.decode(params.data));
                console.log('Decoded eSewa data:', decodedData);
                
                transactionId = transactionId || decodedData.transaction_uuid || decodedData.oid;
                amount = amount || decodedData.total_amount;
            }

            return {
                transactionId: transactionId || '',
                amount: amount ? `Rs. ${parseFloat(amount).toFixed(2)}` : 'N/A',
                reference: params.refId || 'N/A',
                status: params.status
            };
        } catch (error) {
            console.error('Error parsing eSewa response:', error);
            return {
                transactionId: params.oid || '',
                amount: params.amt ? `Rs. ${parseFloat(params.amt).toFixed(2)}` : 'N/A',
                reference: params.refId || 'N/A',
                status: params.status
            };
        }
    };

    const verifyPayment = async () => {
        setIsLoading(true);
        setErrorMessage('');

        // Parse eSewa response
        const details = parseEsewaResponse();
        setTransactionDetails(details);

        // Validate we have a transaction ID
        if (!details.transactionId) {
            setErrorMessage('Missing transaction ID in payment response');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Verifying payment with backend...');
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/esewa/payment-status`,
                {
                    product_id: details.transactionId,
                    refId: details.reference !== 'N/A' ? details.reference : undefined,
                    amount: details.amount.replace('Rs. ', '')
                },
                {
                    timeout: 15000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Verification response:', response.data);

            if (response.data.success) {
                setIsSuccess(true);
                setTransactionDetails(prev => ({
                    ...prev,
                    amount: response.data.amount ? `Rs. ${parseFloat(response.data.amount).toFixed(2)}` : prev.amount,
                    reference: response.data.refId || prev.reference
                }));
            } else {
                throw new Error(response.data.message || 'Payment verification failed');
            }
        } catch (error: any) {
            console.error('Verification error:', error);
            
            const errorMsg = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Payment verification failed';
            
            setErrorMessage(errorMsg);
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [searchParams]);

    // ... (rest of your component remains the same)
};

export default SuccessPage;