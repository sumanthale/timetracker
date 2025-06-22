import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { formatTimeWithSeconds } from '../utils/timeUtils';

interface TimerProps {
  seconds: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ seconds, isActive }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className={`p-3 rounded-full ${isActive ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
            <Clock className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isActive ? 'Active Session' : 'Ready to Start'}
            </h2>
            <p className="text-sm text-gray-500">
              {isActive ? 'Time is being tracked' : 'Click to begin tracking'}
            </p>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-5xl font-mono font-bold text-gray-900 mb-2 tracking-tight">
            {formatTimeWithSeconds(seconds)}
          </div>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isActive ? 'bg-white animate-pulse' : 'bg-gray-400'
            }`} />
            {isActive ? (
              <>
                <Zap className="w-3 h-3 mr-1" />
                TRACKING
              </>
            ) : (
              'INACTIVE'
            )}
          </div>
        </div>

        {isActive && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-center text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">Session in progress...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;