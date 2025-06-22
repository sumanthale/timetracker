import React from 'react';
import { Clock, Zap, Play } from 'lucide-react';
import { formatTimeWithSeconds } from '../utils/timeUtils';

interface TimerProps {
  seconds: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ seconds, isActive }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl shadow-xl border border-gray-100">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 animate-pulse"></div>
        )}
      </div>
      
      <div className="relative z-10 p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`relative p-3 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/30' 
                : 'bg-gray-100'
            }`}>
              <Clock className={`w-7 h-7 transition-colors ${
                isActive ? 'text-white' : 'text-gray-400'
              }`} />
              {isActive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isActive ? 'Active Session' : 'Ready to Start'}
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                {isActive ? 'Tracking your productivity' : 'Click start to begin tracking'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="text-6xl font-mono font-bold text-gray-900 mb-3 tracking-tight">
              {formatTimeWithSeconds(seconds)}
            </div>
            {isActive && (
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
            )}
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/30 scale-105' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${
              isActive ? 'bg-white animate-pulse' : 'bg-gray-400'
            }`} />
            {isActive ? (
              <>
                <Zap className="w-4 h-4" />
                ACTIVELY TRACKING
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                READY TO START
              </>
            )}
          </div>
        </div>

        {/* Session Info */}
        {isActive ? (
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-5 border border-emerald-200">
            <div className="flex items-center justify-center gap-3 text-emerald-700">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Session in progress • Auto-saving data</span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Ready to track your productive work session
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;