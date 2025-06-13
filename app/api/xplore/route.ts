import { type NextRequest, NextResponse } from "next/server"

// Healthcare context data for Xplore Labs & Packages
const HEALTHCARE_CONTEXT = {
  // Provider Network Data
  providers: [
    {
      name: "Thyrocare",
      locations: ["400001", "411045", "560001"],
      services: ["Blood Tests", "Full Body Checkup", "Thyroid Profile"],
      specialties: ["Pathology", "Preventive Health"],
      rating: "4.2",
      reviews: "1250+",
      contact: "+91-20-2605-7890",
    },
    {
      name: "Lal Path Labs",
      locations: ["400001", "411045", "110001"],
      services: ["Blood Tests", "Full Body Checkup", "Cardiac Profile"],
      specialties: ["Pathology", "Cardiology"],
      rating: "4.4",
      reviews: "2100+",
      contact: "+91-20-2605-3456",
    },
    {
      name: "Healthians",
      locations: ["400001", "411045", "110001", "560001"],
      services: ["Home Collection", "Full Body Checkup", "Vitamin Tests"],
      specialties: ["Pathology", "Home Healthcare"],
      rating: "4.3",
      reviews: "1800+",
      contact: "+91-20-2605-9876",
    },
    {
      name: "Ruby Hall Labs",
      locations: ["411001", "411045"],
      services: ["Blood Tests", "Imaging", "Cardiac Tests"],
      specialties: ["Pathology", "Cardiology", "Radiology"],
      rating: "4.5",
      reviews: "3200+",
      contact: "+91-20-2605-1234",
    },
    {
      name: "Dr. Omkar Patil's Clinic",
      locations: ["411014", "411045"],
      services: ["Consultation", "Health Checkup", "Preventive Care"],
      specialties: ["General Medicine", "Preventive Health"],
      rating: "4.7",
      reviews: "950+",
      contact: "+91-20-2605-5678",
    },
  ],

  // Package Data
  packages: [
    {
      name: "Full Body Checkup",
      provider: "Thyrocare",
      price: 799,
      tests: ["CBC", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid Profile"],
      tat: "24 hours",
      homeCollection: true,
      fasting: "8-12 hours",
    },
    {
      name: "Full Body Checkup",
      provider: "Lal Path Labs",
      price: 1199,
      tests: ["CBC", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid Profile", "ECG", "ESR"],
      tat: "48 hours",
      homeCollection: true,
      fasting: "10-12 hours",
    },
    {
      name: "Full Body Checkup",
      provider: "Healthians",
      price: 999,
      tests: ["CBC", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid Profile", "Vitamin D"],
      tat: "24 hours",
      homeCollection: true,
      fasting: "8-10 hours",
    },
    {
      name: "Aarogyam Full Body Platinum Package",
      provider: "Thyrocare",
      price: 8499,
      tests: [
        "Complete Blood Count (22 parameters)",
        "Lipid Profile (8 parameters)",
        "Liver Function (12 parameters)",
        "Kidney Function (9 parameters)",
        "Thyroid Profile (3 parameters)",
        "Diabetes Panel (5 parameters)",
        "Vitamin Panel (4 parameters)",
        "Cardiac Risk Markers (7 parameters)",
        "Arthritis Panel (2 parameters)",
        "And 64 more tests",
      ],
      tat: "48 hours",
      homeCollection: true,
      fasting: "8-12 hours mandatory",
    },
    {
      name: "Basic Vitamin Panel",
      provider: "Thyrocare",
      price: 899,
      tests: ["Vitamin D", "Vitamin B12", "Calcium"],
      tat: "24 hours",
      homeCollection: true,
      fasting: "Not required",
    },
    {
      name: "Vitamin Essentials",
      provider: "Lal Path Labs",
      price: 1299,
      tests: ["Vitamin D", "Vitamin B12", "Vitamin B9 (Folate)", "Calcium", "Iron"],
      tat: "36 hours",
      homeCollection: true,
      fasting: "Not required",
    },
    {
      name: "Vitamin D Test",
      provider: "Healthians",
      price: 599,
      tests: ["Vitamin D only"],
      tat: "24 hours",
      homeCollection: true,
      fasting: "Not required",
    },
    {
      name: "Diabetes Control Package",
      provider: "Thyrocare",
      price: 599,
      tests: ["HbA1c", "Fasting Blood Sugar", "Post Prandial Blood Sugar", "Lipid Profile"],
      tat: "24 hours",
      homeCollection: true,
      fasting: "8-12 hours",
    },
    {
      name: "Diabetes Care Package",
      provider: "Lal Path Labs",
      price: 699,
      tests: ["HbA1c", "Fasting Blood Sugar", "Post Prandial Blood Sugar", "Lipid Profile", "Kidney Function Test"],
      tat: "36 hours",
      homeCollection: true,
      fasting: "8-12 hours",
    },
  ],

  // Slot Availability Data
  slots: {
    "Ruby Hall Labs": {
      "29 May 2025": ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
      "30 May 2025": ["09:00 AM", "10:00 AM", "12:00 PM", "01:00 PM", "04:00 PM"],
      tomorrow: ["08:00 AM", "09:00 AM", "11:00 AM", "02:00 PM", "05:00 PM"],
    },
    Thyrocare: {
      "29 May 2025": ["06:00 AM", "07:00 AM", "08:00 AM", "05:00 PM", "06:00 PM"],
      "30 May 2025": ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "05:00 PM"],
      tomorrow: ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "05:00 PM", "06:00 PM"],
    },
    "Dr. Omkar P": {
      "29 May 2025": ["10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM", "06:00 PM"],
      "30 May 2025": ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM"],
      tomorrow: ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"],
    },
  },

  // Test Information
  testInfo: {
    "Vitamin D": {
      purpose: "Measures the level of Vitamin D in your blood",
      normalRange: "30-100 ng/mL",
      lowIndicates: "Bone weakening, increased risk of fractures",
      highIndicates: "Potential toxicity, kidney stones",
      preparation: "No special preparation required",
    },
    "Thyroid Profile": {
      purpose: "Evaluates thyroid function",
      includes: "T3, T4, TSH",
      normalRange: "TSH: 0.4-4.0 mIU/L, T4: 5.0-12.0 μg/dL, T3: 80-200 ng/dL",
      preparation: "No special preparation required",
    },
    "Lipid Profile": {
      purpose: "Assesses cardiovascular risk",
      includes: "Total Cholesterol, HDL, LDL, Triglycerides",
      normalRange: "Total Cholesterol: <200 mg/dL, HDL: >40 mg/dL, LDL: <100 mg/dL, Triglycerides: <150 mg/dL",
      preparation: "8-12 hours fasting required",
    },
    "Blood Sugar": {
      purpose: "Screens for diabetes and monitors blood glucose levels",
      includes: "Fasting Blood Sugar, Post Prandial Blood Sugar",
      normalRange: "Fasting: 70-100 mg/dL, Post Prandial: <140 mg/dL",
      preparation: "8-12 hours fasting required for FBS, 2 hours after meal for PPBS",
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("Received Xplore message:", message)
    console.log("Conversation history length:", conversationHistory.length)

    // Use Gemini API with healthcare context
    const geminiResult = await callGeminiXplore(message, conversationHistory, HEALTHCARE_CONTEXT)

    return NextResponse.json({
      response: geminiResult.response,
      source: "gemini",
    })
  } catch (error) {
    console.error("Xplore API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function callGeminiXplore(
  prompt: string,
  conversationHistory: Array<{ role: "user" | "model"; text: string }> = [],
  healthcareContext?: any,
): Promise<{ response: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured")
    }

    // Enhanced system prompt for Xplore Labs & Packages
    const systemPrompt = `You are a healthcare concierge assistant for "Xplore Labs & Packages", helping users find and understand healthcare services.

🎯 Your goals:
1. Act as a personal healthcare concierge who helps users understand lab tests, find packages, compare providers, and book slots
2. Keep responses conversational, helpful, and informative
3. Use the healthcare context data to provide accurate information
4. Format responses clearly with markdown for better readability
5. Provide specific recommendations based on price, quality, and convenience
6. Always include relevant details like pricing, preparation requirements, and what tests measure
7. Help users make informed healthcare decisions

### HEALTHCARE CONTEXT DATA:
${JSON.stringify(healthcareContext, null, 2)}

### RESPONSE PATTERNS:

**Network Queries (Finding Providers):**
- Include provider name, specialties, ratings, contact info, and Google Maps link
- Mention distance if available
- Format as a clear list with bold provider names
- Example: "**Ruby Hall Labs** (4.5⭐, 3200+ reviews) offers blood tests and cardiac services. Located in 411001, 411045. Contact: +91-20-2605-1234. [View on Map](https://maps.google.com/?q=Ruby+Hall+Labs+Pune)"

**Package Queries:**
- Include package name, provider, price, tests included, turnaround time, and preparation requirements
- For comparisons, use markdown tables to clearly show differences
- Highlight key differences and make recommendations based on value
- Example: "The **Full Body Checkup** by Thyrocare (₹799) includes 5 tests with results in 24 hours. Fasting required: 8-12 hours."

**Slot Queries:**
- List available slots with times and dates
- Include booking instructions
- Example: "Ruby Hall Labs has slots available tomorrow at: 08:00 AM, 09:00 AM, 11:00 AM, 02:00 PM, 05:00 PM. Would you like to book any of these?"

**Test Information Queries:**
- Explain what tests measure, normal ranges, and preparation requirements
- Use simple language to explain medical concepts
- Example: "Vitamin D test measures the level of this essential vitamin in your blood. Normal range is 30-100 ng/mL. Low levels may indicate bone weakening."

Always be helpful, accurate, and focused on making healthcare decisions easier for the user. If you don't have specific information, acknowledge that and offer to help with what you do know.`

    // Build conversation contents with history
    const contents = []

    // Add conversation history (last 8 messages for better context)
    const recentHistory = conversationHistory.slice(-8)
    for (const message of recentHistory) {
      contents.push({
        role: message.role,
        parts: [{ text: message.text }],
      })
    }

    // Add current user prompt with system context
    contents.push({
      role: "user",
      parts: [{ text: `${systemPrompt}\n\nUser Query: "${prompt}"` }],
    })

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error response:", errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Gemini API response:", JSON.stringify(data, null, 2))

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error("No text in Gemini response:", data)
      throw new Error("No response from Gemini API")
    }

    return {
      response: text.trim(),
    }
  } catch (error) {
    console.error("Error calling Gemini API for Xplore:", error)
    return {
      response:
        "I'm having trouble processing your request right now. Please try asking about healthcare providers, packages, or slots again.",
    }
  }
}
