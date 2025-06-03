"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ArrowLeft, Calendar, Clock, TestTube, CreditCard } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/context/app-context"

// Category types
type CategoryId = "appointment" | "lab" | "payment"

export default function HelpSupport() {
  const { appointmentStatus } = useApp()
  const [expandedCategory, setExpandedCategory] = useState<CategoryId | null>(null)

  // Toggle category expansion
  const toggleCategory = (categoryId: CategoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/" className="mr-3">
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
      </header>

      <main className="p-4">
        {/* Recent Appointments */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Recent Appointments</h2>
            <Link href="#" className="text-blue-600 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium">17 May 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm">09:00 AM - 10:00 AM</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                    OP
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Preventive Health Check-Up (HPR)</h3>
                  <div className="mt-1 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      <span className="mr-1">🔬</span>
                      Lab Booking
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Ruby Hall Labs, Pune</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="text-blue-600 text-sm font-medium flex items-center">
                  View Details
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How can we help you? */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">How can we help you?</h2>

          <div className="space-y-4">
            {/* Appointment Related Queries */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleCategory("appointment")}
                className="w-full flex items-center p-4 text-left focus:outline-none"
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Appointment Related Queries</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    We will help you with your appointment confirmation, rescheduling, and canceling
                  </p>
                </div>
                <div className="ml-2">
                  {expandedCategory === "appointment" ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedCategory === "appointment" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
                  {/* Cancel Appointment */}
                  <Link
                    href="/chat?type=cancel"
                    className="block bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-900">I want to Cancel my appointment</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      You can cancel your appointment and get a refund based on our cancellation policy.
                    </p>
                  </Link>

                  {/* Reschedule Appointment */}
                  <Link
                    href="/chat?type=reschedule"
                    className="block bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-900">I want to Reschedule my appointment</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      You can reschedule your appointment up to 4 hours before the scheduled time.
                    </p>
                  </Link>

                  {/* Confirm Appointment */}
                  <Link
                    href="/chat?type=confirm"
                    className="block bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-900">Confirm my appointment please</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Chat with our support team to confirm your appointment details.
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Lab Test Related Queries */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleCategory("lab")}
                className="w-full flex items-center p-4 text-left focus:outline-none"
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <TestTube className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Lab Test Related Queries</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    If you wanna know about changing patient, booked tests, or prefer home collection
                  </p>
                </div>
                <div className="ml-2">
                  {expandedCategory === "lab" ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedCategory === "lab" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <Link
                    href="/chat?type=lab"
                    className="block bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-900">Lab test related queries</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      For any questions about your lab tests, please chat with our support team.
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Payment and Other Queries */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleCategory("payment")}
                className="w-full flex items-center p-4 text-left focus:outline-none"
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Payment and Other Queries</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    We will help you with your payment, wallet, and other doubts
                  </p>
                </div>
                <div className="ml-2">
                  {expandedCategory === "payment" ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedCategory === "payment" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <Link
                    href="/chat?type=payment"
                    className="block bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-900">Payment related queries</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      For any questions about payments or billing, please chat with our support team.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
