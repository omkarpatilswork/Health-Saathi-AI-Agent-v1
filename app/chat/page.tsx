import { AppProvider } from "@/context/app-context"
import { ChatProvider } from "@/context/chat-context"
import ChatInterface from "@/components/chat-interface"

// Force dynamic rendering to prevent prerendering issues with useSearchParams
export const dynamic = "force-dynamic"

export default function ChatPage() {
  return (
    <AppProvider>
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    </AppProvider>
  )
}
