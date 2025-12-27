import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useComplaints } from '@/lib/complaintsContext';
import { Layout } from '@/components/Layout';
import { ComplaintCard } from '@/components/ComplaintCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, Navigate } from 'react-router-dom';
import { Plus, Search, Filter, FileText } from 'lucide-react';

export default function Complaints() {
  const { user, isAuthenticated } = useAuth();
  const { complaints } = useComplaints();
  const [apiComplaints, setApiComplaints] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Build the base list (prefer API results when available), then apply all filters
  const baseList = apiComplaints.length > 0 ? apiComplaints : complaints;

  // Filter based on user role
  let filteredComplaints = user?.role === 'citizen'
    ? baseList.filter((c: any) => c.citizenId === user.id)
    : user?.role === 'officer'
    ? baseList.filter((c: any) => c.wardId === user.wardId)
    : baseList;

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredComplaints = filteredComplaints.filter((c: any) => {
      const desc = (c.description || '').toString().toLowerCase();
      const addr = (c.address || '').toString().toLowerCase();
      const ident = (c.id ?? '').toString().toLowerCase();
      const cat = (c.category || '').toString().toLowerCase();
      return desc.includes(searchLower) || addr.includes(searchLower) || ident.includes(searchLower) || cat.includes(searchLower);
    });
  }

  // Apply status filter
  if (statusFilter !== 'all') {
    filteredComplaints = filteredComplaints.filter((c: any) => c.status === statusFilter);
  }

  // Apply category filter
  if (categoryFilter !== 'all') {
    filteredComplaints = filteredComplaints.filter((c: any) => c.category === categoryFilter);
  }

  const displayedComplaints = filteredComplaints;

  useEffect(() => {
    let mounted = true;
    fetch('/api/complaints')
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          // Normalize API complaints to the local UI shape
          const mapped = data.map((c: any) => ({
            id: String(c.id),
            citizenId: c.citizen_id || 'unknown',
            citizenName: c.citizen_name || 'Citizen',
            category: c.category || 'garbage',
            description: c.description || c.title || '',
            imageUrl: c.image_path || c.imageUrl || '',
            latitude: c.latitude || 0,
            longitude: c.longitude || 0,
            address: c.address || '',
            wardId: c.wardId || 'w1',
            wardName: c.wardName || c.address || 'Unknown Ward',
            status: c.status || 'open',
            createdAt: c.created_at ? new Date(c.created_at) : new Date(),
            updatedAt: c.updated_at ? new Date(c.updated_at) : new Date(),
            resolvedAt: c.resolved_at ? new Date(c.resolved_at) : undefined,
            reopenCount: c.reopen_count || 0,
            reopenImages: c.reopen_images || [],
            slaDeadline: c.sla_deadline ? new Date(c.sla_deadline) : new Date(),
          }));
          setApiComplaints(mapped as any[]);
        }
      })
      .catch((err) => {
        if (mounted) setApiError(String(err));
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {user?.role === 'citizen' ? 'My Complaints' : 'All Complaints'}
            </h1>
            <p className="text-muted-foreground">
              {displayedComplaints.length} complaint{displayedComplaints.length !== 1 ? 's' : ''} found
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by description, address, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
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
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="garbage">Garbage</SelectItem>
                <SelectItem value="drainage">Drainage</SelectItem>
                <SelectItem value="road">Road</SelectItem>
                <SelectItem value="streetlight">Streetlight</SelectItem>
                <SelectItem value="water">Water Supply</SelectItem>
                <SelectItem value="trees">Trees</SelectItem>
                <SelectItem value="sanitation">Sanitation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Complaints List */}
        {displayedComplaints.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No complaints found</h3>
            <p className="text-muted-foreground mb-4">
                {search || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : user?.role === 'citizen'
                  ? "You haven't submitted any complaints yet."
                  : "No complaints in your assigned area."}
            </p>
            {user?.role === 'citizen' && !search && statusFilter === 'all' && categoryFilter === 'all' && (
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
            {apiError && (
              <div className="text-red-600">API error: {apiError}</div>
            )}
            {displayedComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
