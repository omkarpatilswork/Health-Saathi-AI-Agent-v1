"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Appointment status type
export type AppointmentStatus = "Initiated" | "Confirmed" | "Rescheduled" | "Cancelled"

// Message types for chat
export type MessageSender = "system" | "user" | "bot" | "agent"

export interface Message {
  id: string
  sender: MessageSender
  message: string
  initials?: string
  timestamp: Date
}

// Context type
type AppContextType = {
  appointmentStatus: AppointmentStatus
  setAppointmentStatus: (status: AppointmentStatus) => void
  appointmentDate: Date
  setAppointmentDate: (date: Date) => void
  appointmentTime: string
  setAppointmentTime: (time: string) => void
  messages: Message[]
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  botMessageCount: number
  setBotMessageCount: (count: number) => void
  csatRating: number | null
  setCsatRating: (rating: number | null) => void
  showCSAT: boolean
  setShowCSAT: (show: boolean) => void
  chatEnded: boolean
  setChatEnded: (ended: boolean) => void
  escalationTriggered: boolean
  setEscalationTriggered: (triggered: boolean) => void
  seniorAgentJoined: boolean
  setSeniorAgentJoined: (joined: boolean) => void
  isTransferring: boolean
  setIsTransferring: (transferring: boolean) => void
  botOfferedClosure: boolean
  setBotOfferedClosure: (offered: boolean) => void
  showEscalationPrompt: boolean
  setShowEscalationPrompt: (show: boolean) => void
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [appointmentStatus, setAppointmentStatus] = useState<AppointmentStatus>("Initiated")
  const [appointmentDate, setAppointmentDate] = useState<Date>(new Date())
  const [appointmentTime, setAppointmentTime] = useState<string>("10:00 AM")
  const [messages, setMessages] = useState<Message[]>([])
  const [botMessageCount, setBotMessageCount] = useState(0)
  const [csatRating, setCsatRating] = useState<number | null>(null)
  const [showCSAT, setShowCSAT] = useState(false)
  const [chatEnded, setChatEnded] = useState(false)
  const [escalationTriggered, setEscalationTriggered] = useState(false)
  const [seniorAgentJoined, setSeniorAgentJoined] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [botOfferedClosure, setBotOfferedClosure] = useState(false)
  const [showEscalationPrompt, setShowEscalationPrompt] = useState(false)

  // Add message to chat
  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <AppContext.Provider
      value={{
        appointmentStatus,
        setAppointmentStatus,
        appointmentDate,
        setAppointmentDate,
        appointmentTime,
        setAppointmentTime,
        messages,
        addMessage,
        botMessageCount,
        setBotMessageCount,
        csatRating,
        setCsatRating,
        showCSAT,
        setShowCSAT,
        chatEnded,
        setChatEnded,
        escalationTriggered,
        setEscalationTriggered,
        seniorAgentJoined,
        setSeniorAgentJoined,
        isTransferring,
        setIsTransferring,
        botOfferedClosure,
        setBotOfferedClosure,
        showEscalationPrompt,
        setShowEscalationPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
