import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getWardStats } from '@/lib/mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, Clock, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WardStats() {
  const wardStats = getWardStats();

  // Calculate totals
  const totals = wardStats.reduce(
    (acc, ward) => ({
      totalComplaints: acc.totalComplaints + ward.totalComplaints,
      openComplaints: acc.openComplaints + ward.openComplaints,
      resolvedComplaints: acc.resolvedComplaints + ward.resolvedComplaints,
      reopenedComplaints: acc.reopenedComplaints + ward.reopenedComplaints,
    }),
    { totalComplaints: 0, openComplaints: 0, resolvedComplaints: 0, reopenedComplaints: 0 }
  );

  const avgResolutionTime = wardStats.length > 0
    ? (wardStats.reduce((sum, w) => sum + w.avgResolutionTime, 0) / wardStats.length).toFixed(1)
    : 0;

  const overallResolutionRate = totals.totalComplaints > 0
    ? Math.round((totals.resolvedComplaints / totals.totalComplaints) * 100)
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <BarChart3 className="h-4 w-4" />
            Public Dashboard
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Ward-Wise Statistics</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time accountability dashboard showing civic complaint statistics across all wards.
            Track performance, resolution times, and identify areas needing attention.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="col-span-2 lg:col-span-1">
            <CardContent className="p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totals.totalComplaints}</p>
              <p className="text-xs text-muted-foreground">Total Complaints</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-info-bg mb-3">
                <Clock className="h-5 w-5 text-status-info" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totals.openComplaints}</p>
              <p className="text-xs text-muted-foreground">Open</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-success-bg mb-3">
                <CheckCircle className="h-5 w-5 text-status-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totals.resolvedComplaints}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-danger-bg mb-3">
                <RefreshCw className="h-5 w-5 text-status-danger" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totals.reopenedComplaints}</p>
              <p className="text-xs text-muted-foreground">Re-Opened</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-3">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{avgResolutionTime}h</p>
              <p className="text-xs text-muted-foreground">Avg Resolution</p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={overallResolutionRate} className="flex-1 h-3" />
              <span className="text-2xl font-bold text-foreground min-w-[4rem] text-right">
                {overallResolutionRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Ward Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ward Performance Details</CardTitle>
            <CardDescription>
              Detailed breakdown of complaint statistics by ward
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ward</TableHead>
                    <TableHead>Officer</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Open</TableHead>
                    <TableHead className="text-center">In Progress</TableHead>
                    <TableHead className="text-center">Resolved</TableHead>
                    <TableHead className="text-center">Re-Opened</TableHead>
                    <TableHead className="text-center">Avg Time</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wardStats.map((ward) => {
                    const resolutionRate = ward.totalComplaints > 0
                      ? Math.round((ward.resolvedComplaints / ward.totalComplaints) * 100)
                      : 0;
                    const performanceColor = resolutionRate >= 70
                      ? 'text-status-success'
                      : resolutionRate >= 40
                      ? 'text-status-warning'
                      : 'text-status-danger';

                    return (
                      <TableRow key={ward.wardId}>
                        <TableCell className="font-medium">{ward.wardName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-3 w-3 text-muted-foreground" />
                            </div>
                            {ward.officerName}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{ward.totalComplaints}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-status-info-bg text-status-info text-xs font-medium">
                            {ward.openComplaints}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-status-warning-bg text-status-warning text-xs font-medium">
                            {ward.inProgressComplaints}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-status-success-bg text-status-success text-xs font-medium">
                            {ward.resolvedComplaints}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={cn(
                            "inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full text-xs font-medium",
                            ward.reopenedComplaints > 0 ? "bg-status-danger-bg text-status-danger" : "bg-muted text-muted-foreground"
                          )}>
                            {ward.reopenedComplaints}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {ward.avgResolutionTime > 0 ? `${ward.avgResolutionTime}h` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={resolutionRate} className="w-16 h-2" />
                            <span className={cn("text-sm font-medium", performanceColor)}>
                              {resolutionRate}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-status-info" />
            <span>Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-status-warning" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-status-success" />
            <span>Resolved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-status-danger" />
            <span>Re-Opened</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
