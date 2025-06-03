"use client"

import { useState } from "react"
import { X } from "lucide-react"
import CancellationReasons from "./cancellation-reasons"

interface CancelDialogProps {
  onClose: () => void
}

export default function CancelDialog({ onClose }: CancelDialogProps) {
  const [showReasons, setShowReasons] = useState(false)

  const handleReschedule = () => {
    onClose()
    // This would typically navigate to the reschedule screen
    // For now, we'll just close the dialog
  }

  const handleCancel = () => {
    setShowReasons(true)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {!showReasons ? (
          <>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Cancel Appointment</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-700 mb-2">Are you sure you want to cancel the appointment?</p>
              <p className="text-gray-500 text-sm">Cancellation charges up to ₹1000 might be applicable.</p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={handleReschedule}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reschedule
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Yes, Cancel
              </button>
            </div>
          </>
        ) : (
          <CancellationReasons onClose={onClose} />
        )}
      </div>
    </div>
  )
}
