"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {base64Decode} from 'esewajs';

const Success = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("data");
    const decoded = token ? base64Decode(token) : {};

    const verifyPaymentAndUpdateStatus = async () => {
        try {
            const response = await axios.post(
                "/api/payment-status",
                {
                    product_id: decoded.transaction_uuid,
                }
            );
            if (response.status === 200) {
                setIsLoading(false);
                setIsSuccess(true);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error initiating payment:", error);
        }
    };

    useEffect(() => {
        if (token) verifyPaymentAndUpdateStatus();
        else setIsLoading(false);
        // eslint-disable-next-line
    }, []);

    if (isLoading && !isSuccess) return <>Loading...</>;
    if (!isLoading && !isSuccess)
        return (
            <>
                <h1>Oops!..Error occurred on confirming payment</h1>
                <h2>We will resolve it soon.</h2>
                <button onClick={() => router.push("/")} className="go-home-button">
                    Go to Homepage
                </button>
            </>
        );
    return (
        <div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your payment. Your transaction was successful.</p>
            <button onClick={() => router.push("/")} className="go-home-button">
                Go to Homepage
            </button>
        </div>
    );
};

export default Success;