import React, { useState } from "react";
import { Clock, History, User, Calendar, Bell } from "lucide-react";
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

  // Get current date and time info
  const now = new Date();
  const userName = "Alex Johnson"; // This would come from your auth system
  const currentHour = now.getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Enhanced Modern Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/85 border-b border-gray-200/50 shadow-lg">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {/* Left: Logo and App Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  TimeTracker Pro
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Smart productivity tracking
                </p>
              </div>
            </div>
            
            {/* Right: User Greeting and Date */}
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {getGreeting()}, {userName.split(' ')[0]}!
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{now.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  weekday: 'short'
                })}</span>
                <span className="mx-1">•</span>
                <span className="font-medium">{formatTime(now)}</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Date Banner */}
          <div className="max-w-md mx-auto mt-4">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {formatDate(now)}
                    </div>
                    <div className="text-xs text-gray-600">
                      Week {Math.ceil(now.getDate() / 7)} • {formatTime(now)}
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats or Notifications */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-lg">
                    {sessions.filter(s => s.approvalStatus === 'pending').length} pending
                  </div>
                </div>
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

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-1.5 shadow-inner border border-gray-200/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "dashboard" | "history")
                  }
                  className={`flex-1 relative flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white/70"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-all duration-200 ${
                      isActive ? "text-white scale-110" : "text-gray-500"
                    }`}
                  />
                  <span className={isActive ? "font-bold" : "font-medium"}>
                    {tab.label}
                  </span>
                  
                  {/* Enhanced Active Indicator */}
                  {isActive && (
                    <>
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full shadow-lg"></div>
                      <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
                    </>
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