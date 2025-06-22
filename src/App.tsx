import React, { useState } from "react";
import { Clock, History } from "lucide-react";
import { TimeSession } from "./types";
import Dashboard from "./components/Dashboard";
import PastSessions from "./components/PastSessions";

function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "history">(
    "dashboard"
  );
  const [sessions, setSessions] = useState<TimeSession[]>([
    // Add some dummy data for demonstration
    {
      id: "1",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      clockIn: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000
      ).toISOString(),
      clockOut: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      ).toISOString(),
      totalMinutes: 480,
      idleMinutes: 45,
      productiveHours: 7.25,
      screenshots: Array.from(
        { length: 12 },
        (_, i) => `https://picsum.photos/400/300?random=${i + 100}`
      ),
      status: "submitted",
      approvalStatus: "approved",
      lessHoursComment: "Had a doctor appointment in the afternoon",
      approvalComment: "Thanks for letting us know. Hope everything is okay!",
      approvedBy: "Sarah Johnson",
      approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      clockIn: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000 + 8.5 * 60 * 60 * 1000
      ).toISOString(),
      clockOut: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000 + 17.5 * 60 * 60 * 1000
      ).toISOString(),
      totalMinutes: 540,
      idleMinutes: 30,
      productiveHours: 8.5,
      screenshots: Array.from(
        { length: 18 },
        (_, i) => `https://picsum.photos/400/300?random=${i + 200}`
      ),
      status: "submitted",
      approvalStatus: "pending",
    },
  ]);

  const handleSessionSubmit = (session: TimeSession) => {
    setSessions((prev) => [...prev, session]);
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Clock },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  TimeTracker Pro
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Smart productivity tracking
                </p>
              </div>
            </div>
            
            {/* Header Stats */}
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-6">
        {activeTab === "dashboard" ? (
          <Dashboard onSessionSubmit={handleSessionSubmit} />
        ) : (
          <PastSessions sessions={sessions} />
        )}
      </div>

      {/* Modern Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        <div className="max-w-md mx-auto px-6 py-3">
          <div className="flex bg-gray-100 rounded-2xl p-1 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "dashboard" | "history")
                  }
                  className={`flex-1 relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-lg shadow-blue-500/20 scale-105"
                      : "text-gray-500 hover:text-blue-500 hover:bg-white/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-all duration-200 ${
                      isActive ? "text-blue-600 scale-110" : "text-gray-400"
                    }`}
                  />
                  <span className={isActive ? "font-bold" : "font-medium"}>
                    {tab.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;