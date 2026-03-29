"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, ArrowLeft, MapPin, BarChart3, Search, GitBranch } from "lucide-react"
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
type CategoryType = "search" | "gmc" | "duplicates" | "stats" | null

// Enhanced sample prompts for each category
const SAMPLE_PROMPTS: Record<CategoryType, string[]> = {
  search: [
    "Which labs are available in 411014 for BALIC01?",
    "Show me providers in 411001",
    "Labs for TRAVIS07 in Pune",
  ],
  gmc: [
    "What tests are available in BALIC01 at Thyrocare 411014?",
    "Tests in TRAVIS07 at Lal Path Labs",
    "Show packages at Healthians for WELLNESS03",
  ],
  duplicates: [
    "Compare CBC packages between Thyrocare and Healthians",
    "Compare Lipid Profile at Thyrocare vs Lal Path Labs",
    "Compare Vitamin D tests across providers",
  ],
  stats: ["Show all available products", "List all providers and locations", "Help me understand what you can do"],
}

// Category descriptions
const CATEGORY_INFO: Record<CategoryType, { title: string; description: string; icon: any }> = {
  search: {
    title: "Find Labs",
    description: "Search labs by pincode and product availability",
    icon: Search,
  },
  gmc: {
    title: "List Tests",
    description: "View tests available in products at specific providers",
    icon: MapPin,
  },
  duplicates: {
    title: "Compare Packages",
    description: "Compare packages with specific tests between providers",
    icon: GitBranch,
  },
  stats: {
    title: "Help & Info",
    description: "Get help and view available products/providers",
    icon: BarChart3,
  },
  null: { title: "", description: "", icon: Search },
}

export default function ProjectXChat() {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null)

  // Initialize chat with enhanced welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        sender: "bot",
        message: `👋 **Hi! I'm Project X — your AI assistant**

I can help you with catalogue availability, GMC mappings, and duplicate packages. Here's what I can do:

**🔍 Search Options:**
• Search labs by pincode
• Find packages by lab name  
• Search by specific tests/inclusions
• Check GMC mapping status
• Find duplicate packages

**💡 Quick Start:**
Click on the category icons above to see sample queries, or ask me directly!

What would you like to explore?`,
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

    // Get last 6 messages to build context
    const relevantMessages = messages.slice(-6)

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

      // Call the enhanced Xplore API
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      const apiResponse = await fetch("/api/project-x", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`)
      }

      const apiData = await apiResponse.json()

      // Calculate typing delay based on message length
      const typingDelay = Math.min(Math.max(1000, apiData.response.length * 2), 2000)

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

      // Enhanced fallback response
      const fallbackResponse = generateEnhancedFallback(userMessage)

      setTimeout(() => {
        addMessage({
          sender: "bot",
          message: fallbackResponse,
        })
        setIsTyping(false)
      }, 1000)
    }
  }

  // Generate enhanced client-side fallback responses
  const generateEnhancedFallback = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("pincode") || /\b\d{6}\b/.test(userMessage)) {
      return `📍 **Pincode Search**

I can help you find labs by pincode. Here are some examples:
• "Labs in 411014" - Shows all labs in Viman Nagar area
• "411001 providers" - Lists Koregaon Park labs
• "411045 packages" - Displays Baner area options

Available pincodes: 411014, 411001, 411045`
    }

    if (lowerMessage.includes("gmc") || lowerMessage.includes("mapping")) {
      return `🔗 **GMC Mapping Information**

I can check GMC network mapping status:
• "Is Thyrocare GMC mapped?" - Shows GMC status
• "GMC packages at Lal Path Labs" - Lists GMC packages
• "Ruby Hall GMC status" - Displays mapping details

GMC mapping helps identify network-covered services.`
    }

    if (lowerMessage.includes("duplicate") || lowerMessage.includes("replica")) {
      return `🔍 **Duplicate Package Analysis**

I can find similar packages across labs:
• "Duplicate Full Body Checkup" - Shows all similar packages
• "Replica Diabetes packages" - Compares diabetes tests
• "Similar Vitamin D tests" - Lists vitamin options

This helps compare prices and inclusions across providers.`
    }

    if (lowerMessage.includes("stats") || lowerMessage.includes("statistics")) {
      return `📊 **Catalogue Statistics**

I can provide comprehensive data insights:
• "Show catalogue stats" - Overall statistics
• "List all labs" - Complete lab directory
• "Package price ranges" - Pricing analysis

Get insights into our healthcare network coverage.`
    }

    return `🔍 **Project X Healthcare Assistant**

I'm having trouble processing your request, but I can help with:

**🏥 Catalogue Search**
• Find labs by pincode or name
• Search packages by inclusions

**🔗 GMC Mapping**  
• Check network mapping status
• Verify GMC package availability

**📊 Analysis Tools**
• Find duplicate packages
• View statistics and insights

Please try using the category buttons above or ask about any of these topics!`
  }

  const handleCategoryClick = (category: CategoryType) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden">
      {/* Enhanced Chat Header */}
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 p-4 flex items-center">
        <Link href="/" className="mr-3">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div className="flex items-center">
          <span className="bg-white text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2">
            X
          </span>
          <div>
            <h1 className="text-lg font-semibold text-white">Project X</h1>
            <p className="text-xs text-indigo-100">Healthcare Catalogue Assistant</p>
          </div>
        </div>
      </header>

      {/* Enhanced Feature Categories */}

      {/* Enhanced Sample Prompts */}
      {selectedCategory && (
        <div className="bg-indigo-50 p-3 border-b border-indigo-100">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-indigo-800">{CATEGORY_INFO[selectedCategory].title}</h3>
            <p className="text-xs text-indigo-600">{CATEGORY_INFO[selectedCategory].description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS[selectedCategory].map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="px-3 py-1.5 bg-white text-indigo-700 rounded-full text-xs hover:bg-indigo-100 transition-colors border border-indigo-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.sender === "user" ? (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg rounded-tr-none p-3 max-w-[85%] shadow-sm">
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
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-2 border-indigo-200">
                    X
                  </div>
                </div>
                <div
                  className={`rounded-lg rounded-tl-none p-3 max-w-[75%] border shadow-sm text-gray-800 bg-white border-gray-100 ${message.isTable ? "whitespace-pre overflow-x-auto text-xs" : ""}`}
                >
                  {message.message.split("\n").map((line, i) => {
                    // Enhanced markdown parsing for better formatting
                    if (line.includes("**")) {
                      const parts = line.split(/\*\*(.*?)\*\*/g)
                      return (
                        <p key={i} className={i > 0 ? "mt-1" : ""}>
                          {parts.map((part, j) => {
                            return j % 2 === 1 ? (
                              <strong key={j} className="text-indigo-700">
                                {part}
                              </strong>
                            ) : (
                              part
                            )
                          })}
                        </p>
                      )
                    }
                    // Handle table rows
                    else if (line.includes("|") && line.includes("-")) {
                      return (
                        <div key={i} className="font-mono text-xs bg-gray-50 p-1 rounded mt-1">
                          {line}
                        </div>
                      )
                    }
                    // Handle bullet points
                    else if (line.trim().startsWith("•")) {
                      return (
                        <p key={i} className={`${i > 0 ? "mt-1" : ""} text-sm`}>
                          <span className="text-indigo-600 mr-1">•</span>
                          {line.trim().substring(1)}
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

        {/* Enhanced typing indicator */}
        {isTyping && (
          <div className="flex">
            <div className="flex-shrink-0 mr-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-2 border-indigo-200">
                X
              </div>
            </div>
            <div className="rounded-lg rounded-tl-none p-3 border shadow-sm text-gray-500 bg-white border-gray-100">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-400">Analyzing catalogue...</span>
                <div className="flex space-x-1 ml-2">
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
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="bg-white border-t border-gray-200 p-3">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              selectedCategory === "search"
                ? "Search labs, packages, or tests..."
                : selectedCategory === "gmc"
                  ? "Check GMC mapping status..."
                  : selectedCategory === "duplicates"
                    ? "Find duplicate packages..."
                    : selectedCategory === "stats"
                      ? "Get statistics and insights..."
                      : "Ask me about catalogue, GMC mapping, or duplicates..."
            }
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-r-md hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-300 disabled:to-purple-300 disabled:cursor-not-allowed transition-all"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
