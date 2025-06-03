"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useApp } from "@/context/app-context"

interface RescheduleScreenProps {
  onClose: () => void
}

export default function RescheduleScreen({ onClose }: RescheduleScreenProps) {
  const { setAppointmentStatus, setAppointmentDate, setAppointmentTime } = useApp()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Generate dates for the next 5 days
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })

  // Generate time slots from 6AM to 2PM
  const timeSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
  ]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const handleConfirm = () => {
    if (selectedTime) {
      setAppointmentDate(selectedDate)
      setAppointmentTime(selectedTime)
      setAppointmentStatus("Rescheduled")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <header className="bg-blue-600 text-white p-4 flex items-center">
        <button onClick={onClose} className="mr-3">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Reschedule Appointment</h1>
      </header>

      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-blue-800">Ruby Hall Labs, Pune</h2>
          <p className="text-blue-600 text-sm">Lab Visit - Booking ID: HS-12345678</p>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Select Date</h3>
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {dates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 p-3 rounded-lg border ${
                  selectedDate.toDateString() === date.toDateString()
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="text-center">
                  <p className="text-sm font-medium">{date.toLocaleDateString("en-US", { weekday: "short" })}</p>
                  <p className="text-xl font-bold">{date.getDate()}</p>
                  <p className="text-xs">{date.toLocaleDateString("en-US", { month: "short" })}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Select Time</h3>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-lg border text-center ${
                  selectedTime === time ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white border-gray-200"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleConfirm}
              disabled={!selectedTime}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                selectedTime ? "bg-blue-600" : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
