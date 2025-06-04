import { type NextRequest, NextResponse } from "next/server"
import { callGeminiAPI } from "@/utils/gemini-api"

// Enhanced appointment context data with comprehensive test package details
const APPOINTMENT_CONTEXT = {
  // Case Details - Phelbo Visit
  appointmentType: "Home Collection",
  appointmentStatus: "Agent Assigned",
  provider: "Thyrocare Labs",
  patient: "Omkar Patil",
  appointmentDateTime: "3 June 2025, 4:00 PM to 5:00 PM",
  slot: "4:00 PM to 5:00 PM",
  agentName: "Parth Raheja",
  agentNumber: "1234567890",
  bookingTime: "26 May 2025, 11:00 AM",
  reportTAT: "6th June 5pm",
  paymentMethod: "wallet",

  // Comprehensive Lab Package Details
  packageName: "Aarogyam Full Body Platinum Package – Pune",
  packageProvider: "Thyrocare",
  cost: "₹8499",
  reportsIn: "48 hours",
  timesBooked: "5000+ times",
  sampleCollection: "Home Collection only",
  labVisit: false,
  labVisitAvailable: "❌ Unavailable",
  earliestSlot: "Tomorrow, 6:00 AM",
  confirmation: "Quick Confirmation",

  // Test Details
  totalTests: 136,
  specialPanels: {
    arthritisPanel: "2 tests",
    cardiacRiskMarkers: "7 tests",
  },

  // Preparation Requirements
  fastingRequired: true,
  fastingDuration: "8–12 hours mandatory",

  // Package Benefits
  aboutPackage:
    "The Aarogyam Full Body Platinum Package offers comprehensive health assessment, targeting: Nutritional deficiencies, Hormonal imbalances, Lifestyle-related risks, Growth and metabolism disorders. Ideal for professionals and individuals looking for preventive care and in-depth diagnostics.",

  // Contact and Location
  clinicContact: "+91-20-2605-5000",
  clinicAddress: "Thyrocare Labs, Viman Nagar, Pune, Maharashtra 411014",
  mapsLink: "https://maps.google.com/?q=Thyrocare+Labs+Viman+Nagar+Pune",
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("Received message:", message)
    console.log("Conversation history length:", conversationHistory.length)

    // Always use Gemini API with appointment context
    console.log("Using Gemini API for message:", message)
    const geminiResult = await callGeminiAPI(message, conversationHistory, APPOINTMENT_CONTEXT)

    return NextResponse.json({
      response: geminiResult.response,
      shouldEscalate: geminiResult.shouldEscalate,
      escalationType: geminiResult.escalationType,
      source: "gemini",
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        shouldEscalate: false,
      },
      { status: 500 },
    )
  }
}
