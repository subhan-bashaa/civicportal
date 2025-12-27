import { useAuth } from '@/lib/authContext';
import { useComplaints } from '@/lib/complaintsContext';
import { Layout } from '@/components/Layout';
import { ComplaintCard } from '@/components/ComplaintCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { complaints } = useComplaints();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Filter complaints based on user role
  const relevantComplaints = user?.role === 'citizen'
    ? complaints.filter(c => c.citizenId === user.id)
    : user?.role === 'officer'
    ? complaints.filter(c => c.wardId === user.wardId)
    : complaints;

  // Calculate stats
  const stats = {
    total: relevantComplaints.length,
    open: relevantComplaints.filter(c => c.status === 'open').length,
    inProgress: relevantComplaints.filter(c => c.status === 'in-progress').length,
    resolved: relevantComplaints.filter(c => c.status === 'resolved').length,
    reopened: relevantComplaints.filter(c => c.status === 're-opened').length,
    slaBreached: relevantComplaints.filter(c => 
      c.status !== 'resolved' && new Date(c.slaDeadline) < new Date()
    ).length,
  };

  const recentComplaints = relevantComplaints.slice(0, 5);

  const statCards = [
    { title: 'Total Complaints', value: stats.total, icon: FileText, color: 'text-foreground', bg: 'bg-muted' },
    { title: 'Open', value: stats.open, icon: Clock, color: 'text-status-info', bg: 'bg-status-info-bg' },
    { title: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-status-warning', bg: 'bg-status-warning-bg' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-status-success', bg: 'bg-status-success-bg' },
    { title: 'Re-Opened', value: stats.reopened, icon: RefreshCw, color: 'text-status-danger', bg: 'bg-status-danger-bg' },
    { title: 'SLA Breached', value: stats.slaBreached, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {user?.role === 'citizen' ? 'My Dashboard' : 
               user?.role === 'officer' ? 'Ward Dashboard' : 'Admin Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'citizen' 
                ? 'Track your complaints and submissions'
                : user?.role === 'officer'
                ? 'Manage complaints in your assigned ward'
                : 'Overview of all civic complaints'}
            </p>
          </div>
          {user?.role === 'citizen' && (
            <Link to="/complaints/new">
              <Button className="gap-2 gradient-accent text-accent-foreground">
                <Plus className="h-4 w-4" />
                New Complaint
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="overflow-hidden">
              <CardContent className="p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Complaints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Complaints</CardTitle>
            <Link to="/complaints">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentComplaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No complaints yet</h3>
                <p className="text-muted-foreground mb-4">
                  {user?.role === 'citizen' 
                    ? "You haven't submitted any complaints yet."
                    : "No complaints assigned to your ward."}
                </p>
                {user?.role === 'citizen' && (
                  <Link to="/complaints/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Submit Your First Complaint
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
