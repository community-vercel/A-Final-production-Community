'use client';
import { useEffect, useState } from "react";
import { useRouter,useParams } from "next/navigation";
import Image from "next/image";

const PaymentDetails = () => {
  const router = useRouter();
  const params=useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

  useEffect(() => {
    if (params.id) {
      const fetchPaymentDetails = async () => {
        try {
            const requestBody = JSON.stringify({id: params.id });
            const response = await fetch(`${serverurl}get-paymentdetails/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody,
            });
        
                const data = await response.json();
          
          if (data.ErrorCode === 0) {
            setPaymentData(data.data);
          } else {
            setError(data.ErrorMsg);
          }
        } catch (error) {
          setError("An error occurred while fetching payment details.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchPaymentDetails();
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!paymentData) return <div>No payment data available.</div>;

  return (
    <div className="container mx-auto p-6">
    <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
      Payment Details
    </h1>
  
    <div className="bg-gradient-to-r from-white via-gray-100 to-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <p className="text-lg">
          <strong className="text-gray-700">Payment ID:</strong>{" "}
          <span className="text-gray-900">{paymentData.id}</span>
        </p>
        <p className="text-lg">
          <strong className="text-gray-700">event Date:</strong>{" "}
          <span className="text-gray-900">{paymentData.date}</span>
        </p>
        <p className="text-lg">
          <strong className="text-gray-700">Name:</strong>{" "}
          <span className="text-gray-900">{paymentData.name}</span>
        </p>
        <p className="text-lg">
          <strong className="text-gray-700">Email:</strong>{" "}
          <span className="text-gray-900">{paymentData.email}</span>
        </p>
        <p className="text-lg">
          <strong className="text-gray-700">Phone:</strong>{" "}
          <span className="text-gray-900">{paymentData.phone}</span>
        </p>
       
        <p className="text-lg">
          <strong className="text-gray-700">Event Name:</strong>{" "}
          <span className="text-gray-900">{paymentData.event_name}</span>
        </p>
       
      </div>
  
      {paymentData.payment_screenshot && (
        <div className="mt-6">
          <strong className="text-gray-700 block mb-2">Payment Screenshot:</strong>
          <Image
            src={serverurl+paymentData.payment_screenshot.replace('/api/media/','media/')}
            alt="Payment Screenshot"
            width={500}
            height={200}
            className="w-full max-w-lg mx-auto rounded-xl shadow-lg border border-gray-200"
          />
        </div>
      )}
  
      <p className="text-lg mt-6">
        <strong className="text-gray-700">Created At:</strong>{" "}
        <span className="text-gray-900">
          {new Date(paymentData.created_at).toLocaleString()}
        </span>
      </p>
    </div>
  </div>
  );
};

export default PaymentDetails;