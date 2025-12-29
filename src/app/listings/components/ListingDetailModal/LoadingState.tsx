export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto mb-4"></div>
        <p className="text-zinc-600">Loading listing...</p>
      </div>
    </div>
  );
}

