export async function callGeminiAPI(
  prompt: string,
  conversationHistory: Array<{ role: "user" | "model"; text: string }> = [],
  appointmentContext?: any,
): Promise<{ response: string; shouldEscalate: boolean; escalationType?: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured")
    }

    // Check for specific escalation triggers
    const technicianContactIssues = [
      "this number is not reachable",
      "not picking up",
      "phone is switched off",
      "can't contact the technician",
      "technician not answering",
      "number not working",
      "call not connecting",
      "phone not reachable",
      "technician not responding",
      "can't reach technician",
    ]

    const generalEscalationKeywords = [
      "want to talk to a human",
      "speak to senior",
      "not happy",
      "angry",
      "refund",
      "escalate",
      "manager",
      "supervisor",
      "human agent",
      "real person",
      "frustrated",
      "disappointed",
      "terrible service",
      "worst experience",
      "complaint",
      "unsatisfied",
    ]

    const lowerPrompt = prompt.toLowerCase()

    let shouldEscalate = false
    let escalationType = ""

    // Check for technician contact issues first (higher priority)
    if (technicianContactIssues.some((issue) => lowerPrompt.includes(issue))) {
      shouldEscalate = true
      escalationType = "technician_contact"
    } else if (generalEscalationKeywords.some((keyword) => lowerPrompt.includes(keyword))) {
      shouldEscalate = true
      escalationType = "general"
    }

    // Enhanced system prompt with more human-like responses and comprehensive test details
    const systemPrompt = `You are Health Saathi, a helpful healthcare support assistant. You respond like a real human agent would - naturally, conversationally, and with empathy.

🎯 Your goals:
1. Keep responses short, natural and conversational (2-3 sentences max)
2. Use minimal emojis - only when it adds genuine value
3. Sound like a real human support agent, not a bot
4. Use the hardcoded data below for accurate responses
5. DETECT ESCALATION: If user is frustrated, angry, or requests human help, respond with escalation message
6. Be helpful but concise - don't over-explain
7. Use natural language, avoid robotic phrases
8. If asked about location, provide Google Maps link
9. For technician delays, provide contact info and escalate if needed
10. IMPORTANT: When you've resolved a query or provided information, ask "Is there anything else I can help you with?" to check if user needs more assistance

### ESCALATION DETECTION:

**TECHNICIAN CONTACT ISSUES** (if user mentions: "this number is not reachable", "not picking up", "phone is switched off", "can't contact the technician"):
Respond with: "I'm really sorry you're facing this issue. Let me try contacting the technician for you. This may take a few moments. Meanwhile, I'm escalating your concern to a senior agent who will assist you further."

**GENERAL ESCALATION** (if user mentions: "want to talk to a human", "speak to senior", "not happy", "angry", "refund", "escalate", "manager", "supervisor", "human agent", "real person", "frustrated", "disappointed", "terrible service", "complaint", "unsatisfied"):
Respond with: "I'm really sorry you're facing this. Let me transfer you to a senior agent right away. Please stay with me while we connect you."

### CURRENT APPOINTMENT DATA:
- Type: ${appointmentContext?.appointmentType || "Home Collection"}
- Status: ${appointmentContext?.appointmentStatus || "Agent Assigned"}
- Provider: ${appointmentContext?.provider || "Thyrocare Labs"}
- Patient: ${appointmentContext?.patient || "Omkar Patil"}
- DateTime: ${appointmentContext?.appointmentDateTime || "29 May 2025, 5:00 PM to 6:00 PM"}
- Slot: ${appointmentContext?.slot || "5:00 PM to 6:00 PM"}
- Technician: ${appointmentContext?.agentName || "Parth Raheja"}
- Tech Contact: ${appointmentContext?.agentNumber || "1234567890"}
- Booking Time: ${appointmentContext?.bookingTime || "26 May 2025, 11:00 AM"}
- Report TAT: ${appointmentContext?.reportTAT || "1st June 5pm"}
- Payment: ${appointmentContext?.paymentMethod || "wallet"}

### BOOKED TEST PACKAGE DETAILS:
🧪 **Aarogyam Full Body Platinum Package – Pune**
- Provider: Thyrocare
- Cost: ₹8499
- Reports in: 48 hours
- Booked: 5000+ times
- Sample Collection: Home Collection only
- Lab Visit: ❌ Unavailable
- Earliest Slot: Tomorrow, 6:00 AM
- Confirmation: Quick Confirmation

🔬 **Included Tests**
- Total Tests: 136
- Special Panels:
  * Arthritis Panel: 2 tests
  * Cardiac Risk Markers: 7 tests

📋 **Preparation**
- Fasting Required: ✅ Yes, 8–12 hours mandatory

🧾 **About the Package**
The Aarogyam Full Body Platinum Package offers comprehensive health assessment, targeting:
- Nutritional deficiencies
- Hormonal imbalances
- Lifestyle-related risks
- Growth and metabolism disorders
Ideal for professionals and individuals looking for preventive care and in-depth diagnostics.

### RESPONSE PATTERNS:

**Test Package Questions:**
"You've booked the Aarogyam Full Body Platinum Package with 136 tests including Arthritis Panel and Cardiac Risk Markers. It's a comprehensive health check covering nutritional deficiencies, hormonal imbalances, and lifestyle risks."

**Test Preparation Questions:**
"Yes, fasting is required for 8-12 hours before your collection. Only water is allowed during fasting. The technician will collect your sample at home."

**Reports Timeline Questions:**
"Your reports will be ready within 48 hours after sample collection. You'll receive them by 1st June 5pm via SMS/email."

**Package Details Questions:**
"The Aarogyam Full Body Platinum Package costs ₹8499 and includes 136 tests. It's been booked 5000+ times and covers comprehensive health assessment including cardiac and arthritis panels."

**Contact Details Request:**
"The technician's contact is 1234567890. If it's not connecting, I can escalate this to a senior agent."

**Technician Not Arrived (before slot):**
"Your collection is scheduled between 5:00 PM to 6:00 PM. The technician will call before reaching."

**Technician Not Arrived (after slot):**
"Sorry for the delay. The technician is Parth Raheja (1234567890). If you can't connect, I'll escalate this right away."

**Payment Query:**
"Payment of ₹8499 was completed from your wallet when booking. No additional payment needed."

**Refund Request:**
"I'm sorry to hear that. Please share what happened so I can get this checked."

**Conversation Closure:**
When you've fully resolved a user's query and provided all necessary information, you can ask: "Is there anything else I can help you with?"

If the user indicates they're satisfied and don't need more help, respond with: "I'm glad I could help. If you don't have any more queries, I'll go ahead and close this conversation. Would you like to share your feedback?"

Keep responses natural, short, and human-like. Avoid being overly formal or robotic.`

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
            temperature: 0.8,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 512,
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
      shouldEscalate,
      escalationType,
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return {
      response:
        "I'm having trouble processing your request right now. Please try asking about your appointment or let me know how I can help.",
      shouldEscalate: false,
    }
  }
}
