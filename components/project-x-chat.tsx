"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, ArrowLeft, Package, MapPin, Clock } from "lucide-react"
import Link from "next/link"

// Define message types
interface Message {
  id: string
  sender: "user" | "bot"
  message: string
  timestamp: Date
  isTable?: boolean
}

// Define category types
type CategoryType = "network" | "packages" | "slots" | null

// Sample prompts for each category
const SAMPLE_PROMPTS: Record<CategoryType, string[]> = {
  network: ["Dentists in Kharadi", "Lab Providers with ECG test in 411014", "Nearest Hospital"],
  packages: [
    "Compare Full Body Packages at Thyrocare and Healthians",
    "Cheaper packages with Vitamin D tests at different providers",
    "What tests are included in Thyrocare Aarogyam?",
  ],
  slots: ["Slots available at Ruby Hall", "Book my slot at Dr. Omkar P for 5pm", "Morning slots at Thyrocare tomorrow"],
  null: [],
}

export default function ProjectXChat() {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null)

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        sender: "bot",
        message:
          "👋 Welcome to Xplore Labs & Packages!\n\nI'm your personal healthcare concierge. I can help you find providers, understand test packages, compare prices, and book appointments. What would you like to explore today?\n\nTip: Click on the icons above to see sample queries.",
      })
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  // Build conversation history for context
  const buildConversationHistory = (messages: Message[]): Array<{ role: "user" | "model"; text: string }> => {
    const history: Array<{ role: "user" | "model"; text: string }> = []

    // Get last 10 messages to build context
    const relevantMessages = messages.slice(-10)

    for (const msg of relevantMessages) {
      if (msg.sender === "user") {
        history.push({ role: "user", text: msg.message })
      } else if (msg.sender === "bot") {
        history.push({ role: "model", text: msg.message })
      }
    }

    return history
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return

    // Add user message
    addMessage({
      sender: "user",
      message: inputValue,
    })

    const userMessage = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      // Build conversation history for context
      const conversationHistory = buildConversationHistory(messages)

      // Call the Xplore API with Gemini
      const apiResponse = await fetch("/api/xplore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
      })

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`)
      }

      const apiData = await apiResponse.json()

      // Calculate typing delay based on message length
      const typingDelay = Math.min(Math.max(800, apiData.response.length * 5), 2000)

      setTimeout(() => {
        addMessage({
          sender: "bot",
          message: apiData.response,
          isTable: apiData.response.includes("|") && apiData.response.includes("-|-"),
        })
        setIsTyping(false)
      }, typingDelay)
    } catch (error) {
      console.error("Error calling Xplore API:", error)

      setTimeout(() => {
        addMessage({
          sender: "bot",
          message:
            "I'm having trouble processing your request right now. Please try asking about healthcare providers, packages, or slots again.",
        })
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleCategoryClick = (category: CategoryType) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden">
      {/* Chat Header */}
      <header className="bg-indigo-700 p-4 flex items-center">
        <Link href="/" className="mr-3">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div className="flex items-center">
          <span className="bg-white text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2">
            X
          </span>
          <h1 className="text-lg font-semibold text-white">Xplore Labs & Packages</h1>
        </div>
      </header>

      {/* Feature Icons - Now Clickable */}
      <div className="bg-indigo-50 p-2 flex justify-around border-b border-indigo-100">
        <button
          onClick={() => handleCategoryClick("network")}
          className={`flex flex-col items-center px-4 py-2 rounded-md transition-colors ${
            selectedCategory === "network" ? "bg-indigo-100 text-indigo-800" : "text-indigo-600 hover:bg-indigo-100"
          }`}
        >
          <MapPin size={18} className={selectedCategory === "network" ? "text-indigo-800" : "text-indigo-600"} />
          <span className="text-xs mt-1">Network</span>
        </button>
        <button
          onClick={() => handleCategoryClick("packages")}
          className={`flex flex-col items-center px-4 py-2 rounded-md transition-colors ${
            selectedCategory === "packages" ? "bg-indigo-100 text-indigo-800" : "text-indigo-600 hover:bg-indigo-100"
          }`}
        >
          <Package size={18} className={selectedCategory === "packages" ? "text-indigo-800" : "text-indigo-600"} />
          <span className="text-xs mt-1">Packages</span>
        </button>
        <button
          onClick={() => handleCategoryClick("slots")}
          className={`flex flex-col items-center px-4 py-2 rounded-md transition-colors ${
            selectedCategory === "slots" ? "bg-indigo-100 text-indigo-800" : "text-indigo-600 hover:bg-indigo-100"
          }`}
        >
          <Clock size={18} className={selectedCategory === "slots" ? "text-indigo-800" : "text-indigo-600"} />
          <span className="text-xs mt-1">Slots</span>
        </button>
      </div>

      {/* Sample Prompts - Show when category is selected */}
      {selectedCategory && (
        <div className="bg-white p-3 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-2">
            {SAMPLE_PROMPTS[selectedCategory].map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.sender === "user" ? (
              <div className="bg-indigo-600 text-white rounded-lg rounded-tr-none p-3 max-w-[85%]">
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
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm bg-indigo-100 text-indigo-700 border-2 border-indigo-200">
                    X
                  </div>
                </div>
                <div
                  className={`rounded-lg rounded-tl-none p-3 max-w-[75%] border shadow-sm text-gray-800 bg-white border-gray-100 ${message.isTable ? "whitespace-pre overflow-x-auto" : ""}`}
                >
                  {message.message.split("\n").map((line, i) => {
                    // Check if line contains markdown bold syntax
                    if (line.includes("**")) {
                      const parts = line.split(/\*\*(.*?)\*\*/g)
                      return (
                        <p key={i} className={i > 0 ? "mt-1" : ""}>
                          {parts.map((part, j) => {
                            return j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          })}
                        </p>
                      )
                    }
                    // Check if line contains markdown link syntax
                    else if (line.includes("[") && line.includes("](")) {
                      const linkRegex = /\[(.*?)\]$$(.*?)$$/g
                      let lastIndex = 0
                      const parts = []
                      let match

                      while ((match = linkRegex.exec(line)) !== null) {
                        // Add text before the link
                        if (match.index > lastIndex) {
                          parts.push(line.substring(lastIndex, match.index))
                        }

                        // Add the link
                        parts.push(
                          <a
                            key={`link-${match.index}`}
                            href={match[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            {match[1]}
                          </a>,
                        )

                        lastIndex = match.index + match[0].length
                      }

                      // Add any remaining text
                      if (lastIndex < line.length) {
                        parts.push(line.substring(lastIndex))
                      }

                      return (
                        <p key={i} className={i > 0 ? "mt-1" : ""}>
                          {parts}
                        </p>
                      )
                    }
                    return (
                      <p key={i} className={i > 0 ? "mt-1" : ""}>
                        {line}
                      </p>
                    )
                  })}
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
              <div className="flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm bg-indigo-100 text-indigo-700 border-2 border-indigo-200">
                X
              </div>
            </div>
            <div className="rounded-lg rounded-tl-none p-3 border shadow-sm text-gray-500 bg-white border-gray-100">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full animate-bounce bg-indigo-400"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full animate-bounce bg-indigo-400"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full animate-bounce bg-indigo-400"
                  style={{ animationDelay: "300ms" }}
                ></div>
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
              selectedCategory === "network"
                ? "Search for healthcare providers..."
                : selectedCategory === "packages"
                  ? "Ask about test packages..."
                  : selectedCategory === "slots"
                    ? "Check slot availability..."
                    : "Ask me anything about healthcare services..."
            }
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
