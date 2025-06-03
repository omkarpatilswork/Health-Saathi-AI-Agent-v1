"use client"

import { useState } from "react"
import { useChat, type QueryCategory } from "@/context/chat-context"
import { ChevronDown, ChevronUp, Calendar, FlaskRoundIcon as Flask, CreditCard } from "lucide-react"

export default function HelpSupport() {
  const { setCurrentView, setSelectedCategory, addMessage } = useChat()
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<QueryCategory | null>(null)

  const handleCategoryClick = (category: QueryCategory) => {
    if (expandedCategory === category) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(category)
      setSelectedCategory(category)
    }
  }

  const startChat = (category: QueryCategory) => {
    setSelectedCategory(category)
    setCurrentView("ai-chat")

    // Add initial bot message
    addMessage({
      sender: "ai",
      text: "Our executive is joining… Kindly detail your concern so they can help you better.",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Help & Support</h2>

      {/* Appointment Info */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
          onClick={() => setIsAppointmentOpen(!isAppointmentOpen)}
        >
          <h3 className="font-medium text-gray-700">Appointment Information</h3>
          {isAppointmentOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {isAppointmentOpen && (
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Lab</p>
                <p className="font-medium">Ruby Hall Labs, Pune</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">Lab Visit</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-yellow-600">Initiated</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">May 17, 2025</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support Categories */}
      <h3 className="text-lg font-medium text-gray-700 mb-4">How can we help you today?</h3>

      <div className="space-y-4">
        {/* Appointment Related Queries */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className={`flex items-center p-4 cursor-pointer ${expandedCategory === "appointment" ? "bg-blue-50" : "bg-white"}`}
            onClick={() => handleCategoryClick("appointment")}
          >
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <h4 className="font-medium">Appointment Related Queries</h4>
              <p className="text-sm text-gray-500">Scheduling, cancellation, rescheduling</p>
            </div>
          </div>

          {expandedCategory === "appointment" && (
            <div className="p-4 border-t bg-gray-50">
              <ul className="space-y-2">
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">How do I reschedule my appointment?</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Can I cancel my appointment?</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">What documents do I need to bring?</li>
              </ul>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                onClick={() => startChat("appointment")}
              >
                Chat With Us
              </button>
            </div>
          )}
        </div>

        {/* Lab Test Related Queries */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className={`flex items-center p-4 cursor-pointer ${expandedCategory === "lab" ? "bg-blue-50" : "bg-white"}`}
            onClick={() => handleCategoryClick("lab")}
          >
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Flask className="text-green-600" size={24} />
            </div>
            <div>
              <h4 className="font-medium">Lab Test Related Queries</h4>
              <p className="text-sm text-gray-500">Test preparation, results, interpretation</p>
            </div>
          </div>

          {expandedCategory === "lab" && (
            <div className="p-4 border-t bg-gray-50">
              <ul className="space-y-2">
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">How do I prepare for my lab test?</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">When will I get my test results?</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">How do I understand my test report?</li>
              </ul>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                onClick={() => startChat("lab")}
              >
                Chat With Us
              </button>
            </div>
          )}
        </div>

        {/* Payment and Other Queries */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className={`flex items-center p-4 cursor-pointer ${expandedCategory === "payment" ? "bg-blue-50" : "bg-white"}`}
            onClick={() => handleCategoryClick("payment")}
          >
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <CreditCard className="text-purple-600" size={24} />
            </div>
            <div>
              <h4 className="font-medium">Payment and Other Queries</h4>
              <p className="text-sm text-gray-500">Billing, insurance, general questions</p>
            </div>
          </div>

          {expandedCategory === "payment" && (
            <div className="p-4 border-t bg-gray-50">
              <ul className="space-y-2">
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">What payment methods are accepted?</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Do you accept my insurance?</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Can I get a receipt for my payment?</li>
              </ul>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                onClick={() => startChat("payment")}
              >
                Chat With Us
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
