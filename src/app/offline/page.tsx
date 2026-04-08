"use client";

import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <WifiOff size={36} className="text-text-4" />
        </div>
        <h1 className="text-2xl font-bold text-text-1 mb-2">You&apos;re Offline</h1>
        <p className="text-text-3 mb-6">
          It looks like you&apos;ve lost your internet connection. Please check your network and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
}
