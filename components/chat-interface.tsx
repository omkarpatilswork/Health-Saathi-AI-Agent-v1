"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useApp } from "@/context/app-context"
import { ChevronDown, ChevronUp } from "lucide-react"

const CUSTOMER_DATA = {
  appointmentType: "Home Collection",
  appointmentStatus: "Agent Assigned",
  provider: "Thyrocare Labs",
  patient: "Omkar Patil",
  appointmentDateTime: "29 May 2025, 5:00 PM to 6:00 PM",
  slot: "5:00 PM to 6:00 PM",
  agentName: "Parth Raheja",
  agentNumber: "1234567890",
  bookingTime: "26 May 2025, 11:00 AM",
  reportTAT: "1st June 5pm",
  paymentMethod: "wallet",
  packageName: "Aarogyam Full Body Platinum Package – Pune",
  packageProvider: "Thyrocare",
  cost: "₹8499",
  reportsIn: "48 hours",
  fastingRequired: true,
  fastingDuration: "8–12 hours mandatory",
}

// Calculate faster typing delay based on message length
const calculateTypingDelay = (message: string): number => {
  const baseDelay = 800
  const wordsPerMinute = 60
  const words = message.split(" ").length
  const typingTime = (words / wordsPerMinute) * 60 * 1000
  return Math.min(Math.max(baseDelay, typingTime), 2500)
}

// Check if bot is offering to close conversation
const isBotOfferingClosure = (message: string): boolean => {
  const closurePhrases = [
    "would you like to share your feedback",
    "i'll go ahead and close this conversation",
    "would you like to share feedback",
    "close this conversation",
    "share your feedback",
  ]

  const lowerMessage = message.toLowerCase()
  return closurePhrases.some((phrase) => lowerMessage.includes(phrase))
}

// Check if user is accepting feedback/closure
const isUserAcceptingFeedback = (message: string): boolean => {
  const acceptKeywords = ["yes", "sure", "okay", "ok", "go ahead", "yes please", "that's fine", "thats fine"]

  const lowerMessage = message.toLowerCase().trim()
  return acceptKeywords.some((keyword) => lowerMessage.includes(keyword))
}

// Check if user is declining further help
const isUserDecliningHelp = (message: string): boolean => {
  const declineKeywords = [
    "no thanks",
    "no thank you",
    "that's all",
    "thats all",
    "nothing else",
    "no nothing else",
    "i'm good",
    "im good",
    "all good",
    "no more",
    "that's it",
    "thats it",
    "no",
    "nope",
  ]

  const lowerMessage = message.toLowerCase().trim()
  return declineKeywords.some((keyword) => lowerMessage.includes(keyword))
}

// Add this helper function at the top of the file, after the imports
const buildConversationHistory = (messages: any[]): Array<{ role: "user" | "model"; text: string }> => {
  const history: Array<{ role: "user" | "model"; text: string }> = []

  // Get last 10 messages (excluding system messages) to build context
  const relevantMessages = messages
    .filter((msg) => msg.sender === "user" || msg.sender === "bot" || msg.sender === "agent")
    .slice(-10)

  for (const msg of relevantMessages) {
    if (msg.sender === "user") {
      history.push({ role: "user", text: msg.message })
    } else if (msg.sender === "bot" || msg.sender === "agent") {
      history.push({ role: "model", text: msg.message })
    }
  }

  return history
}

export default function ChatInterface() {
  const searchParams = useSearchParams()
  const queryType = searchParams.get("type") || "confirm"

  const {
    appointmentStatus,
    setAppointmentStatus,
    messages,
    addMessage,
    botMessageCount,
    setBotMessageCount,
    showCSAT,
    setShowCSAT,
    csatRating,
    setCsatRating,
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
  } = useApp()

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showContextBox, setShowContextBox] = useState(false)

  // Initialize chat with system message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        sender: "system",
        message: "Health Saathi assistant is joining. Please explain your concern so we can help you better.",
      })

      // Add initial greeting from Health Saathi with faster delay
      setTimeout(() => {
        addMessage({
          sender: "agent",
          message:
            "Hello! I'm here to help with your home collection appointment with Thyrocare Labs on 29 May at 5:00 PM. What can I assist you with?",
          initials: "HS",
        })
      }, 1500)
    }
  }, [addMessage, messages.length])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleEscalation = () => {
    setEscalationTriggered(true)
    setIsTransferring(true)

    // Stage 2: Show transferring message
    addMessage({
      sender: "system",
      message: "Transferring to Senior Agent...",
    })

    // Stage 3: Senior agent joins after 3-4 seconds
    setTimeout(() => {
      setIsTransferring(false)
      setSeniorAgentJoined(true)

      // Agent join notification
      addMessage({
        sender: "system",
        message: "MK (Senior Agent) has joined the chat.",
      })

      // Senior agent's first message with faster delay
      setTimeout(() => {
        addMessage({
          sender: "agent",
          message:
            "Hi, I'm MK, your senior support agent. Don't worry, I'm checking the details and will assist you right away. Please give me a moment.",
          initials: "MK",
        })
      }, 2000)
    }, 3500)
  }

  const handleRating = (rating: number) => {
    setCsatRating(rating)

    setTimeout(() => {
      addMessage({
        sender: "system",
        message: `Thank you for your ${rating}-star rating! We appreciate your feedback.`,
      })

      if (rating === 1) {
        // For 1-star rating, show escalation prompt
        setShowCSAT(false)
        setShowEscalationPrompt(true)
      } else {
        // For other ratings, just hide CSAT and end chat
        setShowCSAT(false)
        setChatEnded(true)
      }
    }, 500)
  }

  const handleEscalationChoice = (escalate: boolean) => {
    setShowEscalationPrompt(false)

    if (escalate) {
      addMessage({
        sender: "agent",
        message: "I understand. Let me escalate this to a senior agent right away.",
        initials: "HS",
      })
      setTimeout(() => {
        handleEscalation()
      }, 1000)
    } else {
      addMessage({
        sender: "agent",
        message: "Thank you for your feedback. We'll work on improving our service. Have a great day!",
        initials: "HS",
      })
      setChatEnded(true)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping || isTransferring) return

    // Add user message
    addMessage({
      sender: "user",
      message: inputValue,
    })

    const userMessage = inputValue
    setInputValue("")
    setIsTyping(true)

    // Check if user is accepting feedback after bot offered closure
    if (botOfferedClosure && isUserAcceptingFeedback(userMessage)) {
      setTimeout(() => {
        setIsTyping(false)
        setBotOfferedClosure(false)
        setShowCSAT(true)
      }, 1000)
      return
    }

    try {
      // If senior agent has joined, handle manually
      if (seniorAgentJoined) {
        const responses = [
          "I understand your concern. Let me personally look into this for you. Can you give me more details about the specific issue?",
          "Thanks for explaining that. I'm checking your account details now. This should be resolved quickly.",
          "I see the issue here. Let me fix this for you right away. You shouldn't have to deal with this.",
          "Got it. I'm escalating this internally to get you a quick resolution. Bear with me for just a moment.",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        const delay = calculateTypingDelay(randomResponse)

        setTimeout(() => {
          addMessage({
            sender: "agent",
            message: randomResponse,
            initials: "MK",
          })
          setIsTyping(false)
        }, delay)
        return
      }

      // Build conversation history for context
      const conversationHistory = buildConversationHistory(messages)

      // Use Gemini API
      const apiResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
      })

      const apiData = await apiResponse.json()

      if (apiData.response) {
        // Calculate typing delay
        const typingDelay = calculateTypingDelay(apiData.response)

        setTimeout(() => {
          addMessage({
            sender: "agent",
            message: apiData.response,
            initials: "HS",
          })
          setIsTyping(false)

          // Check if bot is offering closure
          if (isBotOfferingClosure(apiData.response)) {
            setBotOfferedClosure(true)
          }

          // Check if escalation is needed
          if (apiData.shouldEscalate && !escalationTriggered) {
            setTimeout(() => {
              handleEscalation()
            }, 1000)
          }
        }, typingDelay)
      } else {
        // Fallback response with delay
        setTimeout(() => {
          addMessage({
            sender: "agent",
            message:
              "I understand your concern. Let me help you with your Thyrocare Labs appointment. Could you provide more details?",
            initials: "HS",
          })
          setIsTyping(false)
        }, 1500)
      }

      setBotMessageCount((prev) => prev + 1)
    } catch (error) {
      console.error("Error calling chat API:", error)

      // Fallback response on error with delay
      setTimeout(() => {
        addMessage({
          sender: "agent",
          message: "Sorry, I'm having a technical issue. I'm here to help with your Thyrocare Labs appointment though.",
          initials: "HS",
        })
        setIsTyping(false)
      }, 1200)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden">
      {/* Chat Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/" className="mr-3">
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">
          {seniorAgentJoined ? "Chat with MK (Senior Agent)" : "Chat Support"}
        </h1>
      </header>

      {/* Context Box */}
      <div className="bg-white border-b border-gray-200">
        <button
          onClick={() => setShowContextBox(!showContextBox)}
          className="w-full flex justify-between items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Appointment Details
          {showContextBox ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            showContextBox ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <div>
                <span className="text-gray-500 text-xs">Provider</span>
                <p className="font-medium">{CUSTOMER_DATA.provider}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Type</span>
                <p className="font-medium">{CUSTOMER_DATA.appointmentType}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <span className="text-gray-500 text-xs">Status</span>
                <p className="font-medium text-yellow-600">{CUSTOMER_DATA.appointmentStatus}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Patient</span>
                <p className="font-medium">{CUSTOMER_DATA.patient}</p>
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Appointment Date & Time</span>
              <p className="font-medium">{CUSTOMER_DATA.appointmentDateTime}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Booking Time</span>
              <p className="font-medium">{CUSTOMER_DATA.bookingTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} ${
              message.sender === "system" ? "justify-center" : ""
            }`}
          >
            {message.sender === "system" ? (
              <div
                className={`rounded-lg p-3 max-w-[85%] text-center text-sm ${
                  message.message.includes("Transferring")
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : message.message.includes("MK (Senior Agent)")
                      ? "bg-green-100 text-green-800 border border-green-200 font-medium"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {message.message.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-1" : ""}>
                    {line}
                  </p>
                ))}
                {message.message.includes("Transferring") && (
                  <div className="flex justify-center mt-2">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ) : message.sender === "user" ? (
              <div className="bg-blue-600 text-white rounded-lg rounded-tr-none p-3 max-w-[85%]">
                {message.message.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-1" : ""}>
                    {line}
                  </p>
                ))}
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ) : (
              <div className="flex">
                <div className="flex-shrink-0 mr-2">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                      message.initials === "MK"
                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {message.initials || "HS"}
                  </div>
                </div>
                <div
                  className={`rounded-lg rounded-tl-none p-3 max-w-[75%] border shadow-sm text-gray-800 ${
                    message.initials === "MK" ? "bg-green-50 border-green-200" : "bg-white border-gray-100"
                  }`}
                >
                  {message.message.split("\n").map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-1" : ""}>
                      {line}
                    </p>
                  ))}
                  <div className="text-xs mt-1 text-gray-500 flex items-center">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex">
            <div className="flex-shrink-0 mr-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                  seniorAgentJoined
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {seniorAgentJoined ? "MK" : "HS"}
              </div>
            </div>
            <div
              className={`rounded-lg rounded-tl-none p-3 border shadow-sm text-gray-500 ${
                seniorAgentJoined ? "bg-green-50 border-green-200" : "bg-white border-gray-100"
              }`}
            >
              <div className="flex space-x-1">
                <div
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    seniorAgentJoined ? "bg-green-400" : "bg-blue-400"
                  }`}
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    seniorAgentJoined ? "bg-green-400" : "bg-blue-400"
                  }`}
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    seniorAgentJoined ? "bg-green-400" : "bg-blue-400"
                  }`}
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Escalation Prompt for 1-Star Rating */}
        {showEscalationPrompt && (
          <div className="flex justify-center my-4">
            <div className="bg-white p-4 rounded-lg shadow-sm w-full border border-gray-100">
              <p className="text-center font-medium mb-3 text-gray-800">
                I'm really sorry for the inconvenience caused. Would you like me to escalate this to a senior agent
                right away?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleEscalationChoice(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Yes, escalate
                </button>
                <button
                  onClick={() => handleEscalationChoice(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                >
                  No, just feedback
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSAT Rating - Only shows when bot offers closure and user accepts */}
        {showCSAT && (
          <div className="flex justify-center my-4">
            <div className="bg-white p-4 rounded-lg shadow-sm w-full border border-gray-100">
              <p className="text-center font-medium mb-3 text-gray-800">How would you rate your experience?</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isTransferring
                ? "Connecting to senior agent..."
                : seniorAgentJoined
                  ? "Type your message to MK..."
                  : "Type your message here..."
            }
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isTyping || isTransferring || chatEnded}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={!inputValue.trim() || isTyping || isTransferring || chatEnded}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
