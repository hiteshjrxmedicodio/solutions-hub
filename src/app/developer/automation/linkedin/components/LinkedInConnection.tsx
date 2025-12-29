"use client";

import { useEffect, useState } from "react";

interface LinkedInConnectionProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function LinkedInConnection({ onConnectionChange }: LinkedInConnectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const checkConnection = async () => {
    try {
      const response = await fetch("/api/automation/linkedin/status");
      const data = await response.json();
      if (data.success) {
        setIsConnected(data.connected);
        onConnectionChange?.(data.connected);
      }
    } catch (error) {
      console.error("Error checking LinkedIn connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check for connection success in URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'true') {
      // Refresh connection status after successful connection
      setTimeout(() => {
        checkConnection();
      }, 1000);
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch("/api/automation/linkedin/auth");
      const data = await response.json();
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert("Failed to initiate LinkedIn connection");
        setIsConnecting(false);
      }
    } catch (error) {
      console.error("Error connecting to LinkedIn:", error);
      alert("Failed to connect to LinkedIn");
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="animate-pulse bg-zinc-200 h-4 w-32 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-zinc-100'}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-zinc-400'}`}
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              LinkedIn Account
            </h3>
            <p className="text-xs text-zinc-500">
              {isConnected ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>
        {!isConnected && (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isConnecting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Connect
              </>
            )}
          </button>
        )}
        {isConnected && (
          <div className="flex items-center gap-2 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-sm font-medium">Connected</span>
          </div>
        )}
      </div>
    </div>
  );
}

