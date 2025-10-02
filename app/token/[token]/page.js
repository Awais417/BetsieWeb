"use client"
import { useEffect, useState } from "react"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useParams } from 'next/navigation';
export default function TokenPage() {
     const params = useParams();
 const [token, setToken] = useState("")
    useEffect(() => {
    setToken(params.token || "");
    console.log("Token from URL:", params.token);
  }, [params.token]);
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
const handleSubmit = async (e) => {
    e.preventDefault()
 if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match")
      setMessageType("error")
      return
    }
  if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long")
      setMessageType("error")
      return
    }
 setIsLoading(true)
    setMessage("")
    setMessageType("")
    try {
      // Use environment variable for API URL, fallback to localhost for development
      const apiUrl ="http://13.61.183.201:3002"
     const response = await fetch(`${apiUrl}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      })
      if (response.ok) {
        setMessage("Password reset successfully!")
        setMessageType("success")
        setToken("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const errorData = await response.json().catch(() => ({}))
        setMessage(errorData.message || "Failed to reset password. Please try again.")
        setMessageType("error")
      }
    } catch (error) {
      setMessage("Network error. Please check your connection and try again.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }
 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-center text-gray-900">Reset Password</h1>
          <p className="text-center text-gray-600 mt-1">Enter your reset token and new password</p>
        </div>
   <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
        <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
         {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                messageType === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              )}
              <p className={`text-sm ${messageType === "success" ? "text-green-800" : "text-red-800"}`}>{message}</p>
            </div>
          )}
         <button
            type="submit"
            disabled={isLoading || !token || !newPassword || !confirmPassword}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
