interface ErrorStateProps {
  error: string | null;
  onClose: () => void;
}

export function ErrorState({ error, onClose }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-red-600 mb-4">Error: {error || "Listing not found"}</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

