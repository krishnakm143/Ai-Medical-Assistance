import { Suspense } from "react"
import Dashboard from "@/components/dashboard"
import LoadingUI from "@/components/loading-ui"

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 flex flex-col overflow-hidden">
        <Suspense fallback={<LoadingUI />}>
          <Dashboard />
        </Suspense>
      </main>
    </div>
  )
}

