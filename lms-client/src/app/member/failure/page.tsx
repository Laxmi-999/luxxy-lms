import React from "react";
import { useRouter } from "next/navigation";

const Failure = () => {
    const router = useRouter();
    return (
        <div>
            <h1>Payment Failed!</h1>
            <p>There was an issue with your payment. Please try again.</p>
            <button onClick={() => router.push("/")} className="go-home-button">
                Go to Homepage
            </button>
        </div>
    );
};

export default Failure;