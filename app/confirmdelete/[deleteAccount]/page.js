"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'; // Using lucide-react for icons

export default function DeleteAccountPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Invalid or missing token. Please ensure you are using the correct link provided in your email.");
      setShowConfirmation(false);
      setIsError(true);
    } else {
      setMessage("Are you absolutely sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.");
    }
  }, [searchParams]);

  const handleConfirmDelete = async () => {
    const token = searchParams.get("token");
    if (!token) {
      // This case should ideally be caught by the useEffect, but as a safeguard
      setMessage("Invalid or missing token. Cannot proceed with deletion.");
      setShowConfirmation(false);
      setIsError(true);
      return;
    }

    setIsDeleting(true);
    setShowConfirmation(false); // Hide confirmation, show processing message
    setMessage("Processing your account deletion. Please wait...");
    setIsError(false); // Reset error state for new attempt

    try {
      const res = await fetch(`http://13.62.192.247:3002/users/confirm-delete?token=${token}`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(data.message || "Your account has been successfully deleted. We're sad to see you go!");
        setIsError(false);
      } else {
        const error = await res.json();
        setMessage(error.message || "Failed to delete account. Please try again or contact support if the issue persists.");
        setIsError(true);
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setMessage("An unexpected error occurred while trying to delete your account. Please check your internet connection and try again.");
      setIsError(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setMessage("Account deletion cancelled. Your account remains active. You can safely close this page.");
    setShowConfirmation(false);
    setIsError(false); // Not an error, just cancelled
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-lg w-full text-center border border-gray-200">
        {showConfirmation ? (
          <>
            <AlertCircle className="mx-auto h-20 w-20 text-red-500 mb-6" />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Confirm Account Deletion</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{message}</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                ) : (
                  "Yes, Permanently Delete My Account"
                )}
              </button>
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto px-8 py-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {isDeleting ? (
              <Loader2 className="mx-auto h-20 w-20 text-blue-500 animate-spin mb-6" />
            ) : isError ? (
              <XCircle className="mx-auto h-20 w-20 text-red-500 mb-6" />
            ) : (
              <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
            )}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              {isDeleting ? "Processing Request" : isError ? "Action Failed" : "Action Complete"}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
