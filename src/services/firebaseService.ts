import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TimeSession } from '../types';

export class FirebaseService {
  // Save a time session to Firestore
  static async saveSession(userId: string, session: TimeSession): Promise<string> {
    try {
      const sessionData = {
        ...session,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'sessions'), sessionData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  // Get all sessions for a user
  static async getUserSessions(userId: string): Promise<TimeSession[]> {
    try {
      const q = query(
        collection(db, 'sessions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const sessions: TimeSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          date: data.date,
          clockIn: data.clockIn,
          clockOut: data.clockOut,
          totalMinutes: data.totalMinutes,
          idleMinutes: data.idleMinutes,
          productiveHours: data.productiveHours,
          screenshots: data.screenshots || [],
          status: data.status,
          lessHoursComment: data.lessHoursComment,
          approvalStatus: data.approvalStatus,
          approvalComment: data.approvalComment,
          approvedBy: data.approvedBy,
          approvedAt: data.approvedAt
        });
      });

      return sessions;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  // Check if user has already submitted a session for today
  static async getTodaySession(userId: string): Promise<TimeSession | null> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const q = query(
        collection(db, 'sessions'),
        where('userId', '==', userId),
        where('date', '>=', startOfDay.toISOString()),
        where('date', '<', endOfDay.toISOString()),
        where('status', '==', 'submitted')
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          date: data.date,
          clockIn: data.clockIn,
          clockOut: data.clockOut,
          totalMinutes: data.totalMinutes,
          idleMinutes: data.idleMinutes,
          productiveHours: data.productiveHours,
          screenshots: data.screenshots || [],
          status: data.status,
          lessHoursComment: data.lessHoursComment,
          approvalStatus: data.approvalStatus,
          approvalComment: data.approvalComment,
          approvedBy: data.approvedBy,
          approvedAt: data.approvedAt
        };
      }

      return null;
    } catch (error) {
      console.error('Error checking today session:', error);
      throw error;
    }
  }

  // Delete a session
  static async deleteSession(sessionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'sessions', sessionId));
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  // Update session approval status
  static async updateSessionApproval(
    sessionId: string, 
    approvalStatus: 'approved' | 'rejected', 
    approvalComment?: string,
    approvedBy?: string
  ): Promise<void> {
    try {
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        approvalStatus,
        approvalComment: approvalComment || '',
        approvedBy: approvedBy || '',
        approvedAt: new Date().toISOString(),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating session approval:', error);
      throw error;
    }
  }

  // Get sessions by date range
  static async getSessionsByDateRange(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<TimeSession[]> {
    try {
      const q = query(
        collection(db, 'sessions'),
        where('userId', '==', userId),
        where('date', '>=', startDate.toISOString()),
        where('date', '<=', endDate.toISOString()),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const sessions: TimeSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          date: data.date,
          clockIn: data.clockIn,
          clockOut: data.clockOut,
          totalMinutes: data.totalMinutes,
          idleMinutes: data.idleMinutes,
          productiveHours: data.productiveHours,
          screenshots: data.screenshots || [],
          status: data.status,
          lessHoursComment: data.lessHoursComment,
          approvalStatus: data.approvalStatus,
          approvalComment: data.approvalComment,
          approvedBy: data.approvedBy,
          approvedAt: data.approvedAt
        });
      });

      return sessions;
    } catch (error) {
      console.error('Error fetching sessions by date range:', error);
      throw error;
    }
  }
}