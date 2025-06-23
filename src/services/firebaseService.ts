import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TimeSession } from '../types';
import dayjs from 'dayjs';

export class FirebaseService {
  static sessionsRef = collection(db, 'sessions');

  // Save a time session (enforce one session per user per day)
  static async saveSession(userId: string, session: TimeSession): Promise<string> {
    try {
      const dateKey = dayjs(session.date).format('YYYY-MM-DD');
      const sessionId = `${userId}_${dateKey}`;
      const sessionRef = doc(db, 'sessions', sessionId);

      const sessionData = {
        ...session,
        id: sessionId,
        userId,
        date: dateKey,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(sessionRef, sessionData);
      return sessionId;
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  // Get all sessions for a user (latest first)
  static async getUserSessions(userId: string): Promise<TimeSession[]> {
    try {
      const q = query(
        this.sessionsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc') // !Note can we use orderBy('createdAt', 'desc') instead?
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as TimeSession);
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
  }

  // Check if user has already submitted a session today
  static async getTodaySession(userId: string): Promise<TimeSession | null> {
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const sessionId = `${userId}_${today}`;

      const docRef = doc(db, 'sessions', sessionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as TimeSession;
        return data.status === 'submitted' ? data : null;
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
        approvedAt: dayjs().toISOString(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating session approval:', error);
      throw error;
    }
  }

  // Get user sessions between dates
  static async getSessionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TimeSession[]> {
    try {
      const start = dayjs(startDate).format('YYYY-MM-DD');
      const end = dayjs(endDate).format('YYYY-MM-DD');

      const q = query(
        this.sessionsRef,
        where('userId', '==', userId),
        where('date', '>=', start),
        where('date', '<=', end),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data() as TimeSession);
    } catch (error) {
      console.error('Error fetching date range sessions:', error);
      throw error;
    }
  }

  // Get all sessions by date range (for admin)
  static async getAllSessionsByDateRange(startDate: Date, endDate: Date): Promise<TimeSession[]> {
    try {
      const start = dayjs(startDate).format('YYYY-MM-DD');
      const end = dayjs(endDate).format('YYYY-MM-DD');

      const q = query(
        this.sessionsRef,
        where('date', '>=', start),
        where('date', '<=', end),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data() as TimeSession);
    } catch (error) {
      console.error('Error fetching all sessions by date range:', error);
      throw error;
    }
  }
}
