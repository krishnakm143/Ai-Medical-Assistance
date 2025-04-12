export default function LoadingUI() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background animated-grid-bg">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse"></div>
        <h2 className="mt-4 text-xl font-semibold gradient-text">Loading...</h2>
        <p className="mt-2 text-white/70">Preparing your health dashboard</p>
      </div>
    </div>
  )
}

