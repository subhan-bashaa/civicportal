import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { useComplaints } from '@/lib/complaintsContext';
import { Layout } from '@/components/Layout';
import { SLATimer } from '@/components/SLATimer';
import { StatusBadge } from '@/components/StatusBadge';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import {
  MapPin,
  Calendar,
  User,
  RefreshCw,
  ArrowLeft,
  Clock,
  ImagePlus,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { getComplaintById, updateComplaintStatus, reopenComplaint } = useComplaints();
  const [reopenImage, setReopenImage] = useState('');
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const complaint = getComplaintById(id || '');

  if (!complaint) {
    return (
      <Layout>
        <div className="text-center py-16">
          <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Complaint not found</h3>
          <p className="text-muted-foreground mb-4">
            The complaint you're looking for doesn't exist.
          </p>
          <Link to="/complaints">
            <Button variant="outline">Back to Complaints</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const canUpdateStatus = user?.role === 'officer' || user?.role === 'admin';
  const canReopen = user?.role === 'citizen' && complaint.status === 'resolved' && complaint.citizenId === user.id;

  const handleStatusUpdate = () => {
    if (!newStatus) return;
    updateComplaintStatus(complaint.id, newStatus as typeof complaint.status);
    toast({
      title: 'Status Updated',
      description: `Complaint status changed to ${newStatus}`,
    });
    setNewStatus('');
  };

  const handleReopen = () => {
    if (!reopenImage.trim()) {
      toast({
        title: 'Image Required',
        description: 'Please provide a new image URL to reopen the complaint.',
        variant: 'destructive',
      });
      return;
    }
    reopenComplaint(complaint.id, reopenImage);
    toast({
      title: 'Complaint Re-Opened',
      description: 'Your complaint has been re-opened for review.',
    });
    setReopenImage('');
    setReopenDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link to="/complaints">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Complaints
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <CategoryIcon category={complaint.category} size="lg" />
                    <div>
                      <h1 className="text-xl font-bold text-foreground capitalize">
                        {complaint.category} Issue
                      </h1>
                      <p className="text-sm text-muted-foreground">ID: #{complaint.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={complaint.status} />
                    <SLATimer deadline={complaint.slaDeadline} status={complaint.status} />
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{complaint.description}</p>

                {/* Complaint Image */}
                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint evidence"
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* Re-opened Images */}
                {complaint.reopenImages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-status-danger" />
                      Re-open Evidence ({complaint.reopenImages.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {complaint.reopenImages.map((img, index) => (
                        <div key={index} className="rounded-lg overflow-hidden border border-border">
                          <img
                            src={img}
                            alt={`Re-open evidence ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {(canUpdateStatus || canReopen) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {canUpdateStatus && complaint.status !== 'resolved' && (
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <Label>Update Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleStatusUpdate} disabled={!newStatus}>
                        Update
                      </Button>
                    </div>
                  )}

                  {canReopen && (
                    <Dialog open={reopenDialogOpen} onOpenChange={setReopenDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full gap-2 border-status-danger text-status-danger hover:bg-status-danger-bg">
                          <RefreshCw className="h-4 w-4" />
                          Re-Open Complaint
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Re-Open Complaint</DialogTitle>
                          <DialogDescription>
                            If the issue hasn't been properly resolved, you can re-open this complaint.
                            Please provide a new image as evidence.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="reopen-image">New Evidence Image URL</Label>
                            <Input
                              id="reopen-image"
                              placeholder="https://example.com/image.jpg"
                              value={reopenImage}
                              onChange={(e) => setReopenImage(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              For demo purposes, use any valid image URL
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setReopenDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleReopen} className="bg-status-danger hover:bg-status-danger/90">
                            Re-Open Complaint
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{complaint.address}</p>
                    <p className="text-xs text-muted-foreground">{complaint.wardName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reported By</p>
                    <p className="text-sm font-medium text-foreground">{complaint.citizenName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium text-foreground">
                      {format(new Date(complaint.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium text-foreground">
                      {format(new Date(complaint.updatedAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                {complaint.reopenCount > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-status-danger-bg">
                      <RefreshCw className="h-4 w-4 text-status-danger" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Re-opened</p>
                      <p className="text-sm font-medium text-status-danger">
                        {complaint.reopenCount} time{complaint.reopenCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GPS Coordinates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">GPS Coordinates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Latitude</p>
                    <p className="font-mono text-foreground">{complaint.latitude.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Longitude</p>
                    <p className="font-mono text-foreground">{complaint.longitude.toFixed(4)}</p>
                  </div>
                </div>
                <Link to="/map">
                  <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
                    <MapPin className="h-4 w-4" />
                    View on Map
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
