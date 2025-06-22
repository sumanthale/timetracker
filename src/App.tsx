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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-2xl shadow-lg">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  TimeTracker
                </h1>
                <p className="text-xs text-muted-foreground">
                  Track your productivity
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Tab Navigation */}
<div className="sticky top-14 z-40">
  <div className="max-w-md mx-auto px-4">
    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(tab.id as "dashboard" | "history")
            }
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-300 ease-in-out
              ${
                isActive
                  ? "bg-white text-blue-600 shadow-inner"
                  : "text-gray-500 hover:bg-white hover:text-blue-500"
              }`}
          >
            <Icon
              className={`w-5 h-5 transition-transform duration-200 ${
                isActive ? "scale-110 text-blue-600" : "text-gray-400"
              }`}
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  </div>
</div>


      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-8">
        {activeTab === "dashboard" ? (
          <Dashboard onSessionSubmit={handleSessionSubmit} />
        ) : (
          <PastSessions sessions={sessions} />
        )}
      </div>
    </div>
  );
}

export default App;
