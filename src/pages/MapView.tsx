import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { useComplaints } from '@/lib/complaintsContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { CategoryIcon } from '@/components/CategoryIcon';
import { SLATimer } from '@/components/SLATimer';
import { Complaint, categoryConfig, statusConfig } from '@/lib/mockData';
import {
  MapPin,
  Layers,
  Filter,
  X,
  ZoomIn,
  ZoomOut,
  Locate,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function MapView() {
  const { isAuthenticated } = useAuth();
  const { complaints } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [zoom, setZoom] = useState(12);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Filter complaints
  let filteredComplaints = complaints;
  if (statusFilter !== 'all') {
    filteredComplaints = filteredComplaints.filter(c => c.status === statusFilter);
  }
  if (categoryFilter !== 'all') {
    filteredComplaints = filteredComplaints.filter(c => c.category === categoryFilter);
  }

  // Calculate bounds for demo map
  const centerLat = 28.6139;
  const centerLng = 77.2090;

  const getMarkerPosition = (complaint: Complaint) => {
    const x = ((complaint.longitude - centerLng) / 0.1) * 50 + 50;
    const y = ((centerLat - complaint.latitude) / 0.1) * 50 + 50;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const getMarkerColor = (complaint: Complaint) => {
    const now = new Date().getTime();
    const deadline = new Date(complaint.slaDeadline).getTime();
    const remaining = deadline - now;
    const totalSla = 24 * 60 * 60 * 1000;
    const percentRemaining = (remaining / totalSla) * 100;

    if (complaint.status === 'resolved') return 'bg-status-success';
    if (remaining <= 0) return 'bg-status-danger';
    if (percentRemaining <= 25) return 'bg-status-warning';
    return 'bg-status-info';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Complaint Map</h1>
            <p className="text-muted-foreground">
              {filteredComplaints.length} complaints displayed
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="re-opened">Re-Opened</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[130px]">
                <Layers className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="garbage">Garbage</SelectItem>
                <SelectItem value="drainage">Drainage</SelectItem>
                <SelectItem value="road">Road</SelectItem>
                <SelectItem value="streetlight">Streetlight</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-[500px] bg-muted overflow-hidden">
                  {/* Demo Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-secondary/50">
                    {/* Grid lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                      <defs>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>

                    {/* Demo roads */}
                    <svg className="absolute inset-0 w-full h-full">
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="hsl(var(--border))" strokeWidth="3" />
                      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="hsl(var(--border))" strokeWidth="3" />
                      <line x1="20%" y1="0" x2="80%" y2="100%" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="10 5" />
                    </svg>

                    {/* Markers */}
                    {filteredComplaints.map((complaint) => {
                      const pos = getMarkerPosition(complaint);
                      const isSelected = selectedComplaint?.id === complaint.id;
                      return (
                        <button
                          key={complaint.id}
                          className={cn(
                            "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
                            isSelected && "z-20 scale-125"
                          )}
                          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          <div className="relative">
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center shadow-lg border-2 border-background",
                              getMarkerColor(complaint),
                              isSelected && "ring-2 ring-offset-2 ring-accent"
                            )}>
                              <MapPin className="h-4 w-4 text-background" />
                            </div>
                            {/* Pulse effect for breached SLA */}
                            {new Date(complaint.slaDeadline) < new Date() && complaint.status !== 'resolved' && (
                              <div className={cn(
                                "absolute inset-0 rounded-full animate-pulse-ring",
                                getMarkerColor(complaint)
                              )} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="shadow-md"
                      onClick={() => setZoom(Math.min(zoom + 1, 18))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="shadow-md"
                      onClick={() => setZoom(Math.max(zoom - 1, 8))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="shadow-md">
                      <Locate className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Demo notice */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur text-xs text-muted-foreground border border-border">
                    Demo map view - Real implementation would use Google Maps API
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur rounded-lg p-3 border border-border">
                    <p className="text-xs font-medium text-foreground mb-2">SLA Status</p>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-status-success" />
                        <span className="text-muted-foreground">On Track</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-status-warning" />
                        <span className="text-muted-foreground">{'< 25% time left'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-status-danger" />
                        <span className="text-muted-foreground">SLA Breached</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complaint Details Sidebar */}
          <div className="space-y-4">
            {selectedComplaint ? (
              <Card className="animate-fade-in">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">Complaint Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -mr-2 -mt-2"
                      onClick={() => setSelectedComplaint(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={selectedComplaint.imageUrl}
                      alt="Complaint"
                      className="w-full h-32 object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <CategoryIcon category={selectedComplaint.category} size="sm" showLabel />
                    <StatusBadge status={selectedComplaint.status} />
                  </div>

                  <div>
                    <SLATimer deadline={selectedComplaint.slaDeadline} status={selectedComplaint.status} />
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {selectedComplaint.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-foreground">{selectedComplaint.address}</p>
                        <p className="text-muted-foreground text-xs">{selectedComplaint.wardName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/complaints/${selectedComplaint.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        View Full Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Select a Marker</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any map marker to view complaint details
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Visible Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-center">
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const count = filteredComplaints.filter(c => c.status === key).length;
                    return (
                      <div key={key} className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold" style={{ color: `hsl(var(--${config.color}))` }}>
                          {count}
                        </p>
                        <p className="text-xs text-muted-foreground">{config.label}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
