"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { useApp } from "@/context/app-context"

interface CancellationReasonsProps {
  onClose: () => void
}

export default function CancellationReasons({ onClose }: CancellationReasonsProps) {
  const { setAppointmentStatus } = useApp()
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const reasons = [
    "Changed my mind",
    "Personal Emergency",
    "Out of town",
    "Wrongly booked",
    "Doctor/Lab Tech not available",
    "Others",
  ]

  const handleConfirm = () => {
    if (selectedReason) {
      setAppointmentStatus("Cancelled")
      onClose()
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Reason for Cancellation</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X size={20} />
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <button
            type="button"
            className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="block truncate">{selectedReason || "Select a reason"}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className={`cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                    selectedReason === reason ? "bg-blue-100" : ""
                  }`}
                  onClick={() => {
                    setSelectedReason(reason)
                    setIsOpen(false)
                  }}
                >
                  <span className={`block truncate ${selectedReason === reason ? "font-medium" : "font-normal"}`}>
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nevermind
        </button>
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            selectedReason ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
          }`}
          disabled={!selectedReason}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}
