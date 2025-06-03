"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type MessageType = {
  id: string
  sender: "user" | "ai" | "senior"
  text: string
  timestamp: Date
}

export type QueryCategory = "appointment" | "lab" | "payment" | null

type ChatContextType = {
  messages: MessageType[]
  addMessage: (message: Omit<MessageType, "id" | "timestamp">) => void
  currentView: "help" | "ai-chat" | "senior-chat" | "rating"
  setCurrentView: (view: "help" | "ai-chat" | "senior-chat" | "rating") => void
  selectedCategory: QueryCategory
  setSelectedCategory: (category: QueryCategory) => void
  isResolved: boolean
  setIsResolved: (resolved: boolean) => void
  rating: number | null
  setRating: (rating: number | null) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [currentView, setCurrentView] = useState<"help" | "ai-chat" | "senior-chat" | "rating">("help")
  const [selectedCategory, setSelectedCategory] = useState<QueryCategory>(null)
  const [isResolved, setIsResolved] = useState(false)
  const [rating, setRating] = useState<number | null>(null)

  const addMessage = (message: Omit<MessageType, "id" | "timestamp">) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])

    // Auto-escalate after 5 user messages
    const userMessageCount = [...messages, newMessage].filter((msg) => msg.sender === "user").length

    if (userMessageCount >= 5 && currentView === "ai-chat") {
      setTimeout(() => {
        addMessage({
          sender: "ai",
          text: "Sorry to see we were unable to resolve your query, please wait we are escalating your issue to a senior agent.",
        })

        setTimeout(() => {
          addMessage({
            sender: "ai",
            text: "Senior Agent is joining...",
          })

          setTimeout(() => {
            setCurrentView("senior-chat")
            addMessage({
              sender: "senior",
              text: "Hello, I'm Rahul, a senior support agent. I understand you're having an issue that our assistant couldn't resolve. Could you please summarize your concern so I can help you better?",
            })
          }, 2000)
        }, 1500)
      }, 1000)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        isResolved,
        setIsResolved,
        rating,
        setRating,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
