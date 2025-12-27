import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SLATimer } from './SLATimer';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { Complaint } from '@/lib/mockData';
import { MapPin, Calendar, RefreshCw, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface ComplaintCardProps {
  complaint: Complaint;
  showActions?: boolean;
}

export function ComplaintCard({ complaint, showActions = true }: ComplaintCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-fade-in">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative sm:w-40 h-32 sm:h-auto flex-shrink-0">
            <img
              src={complaint.imageUrl}
              alt={complaint.category}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <SLATimer deadline={complaint.slaDeadline} status={complaint.status} compact />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <CategoryIcon category={complaint.category} size="sm" />
                <div>
                  <h3 className="font-semibold text-foreground capitalize">
                    {complaint.category} Issue
                  </h3>
                  <p className="text-xs text-muted-foreground">#{complaint.id}</p>
                </div>
              </div>
              <StatusBadge status={complaint.status} />
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {complaint.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{complaint.wardName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
              </div>
              {complaint.reopenCount > 0 && (
                <div className="flex items-center gap-1 text-status-danger">
                  <RefreshCw className="h-3 w-3" />
                  <span>Re-opened {complaint.reopenCount}x</span>
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex items-center gap-2">
                <Link to={`/complaints/${complaint.id}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
