export type UserRole = 'citizen' | 'officer' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  wardId?: string;
}

export interface Ward {
  id: string;
  name: string;
  officerId: string;
  officerName: string;
}

export interface Complaint {
  id: string;
  citizenId: string;
  citizenName: string;
  category: 'garbage' | 'drainage' | 'road' | 'streetlight' | 'water' | 'trees' | 'sanitation';
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  wardId: string;
  wardName: string;
  status: 'open' | 'in-progress' | 'resolved' | 're-opened';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  reopenCount: number;
  reopenImages: string[];
  slaDeadline: Date;
}

// Demo Users
export const demoUsers: User[] = [
  { id: 'u1', email: 'citizen@demo.com', password: 'demo123', name: 'Rajesh Kumar', role: 'citizen' },
  { id: 'u2', email: 'citizen2@demo.com', password: 'demo123', name: 'Priya Sharma', role: 'citizen' },
  { id: 'u3', email: 'officer@demo.com', password: 'demo123', name: 'Anil Verma', role: 'officer', wardId: 'w1' },
  { id: 'u4', email: 'officer2@demo.com', password: 'demo123', name: 'Sunita Patel', role: 'officer', wardId: 'w2' },
  { id: 'u5', email: 'admin@demo.com', password: 'demo123', name: 'Administrator', role: 'admin' },
];

// Demo Wards
export const demoWards: Ward[] = [
  { id: 'w1', name: 'Ward 1 - Central', officerId: 'u3', officerName: 'Anil Verma' },
  { id: 'w2', name: 'Ward 2 - North', officerId: 'u4', officerName: 'Sunita Patel' },
  { id: 'w3', name: 'Ward 3 - South', officerId: 'u3', officerName: 'Anil Verma' },
  { id: 'w4', name: 'Ward 4 - East', officerId: 'u4', officerName: 'Sunita Patel' },
  { id: 'w5', name: 'Ward 5 - West', officerId: 'u3', officerName: 'Anil Verma' },
];

// Helper to create dates
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);
const hoursFromNow = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000);

// Demo Complaints with various statuses and SLA states
export const demoComplaints: Complaint[] = [
  {
    id: 'c1',
    citizenId: 'u1',
    citizenName: 'Rajesh Kumar',
    category: 'garbage',
    description: 'Large pile of garbage dumped near the park entrance. Causing bad smell and attracting stray animals.',
    imageUrl: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
    latitude: 28.6139,
    longitude: 77.2090,
    address: '123 Park Road, Central Delhi',
    wardId: 'w1',
    wardName: 'Ward 1 - Central',
    status: 'open',
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(6),
    reopenCount: 0,
    reopenImages: [],
    slaDeadline: hoursFromNow(18),
  },
  {
    id: 'c2',
    citizenId: 'u2',
    citizenName: 'Priya Sharma',
    category: 'drainage',
    description: 'Blocked drain causing water logging during rains. Water entering nearby shops.',
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=400',
    latitude: 28.6200,
    longitude: 77.2150,
    address: '456 Market Street, North Delhi',
    wardId: 'w2',
    wardName: 'Ward 2 - North',
    status: 'in-progress',
    createdAt: hoursAgo(20),
    updatedAt: hoursAgo(4),
    reopenCount: 0,
    reopenImages: [],
    slaDeadline: hoursFromNow(4),
  },
  {
    id: 'c3',
    citizenId: 'u1',
    citizenName: 'Rajesh Kumar',
    category: 'road',
    description: 'Deep pothole on main road causing accidents. Multiple vehicles damaged.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400',
    latitude: 28.6050,
    longitude: 77.2000,
    address: '789 Highway Junction, South Delhi',
    wardId: 'w3',
    wardName: 'Ward 3 - South',
    status: 'resolved',
    createdAt: hoursAgo(72),
    updatedAt: hoursAgo(24),
    resolvedAt: hoursAgo(24),
    reopenCount: 0,
    reopenImages: [],
    slaDeadline: hoursAgo(48),
  },
  {
    id: 'c4',
    citizenId: 'u2',
    citizenName: 'Priya Sharma',
    category: 'streetlight',
    description: 'Street light not working for past week. Area completely dark at night.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    latitude: 28.6300,
    longitude: 77.2200,
    address: '101 Dark Lane, East Delhi',
    wardId: 'w4',
    wardName: 'Ward 4 - East',
    status: 're-opened',
    createdAt: hoursAgo(48),
    updatedAt: hoursAgo(2),
    reopenCount: 1,
    reopenImages: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    slaDeadline: hoursFromNow(22),
  },
  {
    id: 'c5',
    citizenId: 'u1',
    citizenName: 'Rajesh Kumar',
    category: 'garbage',
    description: 'Construction debris dumped illegally on roadside.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    latitude: 28.5950,
    longitude: 77.1900,
    address: '202 West Avenue, West Delhi',
    wardId: 'w5',
    wardName: 'Ward 5 - West',
    status: 'open',
    createdAt: hoursAgo(26),
    updatedAt: hoursAgo(26),
    reopenCount: 0,
    reopenImages: [],
    slaDeadline: hoursAgo(2), // SLA breached
  },
  {
    id: 'c6',
    citizenId: 'u2',
    citizenName: 'Priya Sharma',
    category: 'drainage',
    description: 'Overflowing sewage near residential area. Health hazard for residents.',
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=400',
    latitude: 28.6100,
    longitude: 77.2050,
    address: '303 Residential Colony, Central Delhi',
    wardId: 'w1',
    wardName: 'Ward 1 - Central',
    status: 'in-progress',
    createdAt: hoursAgo(12),
    updatedAt: hoursAgo(6),
    reopenCount: 0,
    reopenImages: [],
    slaDeadline: hoursFromNow(12),
  },
];

// Category icons and colors
export const categoryConfig = {
  garbage: { label: 'Garbage', icon: 'Trash2', color: 'hsl(38 92% 50%)' },
  drainage: { label: 'Drainage', icon: 'Droplets', color: 'hsl(205 85% 50%)' },
  road: { label: 'Road', icon: 'Construction', color: 'hsl(25 95% 53%)' },
  streetlight: { label: 'Streetlight', icon: 'Lightbulb', color: 'hsl(47 96% 53%)' },
};

// Status configuration
export const statusConfig = {
  'open': { label: 'Open', color: 'status-info', bgColor: 'status-info-bg' },
  'in-progress': { label: 'In Progress', color: 'status-warning', bgColor: 'status-warning-bg' },
  'resolved': { label: 'Resolved', color: 'status-success', bgColor: 'status-success-bg' },
  're-opened': { label: 'Re-Opened', color: 'status-danger', bgColor: 'status-danger-bg' },
};

// Ward statistics (calculated)
export function getWardStats() {
  return demoWards.map(ward => {
    const wardComplaints = demoComplaints.filter(c => c.wardId === ward.id);
    const resolved = wardComplaints.filter(c => c.status === 'resolved');
    const reopened = wardComplaints.filter(c => c.reopenCount > 0);
    
    // Calculate average resolution time
    const resolvedWithTime = resolved.filter(c => c.resolvedAt);
    const avgResolutionHours = resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((sum, c) => {
          return sum + (c.resolvedAt!.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60);
        }, 0) / resolvedWithTime.length
      : 0;

    return {
      wardId: ward.id,
      wardName: ward.name,
      officerName: ward.officerName,
      totalComplaints: wardComplaints.length,
      openComplaints: wardComplaints.filter(c => c.status === 'open').length,
      inProgressComplaints: wardComplaints.filter(c => c.status === 'in-progress').length,
      resolvedComplaints: resolved.length,
      reopenedComplaints: reopened.length,
      avgResolutionTime: Math.round(avgResolutionHours * 10) / 10,
    };
  });
}
