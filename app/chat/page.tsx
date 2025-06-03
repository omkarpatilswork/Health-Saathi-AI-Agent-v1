import { AppProvider } from "@/context/app-context"
import { ChatProvider } from "@/context/chat-context"
import ChatInterface from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <AppProvider>
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    </AppProvider>
  )
}
