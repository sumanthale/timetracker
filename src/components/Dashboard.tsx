import React, { useState, useEffect } from "react";
import {
  Play,
  Square,
  BarChart3,
  Activity,
  Camera,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import { TimeSession, IdleEvent } from "../types";
import { useTimer } from "../hooks/useTimer";
import { useAuth } from "../contexts/AuthContext";
import { FirebaseService } from "../services/firebaseService";
import {
  generateDummyScreenshots,
  calculateProductiveHours,
  formatDate,
  formatTime,
} from "../utils/timeUtils";
import Timer from "./Timer";
import IdleTracker from "./IdleTracker";
import ScreenshotGallery from "./ScreenshotGallery";
import SubmissionForm from "./SubmissionForm";

interface DashboardProps {
  onSessionSubmit: (session: TimeSession) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSessionSubmit }) => {
  const { currentUser } = useAuth();
  const [isWorking, setIsWorking] = useState(false);
  const [currentSession, setCurrentSession] = useState<TimeSession | null>(null);
  const [todaySession, setTodaySession] = useState<TimeSession | null>(null);
  const [idleEvents, setIdleEvents] = useState<IdleEvent[]>([]);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [totalIdleMinutes, setTotalIdleMinutes] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [checkingTodaySession, setCheckingTodaySession] = useState(true);

  const { seconds, reset } = useTimer(isWorking);

  // Check if user has already submitted today's session
  useEffect(() => {
    const checkTodaySession = async () => {
      if (!currentUser) return;

      try {
        const session = await FirebaseService.getTodaySession(currentUser.uid);
        setTodaySession(session);
      } catch (error) {
        console.error('Error checking today session:', error);
      } finally {
        setCheckingTodaySession(false);
      }
    };

    checkTodaySession();
  }, [currentUser]);

  //!Note: Simulate idle time detection
  useEffect(() => {
    if (!isWorking) return;

    const idleInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const idleDuration = Math.floor(Math.random() * 8) + 2;
        const idleEvent: IdleEvent = {
          id: Date.now().toString(),
          startTime: new Date(
            Date.now() - idleDuration * 60 * 1000
          ).toISOString(),
          endTime: new Date().toISOString(),
          duration: idleDuration,
        };

        setIdleEvents((prev) => [...prev, idleEvent]);
        setTotalIdleMinutes((prev) => prev + idleDuration);
      }
    }, Math.random() * 180000 + 120000);

    return () => clearInterval(idleInterval);
  }, [isWorking]);

  //!Note: Simulate screenshot capture every 10 minutes
  useEffect(() => {
    if (!isWorking) return;

    const screenshotInterval = setInterval(() => {
      const newScreenshot = generateDummyScreenshots(1)[0];
      setScreenshots((prev) => [...prev, newScreenshot]);
    }, 600000);

    return () => clearInterval(screenshotInterval);
  }, [isWorking]);

  const handleClockIn = () => {
    const now = new Date();
    const session: TimeSession = {
      id: Date.now().toString(),
      date: now.toISOString(),
      clockIn: now.toISOString(),
      totalMinutes: 0,
      idleMinutes: 0,
      productiveHours: 0,
      screenshots: [],
      status: "active",
    };

    setCurrentSession(session);
    setIsWorking(true);
    setIdleEvents([]);
    setScreenshots([]);
    setTotalIdleMinutes(0);
    reset();
  };

  const handleClockOut = () => {
    if (!currentSession) return;

    const now = new Date();
    const totalMinutes = Math.floor(seconds / 60);
    const productiveHours = calculateProductiveHours(
      totalMinutes,
      totalIdleMinutes
    );

    const updatedSession: TimeSession = {
      ...currentSession,
      clockOut: now.toISOString(),
      totalMinutes,
      idleMinutes: totalIdleMinutes,
      productiveHours,
      screenshots,
    };

    setCurrentSession(updatedSession);
    setIsWorking(false);
    setShowSubmissionForm(true);
  };

  const handleSubmit = async (comment?: string) => {
    if (!currentSession || !currentUser) return;

    const finalSession: TimeSession = {
      ...currentSession,
      status: "submitted",
      approvalStatus: "pending",
      lessHoursComment: comment,
    };

    try {
      await onSessionSubmit(finalSession);
      setTodaySession(finalSession);
      setCurrentSession(null);
      setShowSubmissionForm(false);
      setIdleEvents([]);
      setScreenshots([]);
      setTotalIdleMinutes(0);
      reset();
    } catch (error) {
      console.error('Error submitting session:', error);
    }
  };

  const handleCancelSubmission = () => {
    setShowSubmissionForm(false);
    setIsWorking(true);
  };

  const handleDeleteTodaySession = async () => {
    if (!todaySession || !currentUser) return;

    setIsDeleting(true);
    try {
      await FirebaseService.deleteSession(todaySession.id);
      setTodaySession(null);
    } catch (error) {
      console.error('Error deleting session:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const currentProductiveHours = calculateProductiveHours(
    Math.floor(seconds / 60),
    totalIdleMinutes
  );
  const efficiencyPercentage =
    seconds > 0
      ? Math.round(((seconds - totalIdleMinutes * 60) / seconds) * 100)
      : 100;

  // Show loading while checking today's session
  if (checkingTodaySession) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking today's productivity...</p>
        </div>
      </div>
    );
  }

  // Show today's session summary if already submitted
  if (todaySession) {
    return (
      <div className="space-y-6 pb-20">
        {/* Today's Session Completed */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-lg border border-green-200 overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Today's Productivity Logged!
            </h2>
            <p className="text-green-700 mb-6">
              You've successfully submitted your work session for today.
            </p>

            {/* Session Summary */}
            <div className="bg-white/70 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Date</div>
                  <div className="font-semibold text-gray-900">
                    {formatDate(new Date(todaySession.date))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    todaySession.approvalStatus === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : todaySession.approvalStatus === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {todaySession.approvalStatus === 'approved' && '✓ Approved'}
                    {todaySession.approvalStatus === 'rejected' && '✗ Rejected'}
                    {todaySession.approvalStatus === 'pending' && '⏳ Pending'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(todaySession.totalMinutes)}
                  </div>
                  <div className="text-xs text-gray-600">Total Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {todaySession.productiveHours.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-600">Productive</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {todaySession.screenshots.length}
                  </div>
                  <div className="text-xs text-gray-600">Screenshots</div>
                </div>
              </div>
            </div>

            {/* Work Times */}
            <div className="bg-white/70 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Clock In:</span>
                  <span className="font-semibold">
                    {new Date(todaySession.clockIn).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600">Clock Out:</span>
                  <span className="font-semibold">
                    {todaySession.clockOut ? new Date(todaySession.clockOut).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Comment if exists */}
            {todaySession.lessHoursComment && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <div className="text-sm font-semibold text-amber-800 mb-2">Your Note:</div>
                <p className="text-sm text-amber-700">{todaySession.lessHoursComment}</p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleDeleteTodaySession}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete & Create New
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 mt-3">
              Delete this session to create a new one for today
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Today's Summary
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-900">
                    {todaySession.productiveHours >= 8 ? '✅' : '⚠️'}
                  </div>
                  <div className="text-sm text-blue-700">
                    {todaySession.productiveHours >= 8 ? 'Full Day' : 'Partial Day'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-900">
                    {todaySession.productiveHours.toFixed(1)}h
                  </div>
                  <div className="text-xs text-blue-600">of 8h goal</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-900">📸</div>
                  <div className="text-sm text-purple-700">Screenshots</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-900">
                    {todaySession.screenshots.length}
                  </div>
                  <div className="text-xs text-purple-600">captured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Enhanced Timer Section */}
      <div className="relative">
        <Timer seconds={seconds} isActive={isWorking} />
        <div className="flex justify-center -mt-24 z-10 absolute left-0 right-0">
          {!isWorking ? (
            <button
              onClick={handleClockIn}
              className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">Start Working</div>
                  <div className="text-xs opacity-90">
                    Begin your productive session
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={handleClockOut}
              className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:via-rose-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Square className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">End Session</div>
                  <div className="text-xs opacity-90">
                    Complete and submit work
                  </div>
                </div>
              </div>
            </button>
          )}
        </div>
        {/* Floating Status Indicator */}
        {isWorking && (
          <div className="absolute -top-2 -right-2">
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Stats Dashboard */}
      {isWorking && (
        <div className="space-y-3 text-sm">
          {/* Primary Stats */}
          <div className="grid grid-cols-2 gap-3">
            {/* Productive Hours */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-900">
                    {currentProductiveHours.toFixed(1)}h
                  </div>
                  <div className="text-[11px] text-blue-700 tracking-wide uppercase">
                    Productive
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-blue-600">
                <span>Target: 8h</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    currentProductiveHours >= 8
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {currentProductiveHours >= 8 ? "On Track" : "In Progress"}
                </span>
              </div>
            </div>

            {/* Efficiency */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-900">
                    {efficiencyPercentage}%
                  </div>
                  <div className="text-[11px] text-emerald-700 tracking-wide uppercase">
                    Efficiency
                  </div>
                </div>
              </div>
              <div className="w-full bg-emerald-200/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(efficiencyPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-3 gap-3">
            <MiniStat
              icon={<Camera className="w-4 h-4 text-purple-600" />}
              value={screenshots.length}
              label="Screenshots"
              bg="purple-100"
            />
            <MiniStat
              icon={<Activity className="w-4 h-4 text-amber-600" />}
              value={idleEvents.length}
              label="Idle Events"
              bg="amber-100"
            />
            <MiniStat
              icon={<Zap className="w-4 h-4 text-indigo-600" />}
              value={Math.floor(seconds / 60)}
              label="Total Minutes"
              bg="indigo-100"
            />
          </div>

          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 text-[13px] font-medium text-gray-700">
              <span>Daily Progress</span>
              <span className="text-xs text-gray-500">
                {Math.min(Math.round((currentProductiveHours / 8) * 100), 100)}%
                Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mb-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (currentProductiveHours / 8) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>0h</span>
              <span>4h</span>
              <span className="font-semibold text-gray-600">8h Goal</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Activity Sections */}
      {isWorking && (
        <div className="space-y-6">
          <IdleTracker
            idleEvents={idleEvents}
            totalIdleMinutes={totalIdleMinutes}
          />
          <ScreenshotGallery screenshots={screenshots} />
        </div>
      )}

      {/* Welcome State for Non-Working */}
      {!isWorking && !showSubmissionForm && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to be productive?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start your work session to begin tracking time, capturing
            screenshots, and monitoring your productivity.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-xs font-medium text-gray-600">
                Track Time
              </div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-xs font-medium text-gray-600">
                Screenshots
              </div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-xs font-medium text-gray-600">Analytics</div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Form */}
      {showSubmissionForm && currentSession && (
        <SubmissionForm
          session={currentSession}
          onSubmit={handleSubmit}
          onCancel={handleCancelSubmission}
        />
      )}
    </div>
  );
};

export default Dashboard;

const MiniStat = ({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  bg: string;
}) => (
  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
    <div
      className={`w-8 h-8 rounded-md flex items-center justify-center mx-auto mb-1 bg-${bg}`}
    >
      {icon}
    </div>
    <div className="text-lg font-bold text-gray-900">{value}</div>
    <div className="text-xs text-gray-600">{label}</div>
  </div>
);