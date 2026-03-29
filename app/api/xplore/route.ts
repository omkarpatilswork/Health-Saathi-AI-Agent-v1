import { type NextRequest, NextResponse } from "next/server"
import {
  searchByPincode,
  searchByLab,
  searchByLabAndPincode,
  findPackageWithInclusions,
  isGMCMapped,
  isGMCPackageAtCentre,
  findDuplicatePackages,
  getAllLabs,
  getPackageStats,
} from "@/utils/projectXBot"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("Received Xplore message:", message)

    // Process query and generate response
    const response = await processProjectXQuery(message, conversationHistory)

    return NextResponse.json({
      response: response,
      source: "projectx",
    })
  } catch (error) {
    console.error("Xplore API error:", error)

    return NextResponse.json({
      response: `🔍 **Healthcare Catalogue Assistant**

I'm experiencing some technical difficulties right now, but I'm still here to help you with:
- 📍 Search labs by pincode
- 🏥 Find packages by lab name  
- 🧪 Search tests and inclusions
- 🔗 Check GMC mappings
- 📊 Find duplicate packages

Please try asking about any of these topics.`,
      source: "fallback",
    })
  }
}

async function processProjectXQuery(prompt: string, conversationHistory: any[]): Promise<string> {
  const lowerPrompt = prompt.toLowerCase()

  // Determine query type and extract parameters
  const queryResult = analyzeQuery(prompt)

  if (!queryResult.type) {
    return generateWelcomeMessage()
  }

  // Execute the appropriate function based on query type
  let result
  try {
    switch (queryResult.type) {
      case "searchByPincode":
        result = searchByPincode(queryResult.params.pincode)
        return formatPincodeResults(result, queryResult.params.pincode)

      case "searchByLab":
        result = searchByLab(queryResult.params.labName)
        return formatLabResults(result, queryResult.params.labName)

      case "searchByLabAndPincode":
        result = searchByLabAndPincode(queryResult.params.labName, queryResult.params.pincode)
        return formatLabPincodeResults(result, queryResult.params.labName, queryResult.params.pincode)

      case "findPackageWithInclusions":
        result = findPackageWithInclusions(queryResult.params.inclusions)
        return formatInclusionResults(result, queryResult.params.inclusions)

      case "isGMCMapped":
        result = isGMCMapped(queryResult.params.labName)
        return formatGMCResults(result, queryResult.params.labName)

      case "isGMCPackageAtCentre":
        result = isGMCPackageAtCentre(queryResult.params.labName, queryResult.params.packageName)
        return formatGMCPackageResults(result, queryResult.params.labName, queryResult.params.packageName)

      case "findDuplicatePackages":
        result = findDuplicatePackages(queryResult.params.packageName)
        return formatDuplicateResults(result, queryResult.params.packageName)

      case "getAllLabs":
        result = getAllLabs()
        return formatAllLabsResults(result)

      case "getStats":
        result = getPackageStats()
        return formatStatsResults(result)

      default:
        return generateHelpMessage()
    }
  } catch (error) {
    console.error("Error processing query:", error)
    return "❌ Sorry, I encountered an error processing your request. Please try again or rephrase your question."
  }
}

// Analyze user query to determine type and extract parameters
function analyzeQuery(prompt: string) {
  const lowerPrompt = prompt.toLowerCase()

  // Extract pincode
  const pincodeMatch = prompt.match(/\b(\d{6})\b/)
  const pincode = pincodeMatch ? pincodeMatch[1] : null

  // Extract lab names
  const labNames = ["thyrocare", "lal path", "ruby hall", "healthians"]
  let labName = null
  for (const name of labNames) {
    if (lowerPrompt.includes(name)) {
      labName = name
      break
    }
  }

  // Extract test inclusions
  const testNames = ["cbc", "lipid", "lft", "kft", "thyroid", "ecg", "vitamin d", "vitamin b12", "hba1c", "sugar"]
  const inclusions = testNames.filter((test) => lowerPrompt.includes(test))

  // Extract package names
  const packageMatch = prompt.match(/(?:package|checkup)\s+["']?([^"']+)["']?/i)
  const packageName = packageMatch ? packageMatch[1] : null

  // Determine query type based on content
  if (lowerPrompt.includes("stats") || lowerPrompt.includes("statistics")) {
    return { type: "getStats", params: {} }
  }

  if (lowerPrompt.includes("all labs") || lowerPrompt.includes("list labs")) {
    return { type: "getAllLabs", params: {} }
  }

  if (lowerPrompt.includes("duplicate") || lowerPrompt.includes("replica")) {
    if (packageName || lowerPrompt.includes("full body") || lowerPrompt.includes("checkup")) {
      return {
        type: "findDuplicatePackages",
        params: { packageName: packageName || "full body checkup" },
      }
    }
  }

  if (lowerPrompt.includes("gmc")) {
    if (lowerPrompt.includes("package") && labName && packageName) {
      return {
        type: "isGMCPackageAtCentre",
        params: { labName, packageName },
      }
    } else if (labName) {
      return {
        type: "isGMCMapped",
        params: { labName },
      }
    }
  }

  if (inclusions.length > 0) {
    return {
      type: "findPackageWithInclusions",
      params: { inclusions },
    }
  }

  if (labName && pincode) {
    return {
      type: "searchByLabAndPincode",
      params: { labName, pincode },
    }
  }

  if (pincode) {
    return {
      type: "searchByPincode",
      params: { pincode },
    }
  }

  if (labName) {
    return {
      type: "searchByLab",
      params: { labName },
    }
  }

  return { type: null, params: {} }
}

// Formatting functions for different result types
function formatPincodeResults(result: any, pincode: string): string {
  if (!result.success || result.count === 0) {
    return `❌ **No labs found in pincode ${pincode}**

Please check the pincode or try a nearby area.`
  }

  let response = `📍 **Labs Available in Pincode ${pincode}**\n\n`

  result.data.forEach((lab: any) => {
    response += `🏥 **${lab.labName}**\n`
    response += `📍 ${lab.address}\n`
    response += `⭐ ${lab.rating} (${lab.reviews}+ reviews)\n`
    response += `📞 ${lab.contact}\n`
    response += `🏠 Home Collection: ${lab.homeCollection ? "✅ Available" : "❌ Not Available"}\n`
    response += `📦 Packages: ${lab.packages.length}\n\n`
  })

  return response + "Would you like details about packages at any specific lab?"
}

function formatLabResults(result: any, labName: string): string {
  if (!result.success || result.count === 0) {
    return `❌ **No labs found matching "${labName}"**

Please check the lab name or try a different spelling.`
  }

  let response = `🏥 **${labName} Lab Details**\n\n`

  result.data.forEach((lab: any) => {
    response += `**${lab.labName}** - ${lab.address}\n`
    response += `⭐ ${lab.rating} (${lab.reviews}+ reviews) | 📞 ${lab.contact}\n`
    response += `🏠 Home Collection: ${lab.homeCollection ? "✅" : "❌"}\n\n`

    response += `📦 **Available Packages:**\n`
    lab.packages.forEach((pkg: any) => {
      response += `• **${pkg.name}** - ₹${pkg.price}\n`
      response += `  Tests: ${pkg.inclusions.join(", ")}\n`
      response += `  TAT: ${pkg.tat} | GMC: ${pkg.isGMC ? "✅" : "❌"}\n\n`
    })
  })

  return response
}

function formatLabPincodeResults(result: any, labName: string, pincode: string): string {
  if (!result.success || result.count === 0) {
    return `❌ **No ${labName} labs found in pincode ${pincode}**

Try checking nearby pincodes or different lab names.`
  }

  return formatLabResults(result, `${labName} in ${pincode}`)
}

function formatInclusionResults(result: any, inclusions: string[]): string {
  if (!result.success || result.count === 0) {
    return `❌ **No packages found with tests: ${inclusions.join(", ")}**

Try searching with different test names or fewer inclusions.`
  }

  let response = `🧪 **Packages with Tests: ${inclusions.join(", ")}**\n\n`

  result.data.forEach((item: any) => {
    response += `📦 **${item.package}** at **${item.lab}**\n`
    response += `📍 ${item.address} (${item.pincode})\n`
    response += `💰 ₹${item.price} | ⏱️ ${item.tat}\n`
    response += `🏠 Home Collection: ${item.homeCollection ? "✅" : "❌"} | GMC: ${item.isGMC ? "✅" : "❌"}\n`
    response += `🧪 All Tests: ${item.inclusions.join(", ")}\n\n`
  })

  return response
}

function formatGMCResults(result: any, labName: string): string {
  if (!result.success) {
    return `❌ **Lab "${labName}" not found**

Please check the lab name spelling.`
  }

  let response = `🔗 **GMC Mapping Status for ${labName}**\n\n`

  result.data.forEach((lab: any) => {
    response += `🏥 **${lab.lab}** - ${lab.address} (${lab.pincode})\n`
    response += `GMC Status: ${lab.isGMCMapped ? "✅ Mapped" : "❌ Not Mapped"}\n`
    response += `GMC Packages: ${lab.gmcPackageCount}/${lab.totalPackages}\n`

    if (lab.gmcPackages.length > 0) {
      response += `GMC Package Names: ${lab.gmcPackages.join(", ")}\n`
    }
    response += `\n`
  })

  return response
}

function formatGMCPackageResults(result: any, labName: string, packageName: string): string {
  if (!result.success) {
    return `❌ **Lab "${labName}" not found**

Please check the lab name spelling.`
  }

  if (result.count === 0) {
    return `❌ **Package "${packageName}" not found at ${labName}**

Please check the package name or try a different lab.`
  }

  let response = `🔗 **GMC Package Status: "${packageName}" at ${labName}**\n\n`

  result.data.forEach((item: any) => {
    response += `📦 **${item.package}** at **${item.lab}** (${item.pincode})\n`
    response += `GMC Status: ${item.isGMC ? "✅ GMC Mapped" : "❌ Not GMC Mapped"}\n`
    response += `💰 Price: ₹${item.price}\n`
    response += `🧪 Inclusions: ${item.inclusions.join(", ")}\n\n`
  })

  return response
}

function formatDuplicateResults(result: any, packageName: string): string {
  if (!result.success || result.count === 0) {
    return `❌ **No packages found matching "${packageName}"**

Try searching with a different package name.`
  }

  let response = `🔍 **Duplicate/Similar Packages for "${packageName}"**\n`
  response += `Found ${result.count} packages across ${result.duplicateGroups} similar names\n\n`

  // Group similar packages for better comparison
  Object.entries(result.grouped).forEach(([packageType, packages]: [string, any]) => {
    if (packages.length > 1) {
      response += `📦 **${packages[0].package}** (${packages.length} locations)\n\n`

      response += `| Lab | Location | Price | GMC | Home Collection |\n`
      response += `|-----|----------|-------|-----|----------------|\n`

      packages.forEach((pkg: any) => {
        response += `| ${pkg.lab} | ${pkg.pincode} | ₹${pkg.price} | ${pkg.isGMC ? "✅" : "❌"} | ${pkg.homeCollection ? "✅" : "❌"} |\n`
      })
      response += `\n`
    }
  })

  return response
}

function formatAllLabsResults(result: any): string {
  let response = `🏥 **All Available Labs**\n\n`

  result.data.forEach((lab: any) => {
    response += `**${lab.labName}** - ${lab.address} (${lab.pincode})\n`
    response += `⭐ ${lab.rating} (${lab.reviews}+ reviews)\n`
    response += `📦 ${lab.packageCount} packages (${lab.gmcPackages} GMC mapped)\n`
    response += `🏠 Home Collection: ${lab.homeCollection ? "✅" : "❌"}\n\n`
  })

  return response
}

function formatStatsResults(result: any): string {
  const stats = result.data
  return `📊 **Healthcare Catalogue Statistics**

**Package Overview:**
• Total Packages: ${stats.totalPackages}
• GMC Mapped: ${stats.gmcPackages} (${stats.gmcPercentage}%)
• Non-GMC: ${stats.nonGmcPackages}

**Price Range:**
• Minimum: ₹${stats.priceRange.min}
• Maximum: ₹${stats.priceRange.max}

**Network:**
• Total Lab Locations: ${stats.totalLabs}

This data helps you understand our catalogue coverage and GMC mapping status.`
}

function generateWelcomeMessage(): string {
  return `👋 **Hi! I'm Project X — your AI assistant**

I can help you with catalogue availability, GMC mappings, and duplicate packages. Here's what I can do:

**🔍 Search Options:**
• Search labs by pincode
• Find packages by lab name
• Search by specific tests/inclusions
• Check GMC mapping status
• Find duplicate packages

**💡 Try asking:**
• "Show me labs in pincode 411014"
• "Which packages at Thyrocare include CBC and Lipid?"
• "Is Lal Path Labs GMC mapped?"
• "Find duplicate Full Body Checkup packages"

What would you like to explore?`
}

function generateHelpMessage(): string {
  return `ℹ️ **I can help you with:**

**1️⃣ Search by Pincode**
Example: "Labs in 411014"

**2️⃣ Search by Lab**
Example: "Thyrocare packages"

**3️⃣ Search by Tests**
Example: "Packages with CBC and Lipid"

**4️⃣ GMC Mapping**
Example: "Is Ruby Hall GMC mapped?"

**5️⃣ Duplicate Packages**
Example: "Find duplicate Full Body Checkup"

**6️⃣ Statistics**
Example: "Show catalogue stats"

Please try one of these query types!`
}
