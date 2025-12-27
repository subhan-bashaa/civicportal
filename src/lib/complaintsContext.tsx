import React, { createContext, useContext, useState, useEffect } from 'react';
import { Complaint, demoComplaints, demoWards } from './mockData';

interface ComplaintsContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'slaDeadline' | 'reopenCount' | 'reopenImages'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  reopenComplaint: (id: string, newImageUrl: string) => void;
  getComplaintById: (id: string) => Complaint | undefined;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

const STORAGE_KEY = 'civic_demo_complaints';

export function ComplaintsProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // Load from localStorage or use demo data
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const restored = parsed.map((c: Complaint) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          slaDeadline: new Date(c.slaDeadline),
          resolvedAt: c.resolvedAt ? new Date(c.resolvedAt) : undefined,
        }));
        setComplaints(restored);
      } catch {
        setComplaints(demoComplaints);
      }
    } else {
      setComplaints(demoComplaints);
    }
  }, []);

  useEffect(() => {
    if (complaints.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    }
  }, [complaints]);

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'slaDeadline' | 'reopenCount' | 'reopenImages'>) => {
    const now = new Date();
    const newComplaint: Complaint = {
      ...complaint,
      id: `c${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      slaDeadline: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours SLA
      reopenCount: 0,
      reopenImages: [],
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = {
            ...c,
            status,
            updatedAt: new Date(),
          };
          if (status === 'resolved') {
            updated.resolvedAt = new Date();
          }
          return updated;
        }
        return c;
      })
    );
  };

  const reopenComplaint = (id: string, newImageUrl: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          const now = new Date();
          return {
            ...c,
            status: 're-opened' as const,
            updatedAt: now,
            slaDeadline: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Reset SLA
            reopenCount: c.reopenCount + 1,
            reopenImages: [...c.reopenImages, newImageUrl],
            resolvedAt: undefined,
          };
        }
        return c;
      })
    );
  };

  const getComplaintById = (id: string) => {
    return complaints.find(c => c.id === id);
  };

  return (
    <ComplaintsContext.Provider value={{ complaints, addComplaint, updateComplaintStatus, reopenComplaint, getComplaintById }}>
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintsContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintsProvider');
  }
  return context;
}
