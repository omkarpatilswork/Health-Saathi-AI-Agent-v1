import type { QueryCategory } from "@/context/chat-context"

// Simple AI response generator based on user input and category
export function getAIResponse(userMessage: string, category: QueryCategory): string {
  const lowerCaseMessage = userMessage.toLowerCase()

  // Generic responses
  if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
    return "Hello! How can I assist you with your health query today?"
  }

  if (lowerCaseMessage.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with?"
  }

  // Category-specific responses
  if (category === "appointment") {
    if (lowerCaseMessage.includes("reschedule")) {
      return "To reschedule your appointment, please provide your preferred date and time, and I'll check availability at Ruby Hall Labs, Pune."
    }

    if (lowerCaseMessage.includes("cancel")) {
      return "I can help you cancel your appointment. Please note that cancellations made less than 24 hours before the scheduled time may incur a fee. Would you like to proceed with cancellation?"
    }

    if (lowerCaseMessage.includes("document") || lowerCaseMessage.includes("bring")) {
      return "For your lab visit, please bring your ID proof, doctor's prescription (if any), insurance card (if applicable), and any previous test reports if they're relevant to your current tests."
    }

    return "I see you have a question about your appointment at Ruby Hall Labs, Pune. Could you please provide more details about your specific concern?"
  }

  if (category === "lab") {
    if (lowerCaseMessage.includes("prepare") || lowerCaseMessage.includes("preparation")) {
      return "For most lab tests, you'll need to fast for 8-12 hours before the test. Avoid alcohol for 24 hours and strenuous exercise for 12 hours before the test. Please drink plenty of water unless specifically instructed otherwise."
    }

    if (lowerCaseMessage.includes("result")) {
      return "Your test results will typically be available within 24-48 hours after your lab visit. You'll receive a notification when they're ready, and you can view them in your Health Saathi app or patient portal."
    }

    if (lowerCaseMessage.includes("report") || lowerCaseMessage.includes("understand")) {
      return "Your test report will include your results along with reference ranges. Values outside these ranges will be highlighted. If you need help interpreting your results, you can schedule a follow-up with your doctor or use our 'Ask a Doctor' feature in the app."
    }

    return "I understand you have a question about your lab test. Could you please specify what aspect of the test you need help with? (preparation, results, interpretation, etc.)"
  }

  if (category === "payment") {
    if (lowerCaseMessage.includes("payment") || lowerCaseMessage.includes("pay")) {
      return "We accept various payment methods including credit/debit cards, net banking, UPI, and cash. You can pay at the lab during your visit or use the payment option in the Health Saathi app before your appointment."
    }

    if (lowerCaseMessage.includes("insurance")) {
      return "We accept most major insurance providers. To confirm if your specific insurance is accepted, please provide your insurance provider's name, and I can check for you."
    }

    if (lowerCaseMessage.includes("receipt") || lowerCaseMessage.includes("invoice")) {
      return "Yes, you will receive a digital receipt via email after your payment is processed. You can also download it from the 'Billing' section in your Health Saathi app or request a physical copy at the lab."
    }

    return "I understand you have a payment or billing related question. Could you please provide more specific details about your query?"
  }

  // Default response if no specific match is found
  return "I understand your concern. Based on your appointment details, our lab technicians at Ruby Hall Labs, Pune will be able to assist you during your visit. Is there anything specific you'd like to know before your appointment?"
}
