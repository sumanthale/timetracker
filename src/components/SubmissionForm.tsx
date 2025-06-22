import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Send, Clock, Camera, Activity } from 'lucide-react';
import { TimeSession } from '../types';
import { formatDateTime, formatTime } from '../utils/timeUtils';

interface SubmissionFormProps {
  session: TimeSession;
  onSubmit: (comment?: string) => void;
  onCancel: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ session, onSubmit, onCancel }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const needsComment = session.productiveHours < 8;

  const handleSubmit = async () => {
    if (needsComment && !comment.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit(comment.trim() || undefined);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Work Summary</h2>
            <p className="text-gray-600">Review your session before submission</p>
          </div>

          {/* Session Summary */}
          <div className="space-y-6 mb-8">
            {/* Date and Status */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Today's Session</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Clock In</div>
                  <div className="font-semibold text-gray-900">
                    {formatDateTime(new Date(session.clockIn))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Clock Out</div>
                  <div className="font-semibold text-gray-900">
                    {session.clockOut ? formatDateTime(new Date(session.clockOut)) : 'Now'}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-900">{formatTime(session.totalMinutes)}</div>
                <div className="text-xs text-blue-700">Total Time</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                <Activity className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-amber-900">{formatTime(session.idleMinutes)}</div>
                <div className="text-xs text-amber-700">Idle Time</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                <Camera className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-purple-900">{session.screenshots.length}</div>
                <div className="text-xs text-purple-700">Screenshots</div>
              </div>
            </div>

            {/* Productive Hours Highlight */}
            <div className={`rounded-2xl p-6 border-2 ${
              session.productiveHours >= 8 
                ? 'bg-green-50 border-green-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">Productive Hours</div>
                <div className={`text-4xl font-bold mb-2 ${
                  session.productiveHours >= 8 ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {session.productiveHours.toFixed(2)}
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  session.productiveHours >= 8 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {session.productiveHours >= 8 ? '✓ Full Day' : '⚠ Partial Day'}
                </div>
              </div>
            </div>

            {/* Comment Section for < 8 hours */}
            {needsComment && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
                  <div>
                    <h4 className="font-bold text-amber-800">Explanation Required</h4>
                    <p className="text-sm text-amber-700">Please provide a reason for working less than 8 hours</p>
                  </div>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g., Doctor appointment, family emergency, sick leave..."
                  className="w-full p-4 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all duration-200"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-amber-600">
                    {comment.length}/500 characters
                  </div>
                  {comment.length < 10 && (
                    <div className="text-xs text-amber-700 font-medium">
                      Please provide more details
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-semibold"
              disabled={isSubmitting}
            >
              Continue Working
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (needsComment && comment.trim().length < 10)}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Submitting...
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Session
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionForm;