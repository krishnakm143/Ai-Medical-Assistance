import { Suspense } from "react"
import ChatInterface from "@/components/chat-interface"
import DashboardSidebar from "@/components/dashboard-sidebar"
import LoadingUI from "@/components/loading-ui"

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Suspense fallback={<LoadingUI />}>
          <ChatInterface />
        </Suspense>
      </main>
    </div>
  )
}

