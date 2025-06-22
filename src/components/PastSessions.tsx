import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Eye,
  Camera,
} from "lucide-react";
import { TimeSession, HistoryFilters } from "../types";
import { formatDate, formatTime } from "../utils/timeUtils";
import dayjs from "dayjs";

interface PastSessionsProps {
  sessions: TimeSession[];
}

const PastSessions: React.FC<PastSessionsProps> = ({ sessions }) => {
  const [filters, setFilters] = useState<HistoryFilters>({
    status: "all",
    dateRange: "all",
    hoursRange: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<TimeSession | null>(
    null
  );

  // Add some dummy approval data to sessions
  const enhancedSessions = useMemo(() => {
    return sessions.map((session) => ({
      ...session,
      approvalStatus:
        session.approvalStatus ||
        (["pending", "approved", "rejected"][Math.floor(Math.random() * 3)] as
          | "pending"
          | "approved"
          | "rejected"),
      approvedBy:
        session.approvedBy ||
        (Math.random() > 0.5 ? "Sarah Johnson" : "Mike Chen"),
      approvedAt:
        session.approvedAt ||
        new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      approvalComment:
        session.approvalComment ||
        (Math.random() > 0.7 ? "Good work today!" : undefined),
    }));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return enhancedSessions.filter((session) => {
      // Status filter
      if (
        filters.status !== "all" &&
        session.approvalStatus !== filters.status
      ) {
        return false;
      }

      // Hours filter
      if (filters.hoursRange === "full" && session.productiveHours < 8) {
        return false;
      }
      if (filters.hoursRange === "partial" && session.productiveHours >= 8) {
        return false;
      }

      // Date range filter
      const sessionDate = new Date(session.date);
      const now = new Date();
      if (filters.dateRange === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (sessionDate < weekAgo) return false;
      } else if (filters.dateRange === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (sessionDate < monthAgo) return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          formatDate(sessionDate).toLowerCase().includes(searchLower) ||
          session.lessHoursComment?.toLowerCase().includes(searchLower) ||
          session.approvalComment?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [enhancedSessions, filters, searchTerm]);


  const getStatusBadge = (status: string) => {
    const base = "px-2 py-0.5 text-xs rounded-full font-semibold";
    switch (status) {
      case "approved":
        return `${base} bg-green-100 text-green-700`;
      case "rejected":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-yellow-100 text-yellow-700`;
    }
  };

  const getStatusIcon = (status: string) => {
    const size = "w-4 h-4 mr-2";
    switch (status) {
      case "approved":
        return <CheckCircle className={`${size} text-green-500`} />;
      case "rejected":
        return <XCircle className={`${size} text-red-500`} />;
      default:
        return <AlertCircle className={`${size} text-yellow-500`} />;
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
       <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work History</h1>
          <p className="text-gray-500 text-sm">Track and manage your past sessions</p>
        </div>
      </div>


  <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring focus:ring-blue-200"
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as any }))}
            className="text-sm px-3 py-2 rounded-md border border-gray-200"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters((f) => ({ ...f, dateRange: e.target.value as any }))}
            className="text-sm px-3 py-2 rounded-md border border-gray-200"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
          <select
            value={filters.hoursRange}
            onChange={(e) => setFilters((f) => ({ ...f, hoursRange: e.target.value as any }))}
            className="text-sm px-3 py-2 rounded-md border border-gray-200"
          >
            <option value="all">All Hours</option>
            <option value="full">8+ Hours</option>
            <option value="partial">Under 8 Hours</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center">
                    <div className="mr-4">
                      {getStatusIcon(session.approvalStatus!)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {dayjs(session.date).format(" ddd, MMM DD")}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        session.productiveHours >= 8
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {session.productiveHours.toFixed(1)}h
                    </div>

                    <div className="text-xs text-gray-500">
                      <span className={getStatusBadge(session.approvalStatus!) + 
                        "  text-[10px] font-semibold -mr-2"
                      }>
                        {session.approvalStatus?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Clock In
                      </span>
                    </div>
                    <div className="text-lg text-center font-bold text-gray-900">
                      {/* {formatDateTime(new Date(session.clockIn))} */}
                      {dayjs(session.clockIn).format("hh:mm A")}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Clock Out
                      </span>
                    </div>
                    <div className="text-lg text-center font-bold text-gray-900">
                      {session.clockOut
                        ? dayjs(session.clockOut).format("hh:mm A")
                        : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-900">
                      {formatTime(session.totalMinutes)}
                    </div>
                    <div className="text-xs text-blue-700">Total Time</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-xl">
                    <div className="text-lg font-bold text-amber-900">
                      {formatTime(session.idleMinutes)}
                    </div>
                    <div className="text-xs text-amber-700">Idle Time</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-lg font-bold text-purple-900">
                      {session.screenshots.length}
                    </div>
                    <div className="text-xs text-purple-700">Screenshots</div>
                  </div>
                </div>

                {/* Comments */}
                {session.lessHoursComment && (
                  <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start">
                      <MessageCircle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-amber-800 mb-1">
                          Reason for less than 8 hours:
                        </div>
                        <p className="text-sm text-amber-700">
                          {session.lessHoursComment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {session.approvalComment && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start">
                      <MessageCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-blue-800 mb-1">
                          Manager Comment:
                        </div>
                        <p className="text-sm text-blue-700">
                          {session.approvalComment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => setSelectedSession(session)}
                  className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 font-medium"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No sessions found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ||
            filters.status !== "all" ||
            filters.dateRange !== "all" ||
            filters.hoursRange !== "all"
              ? "Try adjusting your filters or search terms"
              : "Your submitted work sessions will appear here"}
          </p>
          {(searchTerm ||
            filters.status !== "all" ||
            filters.dateRange !== "all" ||
            filters.hoursRange !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  status: "all",
                  dateRange: "all",
                  hoursRange: "all",
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Session Details
                </h3>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatDate(new Date(selectedSession.date))}
                  </div>
                  <div
                    className={getStatusBadge(selectedSession.approvalStatus!)}
                  >
                    {selectedSession.approvalStatus?.toUpperCase()}
                  </div>
                </div>

                {/* Screenshots Preview */}
                {selectedSession.screenshots.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Screenshots ({selectedSession.screenshots.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSession.screenshots
                        .slice(0, 4)
                        .map((screenshot, index) => (
                          <img
                            key={index}
                            src={screenshot}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                    </div>
                    {selectedSession.screenshots.length > 4 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        +{selectedSession.screenshots.length - 4} more
                        screenshots
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastSessions;
