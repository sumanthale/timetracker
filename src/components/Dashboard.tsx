import React, { useState, useEffect } from 'react';
import { Play, Square, BarChart3, Activity, Camera } from 'lucide-react';
import { TimeSession, IdleEvent } from '../types';
import { useTimer } from '../hooks/useTimer';
import { generateDummyScreenshots, calculateProductiveHours } from '../utils/timeUtils';
import Timer from './Timer';
import IdleTracker from './IdleTracker';
import ScreenshotGallery from './ScreenshotGallery';
import SubmissionForm from './SubmissionForm';

interface DashboardProps {
  onSessionSubmit: (session: TimeSession) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSessionSubmit }) => {
  const [isWorking, setIsWorking] = useState(false);
  const [currentSession, setCurrentSession] = useState<TimeSession | null>(null);
  const [idleEvents, setIdleEvents] = useState<IdleEvent[]>([]);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [totalIdleMinutes, setTotalIdleMinutes] = useState(0);
  
  const { seconds, reset } = useTimer(isWorking);

  // Simulate idle time detection
  useEffect(() => {
    if (!isWorking) return;

    const idleInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const idleDuration = Math.floor(Math.random() * 8) + 2;
        const idleEvent: IdleEvent = {
          id: Date.now().toString(),
          startTime: new Date(Date.now() - idleDuration * 60 * 1000).toISOString(),
          endTime: new Date().toISOString(),
          duration: idleDuration
        };
        
        setIdleEvents(prev => [...prev, idleEvent]);
        setTotalIdleMinutes(prev => prev + idleDuration);
      }
    }, Math.random() * 180000 + 120000);

    return () => clearInterval(idleInterval);
  }, [isWorking]);

  // Simulate screenshot capture every 10 minutes
  useEffect(() => {
    if (!isWorking) return;

    const screenshotInterval = setInterval(() => {
      const newScreenshot = generateDummyScreenshots(1)[0];
      setScreenshots(prev => [...prev, newScreenshot]);
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
      status: 'active'
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
    const productiveHours = calculateProductiveHours(totalMinutes, totalIdleMinutes);
    
    const updatedSession: TimeSession = {
      ...currentSession,
      clockOut: now.toISOString(),
      totalMinutes,
      idleMinutes: totalIdleMinutes,
      productiveHours,
      screenshots
    };
    
    setCurrentSession(updatedSession);
    setIsWorking(false);
    setShowSubmissionForm(true);
  };

  const handleSubmit = (comment?: string) => {
    if (!currentSession) return;

    const finalSession: TimeSession = {
      ...currentSession,
      status: 'submitted',
      approvalStatus: 'pending',
      lessHoursComment: comment
    };

    onSessionSubmit(finalSession);
    setCurrentSession(null);
    setShowSubmissionForm(false);
    setIdleEvents([]);
    setScreenshots([]);
    setTotalIdleMinutes(0);
    reset();
  };

  const handleCancelSubmission = () => {
    setShowSubmissionForm(false);
    setIsWorking(true);
  };

  return (
    <div className="space-y-6">
      {/* Timer */}
      <Timer seconds={seconds} isActive={isWorking} />

      {/* Control Button */}
      <div className="flex justify-center">
        {!isWorking ? (
          <button
            onClick={handleClockIn}
            className="group relative overflow-hidden flex items-center px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <Play className="w-6 h-6 mr-3" />
            <span className="text-lg font-semibold">Start Working</span>
          </button>
        ) : (
          <button
            onClick={handleClockOut}
            className="group relative overflow-hidden flex items-center px-10 py-5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <Square className="w-6 h-6 mr-3" />
            <span className="text-lg font-semibold">End Session</span>
          </button>
        )}
      </div>

      {/* Enhanced Stats Overview */}
      {isWorking && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm border border-blue-200 p-4 text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {calculateProductiveHours(Math.floor(seconds / 60), totalIdleMinutes).toFixed(1)}
            </div>
            <div className="text-xs font-medium text-blue-700">Productive Hrs</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm border border-purple-200 p-4 text-center">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-900 mb-1">{screenshots.length}</div>
            <div className="text-xs font-medium text-purple-700">Screenshots</div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-sm border border-amber-200 p-4 text-center">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-amber-900 mb-1">{idleEvents.length}</div>
            <div className="text-xs font-medium text-amber-700">Idle Events</div>
          </div>
        </div>
      )}

      {/* Enhanced Components */}
      {isWorking && (
        <>
          <IdleTracker idleEvents={idleEvents} totalIdleMinutes={totalIdleMinutes} />
          <ScreenshotGallery screenshots={screenshots} />
        </>
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