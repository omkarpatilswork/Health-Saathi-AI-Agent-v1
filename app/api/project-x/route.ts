import { type NextRequest, NextResponse } from "next/server"
import { getLabsInPincodeForProduct, getTestsInProductAtProvider, comparePackagesWithTest } from "@/utils/gmcNetworks"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("Received Project X message:", message)

    // Process query with conversational intelligence
    const response = await processConversationalQuery(message, conversationHistory)

    return NextResponse.json({
      response: response,
      source: "project-x",
    })
  } catch (error) {
    console.error("Project X API error:", error)

    return NextResponse.json({
      response: `🔧 **Project X Assistant**

I'm experiencing some technical difficulties right now, but I'm here to help you with:
- 🏥 Finding labs by pincode and product
- 🧪 Listing tests available in products
- 📊 Comparing packages between providers

Please try asking about any of these topics.`,
      source: "fallback",
    })
  }
}

async function processConversationalQuery(prompt: string, conversationHistory: any[]): Promise<string> {
  // Analyze the query to understand intent and extract parameters
  const queryAnalysis = analyzeConversationalQuery(prompt, conversationHistory)

  // Handle different conversation states
  switch (queryAnalysis.state) {
    case "greeting":
      return generateGreeting()

    case "incomplete_query":
      return handleIncompleteQuery(queryAnalysis)

    case "complete_query":
      return executeCompleteQuery(queryAnalysis)

    case "clarification_needed":
      return askForClarification(queryAnalysis)

    case "help_request":
      return generateHelpMessage()

    default:
      return generateDefaultResponse()
  }
}

function analyzeConversationalQuery(prompt: string, conversationHistory: any[]) {
  const lowerPrompt = prompt.toLowerCase()

  // Check for greeting
  if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi") || lowerPrompt.includes("hey")) {
    return { state: "greeting" }
  }

  // Check for help request
  if (lowerPrompt.includes("help") || lowerPrompt.includes("what can you do")) {
    return { state: "help_request" }
  }

  // Extract parameters
  const params = extractParameters(prompt)

  // Determine query type based on content
  let queryType = null
  if (lowerPrompt.includes("labs") && (lowerPrompt.includes("available") || lowerPrompt.includes("in"))) {
    queryType = "labs_in_pincode_for_product"
  } else if (lowerPrompt.includes("tests") && lowerPrompt.includes("available")) {
    queryType = "tests_in_product_at_provider"
  } else if (lowerPrompt.includes("compare")) {
    queryType = "compare_packages"
  }

  // Check if we have enough parameters for the query type
  const missingParams = getMissingParameters(queryType, params)

  if (queryType && missingParams.length === 0) {
    return {
      state: "complete_query",
      queryType: queryType,
      params: params,
    }
  } else if (queryType && missingParams.length > 0) {
    return {
      state: "incomplete_query",
      queryType: queryType,
      params: params,
      missingParams: missingParams,
    }
  } else {
    return {
      state: "clarification_needed",
      params: params,
    }
  }
}

function extractParameters(prompt: string) {
  const params = {}

  // Extract pincode
  const pincodeMatch = prompt.match(/\b(\d{6})\b/)
  if (pincodeMatch) {
    params.pincode = pincodeMatch[1]
  }

  // Extract product codes
  const productCodes = ["BALIC01", "TRAVIS07", "WELLNESS03"]
  for (const code of productCodes) {
    if (prompt.toUpperCase().includes(code)) {
      params.product = code
      break
    }
  }

  // Extract provider names
  const providerNames = ["thyrocare", "lal path", "healthians", "ruby hall"]
  const foundProviders = []
  for (const name of providerNames) {
    if (prompt.toLowerCase().includes(name)) {
      foundProviders.push(name)
    }
  }
  if (foundProviders.length >= 1) params.provider1 = foundProviders[0]
  if (foundProviders.length >= 2) params.provider2 = foundProviders[1]

  // Extract test names
  const testNames = ["cbc", "lipid", "lft", "kft", "ecg", "vitamin", "sugar", "urine", "thyroid"]
  for (const test of testNames) {
    if (prompt.toLowerCase().includes(test)) {
      params.testName = test
      break
    }
  }

  return params
}

function getMissingParameters(queryType: string, params: any): string[] {
  const missing = []

  switch (queryType) {
    case "labs_in_pincode_for_product":
      if (!params.pincode) missing.push("pincode")
      if (!params.product) missing.push("product")
      break

    case "tests_in_product_at_provider":
      if (!params.product) missing.push("product")
      if (!params.provider1) missing.push("provider")
      if (!params.pincode) missing.push("pincode")
      break

    case "compare_packages":
      if (!params.testName) missing.push("test name")
      if (!params.provider1) missing.push("first provider")
      if (!params.provider2) missing.push("second provider")
      break
  }

  return missing
}

function generateGreeting(): string {
  return `👋 **Hi! I'm Project X — your AI assistant**

I help product managers, operations teams, and agents query provider and catalogue data.

**I can help you with:**
• 🏥 Find labs available in a pincode for specific products
• 🧪 List tests available in products at specific providers
• 📊 Compare packages between different providers

**Just ask me naturally, like:**
• "Which labs are available in 411014 for BALIC01?"
• "What tests are included in TRAVIS07 at Thyrocare?"
• "Compare CBC packages between Thyrocare and Healthians"

What would you like to know?`
}

function handleIncompleteQuery(analysis: any): string {
  const { queryType, missingParams } = analysis

  let response = "ℹ️ I understand you want to "

  switch (queryType) {
    case "labs_in_pincode_for_product":
      response += "find labs by pincode and product. "
      break
    case "tests_in_product_at_provider":
      response += "see what tests are available. "
      break
    case "compare_packages":
      response += "compare packages between providers. "
      break
  }

  response += `To help you, I need the following details:\n\n`

  missingParams.forEach((param) => {
    switch (param) {
      case "pincode":
        response += `• **Pincode** (e.g., 411014, 411001, 411045)\n`
        break
      case "product":
        response += `• **Product code** (BALIC01, TRAVIS07, or WELLNESS03)\n`
        break
      case "provider":
        response += `• **Provider name** (e.g., Thyrocare, Lal Path Labs, Healthians)\n`
        break
      case "first provider":
        response += `• **First provider name** for comparison\n`
        break
      case "second provider":
        response += `• **Second provider name** for comparison\n`
        break
      case "test name":
        response += `• **Test name** (e.g., CBC, Lipid Profile, ECG)\n`
        break
    }
  })

  response += `\nCould you please provide these details?`

  return response
}

function executeCompleteQuery(analysis: any): string {
  const { queryType, params } = analysis

  try {
    switch (queryType) {
      case "labs_in_pincode_for_product":
        return formatLabsResults(getLabsInPincodeForProduct(params.pincode, params.product))

      case "tests_in_product_at_provider":
        return formatTestsResults(getTestsInProductAtProvider(params.product, params.provider1, params.pincode))

      case "compare_packages":
        return formatComparisonResults(
          comparePackagesWithTest(params.testName, params.provider1, params.provider2, params.pincode),
        )

      default:
        return "❌ Sorry, I couldn't process that query type."
    }
  } catch (error) {
    console.error("Error executing query:", error)
    return "❌ Sorry, I encountered an error processing your request. Please try again."
  }
}

function askForClarification(analysis: any): string {
  return `ℹ️ I'd be happy to help! Could you clarify what you'd like to know?

**I can help with:**
• **Finding labs**: "Which labs are available in [pincode] for [product]?"
• **Listing tests**: "What tests are available in [product] at [provider] in [pincode]?"
• **Comparing packages**: "Compare [test] packages between [provider1] and [provider2]"

**Available products:** BALIC01, TRAVIS07, WELLNESS03
**Available providers:** Thyrocare, Lal Path Labs, Healthians, Ruby Hall Labs
**Available pincodes:** 411014, 411001, 411045

What would you like to explore?`
}

function formatLabsResults(result: any): string {
  if (!result.success || result.count === 0) {
    return `❌ **No labs found in pincode ${result.query.pincode} for product ${result.query.product}**

Please verify:
• Pincode is correct (411014, 411001, 411045)
• Product code is valid (BALIC01, TRAVIS07, WELLNESS03)`
  }

  let response = `✅ **Labs available in pincode ${result.query.pincode} for product ${result.query.product}:**\n\n`

  result.data.forEach((lab: any) => {
    response += `🏥 **${lab.providerName}**\n`
    response += `📍 ${lab.address}\n`
    response += `📞 ${lab.contact}\n`
    response += `📦 ${lab.packagesCount} packages available\n\n`
  })

  return response + "Would you like to see the specific tests available at any of these labs?"
}

function formatTestsResults(result: any): string {
  if (!result.success) {
    return `❌ **Provider not found**

Could not find ${result.query.providerName} in pincode ${result.query.pincode}. Please check:
• Provider name spelling
• Pincode is correct`
  }

  if (result.count === 0) {
    return `❌ **No tests found**

No packages available for product ${result.query.product} at ${result.query.providerName} in ${result.query.pincode}.`
  }

  let response = `✅ **Tests available in ${result.data.product} at ${result.data.provider}, ${result.data.pincode}:**\n\n`

  // List all unique tests
  response += `**All Tests Available:**\n`
  result.data.allTests.forEach((test: string) => {
    response += `• ${test}\n`
  })

  response += `\n**Package Details:**\n`
  result.data.packages.forEach((pkg: any) => {
    response += `📦 **${pkg.packageName}** - ₹${pkg.price} (${pkg.tat})\n`
    response += `   Tests: ${pkg.testsIncluded.join(", ")}\n\n`
  })

  return response
}

function formatComparisonResults(result: any): string {
  if (!result.success) {
    return `❌ **Comparison failed**

Please check the provider names and try again.`
  }

  const { provider1, provider2, testName } = result.data

  if (provider1.packages.length === 0 && provider2.packages.length === 0) {
    return `❌ **No packages found with test "${testName}"**

Neither ${provider1.name} nor ${provider2.name} has packages containing this test.`
  }

  let response = `📊 **Comparison of ${testName} packages**\n\n`

  // Create comparison table
  response += `| Feature | ${provider1.name} | ${provider2.name} |\n`
  response += `|---------|${"-".repeat(provider1.name.length)}|${"-".repeat(provider2.name.length)}|\n`

  // Get first package from each provider for comparison
  const pkg1 = provider1.packages[0] || {}
  const pkg2 = provider2.packages[0] || {}

  response += `| Package Name | ${pkg1.packageName || "N/A"} | ${pkg2.packageName || "N/A"} |\n`
  response += `| Price | ₹${pkg1.price || "N/A"} | ₹${pkg2.price || "N/A"} |\n`
  response += `| TAT | ${pkg1.tat || "N/A"} | ${pkg2.tat || "N/A"} |\n`
  response += `| Tests Included | ${pkg1.testsIncluded?.join(", ") || "N/A"} | ${pkg2.testsIncluded?.join(", ") || "N/A"} |\n`
  response += `| Available In | ${pkg1.availableInProducts?.join(", ") || "N/A"} | ${pkg2.availableInProducts?.join(", ") || "N/A"} |\n`

  // Add location info if available
  if (pkg1.address || pkg2.address) {
    response += `| Location | ${pkg1.address || "N/A"} | ${pkg2.address || "N/A"} |\n`
  }

  return response
}

function generateHelpMessage(): string {
  return `🔧 **Project X Help Guide**

**I can help you with 3 types of queries:**

**1️⃣ Find Labs by Location & Product**
• Example: "Which labs are available in 411014 for BALIC01?"
• Required: Pincode + Product code

**2️⃣ List Tests in Product at Provider**
• Example: "What tests are available in TRAVIS07 at Thyrocare 411014?"
• Required: Product code + Provider name + Pincode

**3️⃣ Compare Packages Between Providers**
• Example: "Compare CBC packages between Thyrocare and Healthians"
• Required: Test name + Two provider names

**Available Data:**
• **Products**: BALIC01, TRAVIS07, WELLNESS03
• **Providers**: Thyrocare, Lal Path Labs, Healthians, Ruby Hall Labs
• **Pincodes**: 411014, 411001, 411045

Just ask naturally - I'll guide you if I need more details!`
}

function generateDefaultResponse(): string {
  return `ℹ️ **I'm here to help with provider and catalogue queries!**

**Try asking me:**
• "Labs in 411014 for BALIC01"
• "Tests in TRAVIS07 at Thyrocare"
• "Compare CBC between Thyrocare and Healthians"

Or just say "help" to see all my capabilities!`
}
